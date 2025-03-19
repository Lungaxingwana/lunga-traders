import connectMongoDB from "../../../../libs/connect";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try{
        await connectMongoDB();
        const {username, password} = await req.json();
        const user = await userModel.findOne({ username: username, password:password }).exec();
        if(!user){
            return NextResponse.json({message:"Invalid username or password"}, {status:401});
        }
        return NextResponse.json(user, {status:201});
    } catch(error){
        console.error(error);
    }
}