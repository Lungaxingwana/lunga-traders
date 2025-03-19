import connectMongoDB from "../../../../libs/connect";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
    try {
        await connectMongoDB();
        const { _id, username, password, role, email, first_name, last_name, gender, profile_picture, address, cell_number } = await req.json();

        // Validate the received data
        if (!_id || !username || !password || !role || !email || !first_name || !last_name || !gender || !profile_picture || !address || !cell_number) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const person = { first_name, last_name, gender, profile_picture, address, cell_number }
      
        // Find the user by id and update their information, or create it if it doesn't exist
        const updateUser = await User.findById(_id);

        // Check if the user was found
        if (!updateUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        updateUser.username = username;
        updateUser.password = password;
        updateUser.role = role;
        updateUser.email = email;
        updateUser.person = person;

        await updateUser.save();
        return NextResponse.json(updateUser, { status: 200 });
    } catch (error) {
        console.error('Error updating user:', error);
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
