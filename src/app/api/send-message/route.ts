import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";


export async function POST(request: Request) {
    await dbConnect();

    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({ username });

        if(!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            )
        }

        if(!user.isAcceptingMessages){
            return Response.json(
                {
                    success: false,
                    message: "User is currently not accepting messages"
                },
                { status: 403 }
            )
        }

        const newMessage = { content, createdAt: new Date() };
        user.messages.push(newMessage as Message);

        await user.save();

        return Response.json(
            {
                success: true,
                message: "Message sent successfully"
            },
            { status: 201 }
        )

    } catch (error) {
        console.error("Could not send message", error);
        return Response.json(
            {
                success: false,
                message: "Unable to send message. Please try again later."
            },
            { status: 500 }
        )
    }
}