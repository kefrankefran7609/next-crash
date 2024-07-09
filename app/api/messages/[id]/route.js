import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic"; // Necessary to deploy with vercel

// PUT api/messages/:id
export const PUT = async (request, { params }) => {
	try {
		await connectDB();

		const { id } = params;

		console.log("This is the id: " + id);

		const sessionUser = await getSessionUser(); // Check if logged in

		if (!sessionUser || !sessionUser.userId) {
			return new Response("User ID is required", { status: 401 });
		}

		const { user } = sessionUser;

		const message = await Message.findById(id);

		if (!message) {
			return new Response("Message not found", { status: 404 });
		}

		console.log(message.read);

		// Update message to read/unread depending on the current status
		message.read = !message.read;

		await message.save();

		return new Response(JSON.stringify(message), { status: 200 });
	} catch (error) {
		console.log(error);
		return new Response("Something went wrong", { status: 500 });
	}
};

// Delete api/messages/:id
export const DELETE = async (request, { params }) => {
	try {
		console.log("deleting message");
		await connectDB();

		const { id } = params;

		const sessionUser = await getSessionUser(); // Check if logged in

		if (!sessionUser || !sessionUser.userId) {
			return new Response("User ID is required", { status: 401 });
		}

		const { user } = sessionUser;

		const message = await Message.findById(id);

		if (!message) {
			return new Response("Message not found", { status: 404 });
		}

		await message.deleteOne();

		return new Response("The message has been deleted", { status: 200 });
	} catch (error) {
		console.log(error);
		return new Response("Something went wrong", { status: 500 });
	}
};
