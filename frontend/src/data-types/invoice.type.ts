export interface Invoice {
    _id?: string;
    user_id: string;
    cart: {
        _id?: string;
        product_id: string;
        quantity: number;
        size: string;
        color: string;
    }[];
    total_amount: number;
    payment_status: "Unpaid" | "P-on-C" | "Paid";
    payment_method?: "Cash" | "EFT";
    deposit?: {
        deposit_amount?: number;
        created_at?: Date;
    }[];
    delivery_method: "Own Collection" | "Delivery";
    delivery_address?: string;
    created_at?: Date;
}