import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        general: {
            user_id: { type: String, required: true },
            make: { type: String, required: true },
            model: { type: String, required: true },
            year: { type: Number, required: true },
            category: { type: String, required: true },
            sub_category: { type: String, required: true },
            tags: { type: [String], default: [] },
            description: { type: String, required: true }
        },
        appearance: {
            color: { type: String, required: true },
            size: { type: String, required: true },
            images_src: { type: [String], default: [] },
            images_src_id: { type: [String], default: [] }
        },
        pricing: {
            original_price: { type: Number, required: true },
            sale_price: { type: Number, required: true },
            purchase_quantity: { type: Number, required: true },
            stock_quantity: { type: Number, required: true }
        },
        reviews: [
            {
                rate_review: { type: Number },
                comment: { type: String }
            }
        ],
        payment_status: {
            type: String,
            enum: ["Paid", "Unpaid", "Payment-on-Fetch"],
            default: "Unpaid"
        }
    },
    { timestamps: true }
);

export default mongoose.model("Product", productSchema);
