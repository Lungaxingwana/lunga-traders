import cartModel from "@/models/cart.model";
import connectMongoDB from "../../../../libs/connect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();
        const { _id, user_id } = await req.json();

        // Validate the received data
        if (!_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Find the cart by id and delete their information
        const deleteCart = await cartModel.findByIdAndDelete(_id);

        // Check if the cart was found
        if (!deleteCart) {
            return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
        }

        const carts = await cartModel.find({user_id}).exec();
        return NextResponse.json(carts, { status: 201 });
    } catch (error) {
        console.error('Error deleting cart:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: ''}, { status: 500 });
    }
}
