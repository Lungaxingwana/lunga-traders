import Product from "../models/product.model.js";
import { uploadImage, deleteImage } from "./image.controller.js";
import { io } from "../libs/socket.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error("Error in getAllProducts: ", error);
        res.status(500).json({ message: "Error fetching products", error });
    }
};

export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params._id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Error in getProduct: ", error);
        res.status(500).json({ message: "Error fetching product", error });
    }
};

export const createProduct = async (req, res) => {
    const { make, model, year, category, sub_category, tags, description, color, size, original_price, purchase_quantity, stock_quantity, sale_price, rate_review, comment, payment_status } = req.body;
    let files = [];
    if (Array.isArray(req.files)) {
        files = req.files;
    } else if (req.files && req.files.images_src) {
        files = req.files.images_src;
    }
    try {
        const images_src_id = [];
        for (const file of files) {
            const uploadResult = await uploadImage(
                { file: file, internalCall: true },
                {}
            );
            images_src_id.push(uploadResult?.imageId);
        }
        const user_id = req.user?._id;
        const newProduct = new Product({
            general: { user_id, make, model, year, category, sub_category, tags, description },
            appearance: { color, size, images_src_id: images_src_id },
            pricing: {
                original_price: original_price || 0,
                stock_quantity: stock_quantity || 0,
                sale_price: sale_price || 0,
                purchase_quantity: purchase_quantity || 0,
                stock_quantity: stock_quantity || 0
            },
            reviews: [{ rate_review, comment }],
            payment_status
        });
        await newProduct.save();
        io.emit("productCreated", newProduct);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error in createProduct: ", error);
        res.status(500).json({ message: "Error creating product", error });
    }
};

export const updateProduct = async (req, res) => {
    const { make, model, year, category, sub_category, tags, description, color, size, original_price, sale_price, purchase_quantity, stock_quantity, rate_review, comment, payment_status, images_src_id } = req.body;
    let files = [];
    if (Array.isArray(req.files)) {
        files = req.files;
    } else if (req.files && req.files.images_src) {
        files = req.files.images_src;
    }
    try {
        // For each old image id, delete from GridFS
        if (Array.isArray(images_src_id)) {
            try {
                for (const id of images_src_id) {
                    try {
                        await deleteImage(
                            { params: { _id: id }, internalCall: true },
                            {}
                        );
                    } catch (err) {
                        // Ignore individual image delete errors
                        console.error("Error deleting old image from GridFS", err);
                    }
                }
            } catch (err) {
                // Ignore errors in the whole block
                console.error("Error in deleting images_src_id array", err);
            }
        }

        // Upload new images, resizing if needed, and collect new ids
        const images_src_ids = [];
        for (const file of files) {
            const uploadResult = await uploadImage(
                { file: file, internalCall: true },
                {}
            );
            images_src_ids.push(uploadResult?.imageId);
        }

        const user_id = req.user?._id;
        const updatedProduct = await Product.findByIdAndUpdate(req.params._id, {
            general: { user_id, make, model, year, category, sub_category, tags, description },
            appearance: { color, size, images_src_id: images_src_ids },
            pricing: {
                original_price: original_price || 0,
                sale_price: sale_price || 0,
                sale_price: sale_price || 0,
                purchase_quantity: purchase_quantity || 0,
                stock_quantity: stock_quantity || 0
            },
            reviews: [{ rate_review, comment }],
            payment_status
        }, { new: true });
        if (!updatedProduct) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        io.emit("productUpdated", updatedProduct);
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error in updateProduct: ", error);
        res.status(500).json({ message: "Error updating product", error });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        let deletedProduct = null;
        try {
            deletedProduct = await Product.findByIdAndDelete(req.params._id);
        } catch (err) {
            console.error("Error deleting product from DB", err);
            return res.status(500).json({ message: "Failed to delete product", error: err?.message });
        }
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        try {
            if (
                deletedProduct &&
                deletedProduct.appearance &&
                Array.isArray(deletedProduct.appearance.images_src_id)
            ) {
                for (const id of deletedProduct.appearance.images_src_id) {
                    try {
                        await deleteImage(
                            { params: { _id: id }, internalCall: true },
                            {}
                        );
                    } catch (err) {
                        // ignore individual image delete errors
                        console.error("Error deleting product image", err);
                    }
                }
                io.emit("productDeleted", deletedProduct._id);
            }
        } catch (err) {
            console.error("Error in product images cleanup", err);
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error in deleteProduct: ", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Error deleting product", error });
        }
    }
};

