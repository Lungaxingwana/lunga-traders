import connectMongoDB from "../../../../libs/connect";
import productModel from '../../../../models/product.model';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();
        const { user_id } = await req.json();

        const allAssets = await productModel.find({ user_id:user_id }).exec();
        if (!allAssets) {
            return NextResponse.json({ message: "Assets not found" }, { status: 404 });
        }
        return NextResponse.json(allAssets, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
