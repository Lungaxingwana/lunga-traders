import User from "../models/user.model.js";
import { generateToken } from "../libs/utils.js";
import {  uploadImage, deleteImage } from "./image.controller.js";


export const fetchAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: "Admin" }).exec();
        if (!admins) {
            res.status(404).json({ message: "No admins found" });
        }
        res.status(200).json(admins);
    } catch (error) {
        console.error("Error in fetchAdmins controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const signup = async (req, res) => {
    const { email, password, role, first_name, last_name, gender, cell_number, address } = req.body;
    const image = req.files?.profile_picture?.[0];
    console.log("Profile picture: ", image);
    console.log("Request body: ", req.body);
    try {
        if (!email || !password || !role || !first_name || !last_name || !gender || !cell_number || !address || !image) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const user = await User.findOne({ email }).exec();

        if (user) {
            return res.status(400).json({ message: "Email already exists. Login instead" });
        }

        // Use uploadImage to upload the image and get the imageId
        let profile_image_id = null;
        const uploadResult = await uploadImage(
            { file: image, internalCall: true },
            {}
        );
        profile_image_id = uploadResult?.imageId;

        const newUser = new User({
            email,
            password,
            role,
            person: {
                first_name,
                last_name,
                gender,
                cell_number,
                address,
                profile_image_id,
            }
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            return res.status(201).json(newUser);
        } else {
            return res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.error("Error in signup controller", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};



export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password }).exec();

        if (!user) {
            // Only send one response and return immediately
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user?._id, res);

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error in login controller", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logout controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateLastSeen = async (req, res) => {
    const { _id } = req.params;
    const { last_seen } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            _id,
            { last_seen },
            { new: true }
        ).exec();
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error in updateLastSeen controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async (req, res) => {
    const { email, password, role, first_name, last_name, gender, cell_number, address, profile_image_id } = req.body;
    const _id  = req.params._id;
    const image = req.files?.profile_picture?.[0];

    try {
        if (!_id || !email || !password || !role || !first_name || !last_name || !gender || !cell_number || !address || !profile_image_id) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({ message: "Password must be at least 6 characters" });
            return;
        }

        // Delete the existing image if present
        if (profile_image_id) {
            try {
                await deleteImage(
                    { params: { _id: profile_image_id }, internalCall: true },
                    {}
                );
            } catch (err) {
                console.error("Error deleting old profile image", err);
                // Continue even if image deletion fails
            }
        }

        // Upload the new image and get the new imageId
        let newProfileImageId = profile_image_id;
        console.log("BEFORE: ", newProfileImageId);
        if (image) {
            try {
                const uploadResult = await uploadImage(
            { file: image, internalCall: true },
            {}
        );
                console.log("Upload result: ", uploadResult);
                newProfileImageId = uploadResult?.imageId;
            } catch (err) {
                return res.status(400).json({ error: 'Image upload failed', details: err.message });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                email,
                password,
                role,
                person: {
                    first_name,
                    last_name,
                    gender,
                    cell_number,
                    address,
                    profile_image_id: newProfileImageId
                },
            },
            { new: true }
        ).exec();
        console.log("AFTER: ", newProfileImageId);
        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        generateToken(updatedUser?._id, res);
        res.status(200).json(updatedUser);

    } catch (error) {
        console.error("Error in updateProfile controller", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.error("Error in checkAuth controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const fetchUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params._id).exec();
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error in fetchUserById controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const { _id } = req.params;
        let user = null;
        try {
            user = await User.findByIdAndDelete(_id).exec();
        } catch (err) {
            console.error("Error deleting user from DB", err);
            // Always respond, never crash
            return res.status(500).json({ message: "Failed to delete user", error: err?.message });
        }
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        try {
            if (user && user.person && user.person.profile_image_id) {
                try {
                    await deleteImage(
                        { params: { _id: user.person.profile_image_id }, internalCall: true },
                        {}
                    );
                } catch (err) {
                    // ignore image delete errors, log for debugging
                    console.error("Error deleting user image", err);
                }
            }
        } catch (err) {
            // ignore errors, log for debugging
            console.error("Error in image cleanup", err);
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error in deleteAccount controller", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

export const fetchAllAccounts = async (req, res) => {
    try {
        const users = await User.find().exec();
        if (!users) {
            res.status(404).json({ message: "No users found" });
        }
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in fetchAllAccounts controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
