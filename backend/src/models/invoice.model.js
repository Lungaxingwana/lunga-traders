import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
    {
        user_id: { type: String, required: true },
        cart: [
            {
                product_id: { type: String, required: true },
                quantity: { type: Number, required: true },
                size: { type: String, required: true },
                color: { type: String, required: true }
            }
        ],
        total_amount: { type: Number, required: true },
        payment_status: {
            type: String,
            enum: ["Unpaid", "P-on-C", "Paid"],
            required: true,
            default: "Unpaid"
        },
        payment_method: {
            type: String,
            enum: ["Cash", "EFT"],
        },
        deposit: [
            {
                deposit_amount: { type: Number },
                createdAt: { type: Date, default: Date.now }
            }
        ],
        delivery_method: {
            type: String,
            enum: ["Own Collection", "Delivery"],
            required: true
        },
        delivery_address: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
