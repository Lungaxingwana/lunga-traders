import connectMongoDB from "../../../../libs/connect";
import cartModel from "@/models/cart.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try{
        console.log("Connecting to MongoDB...");
        await connectMongoDB();
        console.log("Connected to MongoDB");

        const _id = req.nextUrl.searchParams.get("user_id");
        console.log("Received ID:", _id);

        const cart = await cartModel.find({user_id:_id}).exec();
        console.log("Cart retrieved:", cart);

        return NextResponse.json(cart, {status:200});
    } catch(error){
        console.error("Error:", error);
        return NextResponse.json({error: 'Internal Server Error'}, {status:500});
    }
}
