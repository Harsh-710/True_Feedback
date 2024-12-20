import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(request:Request) {
    dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            },
            { status: 401 }
        )
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        )

        if(!updatedUser){
            return Response.json(
                {
                    success: false,
                    message: "Failed to update user status to accept messages"
                },
                { status: 401 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "User status to accept messages updated successfully",
                updatedUser
            },
            { status: 200 }
        )

    } catch (error) {
        console.error("Failed to update accept messages status.", error);
        return Response.json(
            {
                success: false,
                message: "Failed to update user status to accept messages"
            },
            { status: 500 }
        )
    }
}

export async function GET() {
    dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            },
            { status: 401 }
        )
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);

        if(!foundUser){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "User status fetched successfully",
                isAcceptingMessages: foundUser.isAcceptingMessages
            },
            { status: 200 }
        )

    } catch (error) {
        console.error("Unable to fetch accept messages status", error);
        return Response.json(
            {
                success: false,
                message: "Unable to fetch accept messages status"
            },
            { status: 500 }
        )
    }
}