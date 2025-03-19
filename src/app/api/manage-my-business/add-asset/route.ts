import Product from "@/models/product.model";
import connectMongoDB from "../../../../libs/connect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();
        const newAsset = await req.json();

        console.log("RECEIVED NEW ASSET DATA: ", newAsset);

        // Validate the received data
        const requiredFields = [
            "make", "model", "year", "color", "size", "category",
            "sub_category", "user_id", "description", "original_price",
            "sale_price", "image_src"
        ];

        for (const field of requiredFields) {
            if (!newAsset[field]) {
                return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
            }
        }

        const newAssett = new Product({
            make: newAsset.make,
            model: newAsset.model,
            year: newAsset.year,
            color: newAsset.color,
            size: newAsset.size,
            category: newAsset.category,
            sub_category: newAsset.sub_category,
            tags: newAsset.tags,
            buying: newAsset.buying,
            description: newAsset.description,
            original_price: newAsset.original_price,
            sale_price: newAsset.sale_price,
            purchace_quantity: newAsset.purchace_quantity,
            stock_quantity: newAsset.stock_quantity,
            user_id: newAsset.user_id,
            ratio_review: newAsset.ratio_review,
            number_of_reviews_done: newAsset.number_of_reviews,
            image_src: newAsset.image_src,
            images_src: newAsset.images_src,
        });
        await newAssett.save();

        return NextResponse.json(newAssett, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

