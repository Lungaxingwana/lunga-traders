import connectMongoDB from "../../../../libs/connect";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectMongoDB();
        const { username, password, role, email, first_name, last_name, gender, profile_picture, address, cell_number} = await req.json();

        // Validate the received data
        if (!username || !password || !role || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const person = { first_name, last_name, gender, profile_picture, address, cell_number }
        const newUser = new User({ username, password, role, email, person});
        await newUser.save();

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}