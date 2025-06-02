import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, minlength: 6 },
        role: { type: String, required: true },
        last_seen: { type: String },
        person: {
            first_name: { type: String, required: true },
            last_name: { type: String, required: true },
            gender: { type: String, required: true, enum: ["Male", "Female", "Other"], default: "Male" },
            cell_number: { type: String, required: true },
            address: { type: String, required: true },
            profile_image_id: { type: String },
            profile_picture: { type: String }
        },
        
    },
    
    { timestamps: true }
);

export default mongoose.model("User", userSchema);