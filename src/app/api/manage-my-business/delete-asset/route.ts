import productModel from "@/models/product.model";
import connectMongoDB from "../../../../libs/connect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();
        const { _id } = await req.json();

        // Validate the received data
        if (!_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Find the product by id and delete their information
        const deleteProduct = await productModel.findByIdAndDelete(_id);

        // Check if the product was found
        if (!deleteProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: ''}, { status: 500 });
    }
}
