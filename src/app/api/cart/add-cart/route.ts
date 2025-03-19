import connectMongoDB from "@/libs/connect";
import cartModel from "@/models/cart.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const { quantity, product_id, user_id, action } = await req.json();
    const res = await cartModel.findOne({ product_id, user_id });
    if (res) {
      if (action === "INCREAMENT") {
        res.quantity += 1;
      } else if (action === "DECREAMENT") {
        res.quantity -= 1;
      }
      await res.save();
    } else {
      const cart = new cartModel({ product_id, user_id, quantity });
      await cart.save();
    }
    const carts = await cartModel.find({ user_id }).exec();
    return NextResponse.json(carts, { status: 201 });
  } catch (error) {
    console.error(error);
  }
}
