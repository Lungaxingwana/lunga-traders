export interface Product {
    _id: string;
    general: {
        make: string;
        model: string;
        year: number;
        category: string;
        sub_category: string;
        tags?: string;
        description: string;
    };
    appearance: {
        color: string;
        size: string;
        other_size?: string;
        images_src?: File[];
        images_src_id?: string[];
    };
    pricing: {
        original_price: number;
        sale_price: number;
        purchase_quantity: number;
        stock_quantity: number;
    };
    reviews: {
        rate_review?: number;
        comment?: string;
    }[];
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductInput {
    general: {
        make: string;
        model: string;
        year: number;
        category: string;
        sub_category: string;
        tags?: string;
        description: string;
    };
    appearance: {
        color: string;
        size: string;
        other_size?: string;
        images_src?: File[];
        images_src_id?: string[];
    };
    pricing: {
        original_price: number;
        sale_price: number;
        purchase_quantity: number;
        stock_quantity: number;
    };
    reviews: {
        rate_review?: number;
        comment?: string;
    }[];
}

// Interface for Product FormData fields
export interface ProductFormData {
    _id?: string;
    make: string;
    model: string;
    year: string; // as string for FormData
    category: string;
    sub_category: string;
    tags?: string;
    description: string;
    color: string;
    size: string;
    original_price: string;
    purchase_quantity: string;
    stock_quantity: string;
    sale_price: string;
    rate_review?: string;
    comment?: string;
    payment_status: string;
    images_src?: File[];
    createdAt?: string;
    updatedAt?: string;
}

export const Category: { name_of_category: string; sub_categories: string[] }[] = [
    { name_of_category: "Electronics", sub_categories: ["Mobile Phones", "Laptops", "Cameras", "Accessories"] },
    { name_of_category: "Clothing", sub_categories: ["Men", "Women", "Kids", "Accessories"] },
    { name_of_category: "Home_Appliances", sub_categories: ["Kitchen", "Living_Room", "Bedroom", "Bathroom"] },
    { name_of_category: "Books", sub_categories: ["Fiction", "Non-Fiction", "Educational", "Comics"] },
    { name_of_category: "Sports", sub_categories: ["Outdoor", "Indoor", "Fitness Equipment", "Accessories"] },
    { name_of_category: "Beauty", sub_categories: ["Skincare", "Makeup", "Haircare", "Fragrances"] },
    { name_of_category: "Toys", sub_categories: ["Action Figures", "Dolls", "Educational Toys", "Puzzles"] },
    { name_of_category: "Automotive", sub_categories: ["Cars", "Motorcycles", "Parts", "Accessories"] },
    { name_of_category: "Groceries", sub_categories: ["Fruits", "Vegetables", "Snacks", "Beverages"] },
    { name_of_category: "Furniture", sub_categories: ["Living_Room", "Bedroom", "Office", "Outdoor"] }
];

