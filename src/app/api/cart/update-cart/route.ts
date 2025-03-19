
import connectMongoDB from "@/libs/connect";
import cartModel from "@/models/cart.model";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
    try {
        await connectMongoDB();
        const { quantity, product_id, user_id, direction } = await req.json();
        const qua = parseInt(quantity);
        const res = await cartModel.findOne({ product_id, user_id })
        console.log('DIRECTION: ',direction);
        if (res) {
            if (direction === "INCREAMENT")
                res.quantity = res.quantity + qua;
            else
                res.quantity = res.quantity - qua;
            res.save();
            const carts = await cartModel.find({ user_id }).exec();
            return NextResponse.json(carts, { status: 201 });
        } else {
            return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
        }

    } catch (error) {
        console.error(error);
    }
}