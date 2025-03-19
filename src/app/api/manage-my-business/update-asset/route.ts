import connectMongoDB from "../../../../libs/connect";
import productModel from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
    try {
        await connectMongoDB();
        const newAsset = await req.json();

        // Find the asset by id and update their information, or create it if it doesn't exist
        const updateFoundAsset = await productModel.findByIdAndUpdate
            (newAsset._id, newAsset, { new: true }).exec();

        // Check if the asset was found
        if (!updateFoundAsset) {
            return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
        }
        
        return NextResponse.json(updateFoundAsset, { status: 200 });
    } catch (error) {
        console.error('Error updating asset:', error);
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
