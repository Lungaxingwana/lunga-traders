
import connectMongoDB from "@/libs/connect";
import productModel from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try{
        await connectMongoDB();
        const {id} = await req.json();
        console.log('SERVER ID: ',id);
        const product = await productModel.findById(id).exec();
        return NextResponse.json(product, {status:201});
    } catch(error){
        console.error(error);
    }
}