
import { NextResponse } from "next/server";
import connectMongoDB from "../../../libs/connect";
import productModel from "@/models/product.model";

export async function GET(){
    try{
        await connectMongoDB();
        const products = await productModel.find({}).exec();
        return NextResponse.json(products, {status:201});
    } catch(error){
        console.error(error);
    }
}