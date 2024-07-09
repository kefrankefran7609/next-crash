import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

// Get messages /api/messages

export const GET = async () => {
	try {
		await connectDB();

		const sessionUser = await getSessionUser(); // Check if logged in

		if (!sessionUser || !sessionUser.userId) {
			return new Response("User ID is required", { status: 401 });
		}

		const { userId } = sessionUser;
		const readMessages = await Message.find({ recipient: userId, read: true })
			.sort({ createdAt: -1 }) // Sort read messages in asc order, put to 1 for the inverse effect
			.populate("sender", "username")
			.populate("property", "name");

		const unreadMessages = await Message.find({
			recipient: userId,
			read: false,
		})
			.sort({ createdAt: -1 }) // Sort unread messages in asc order, put to 1 for the inverse effect
			.populate("sender", "username")
			.populate("property", "name");

		const messages = [...unreadMessages, ...readMessages];

		return new Response(JSON.stringify(messages), { status: 200 });
	} catch (error) {
		console.log(error);
		return new Response("something went wrong", { status: 500 });
	}
};

// Post api/messages
export const POST = async (request) => {
	try {
		await connectDB();

		const { email, phone, name, message, property, recipient } =
			await request.json(); // getting the property ID

		const sessionUser = await getSessionUser(); // Check if logged in

		if (!sessionUser || !sessionUser.userId) {
			return new Response("User ID is required", { status: 401 });
		}

		const { user } = sessionUser;

		const newMessage = new Message({
			sender: user.id,
			recipient,
			property,
			email,
			phone,
			name,
			body: message,
		});

		await newMessage.save();

		return new Response(
			JSON.stringify({ message: "Message sent" }, { status: 200 })
		);
	} catch (error) {
		console.log(error);
		return new Response("Something went wrong", { status: 500 });
	}
};
