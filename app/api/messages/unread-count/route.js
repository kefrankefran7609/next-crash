import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

// GET /api/messages/unread-count
export const GET = async () => {
	try {
		await connectDB();

		const sessionUser = await getSessionUser(); // Check if logged in

		if (!sessionUser || !sessionUser.userId) {
			return new Response("User ID is required", { status: 401 });
		}

		const { userId } = sessionUser;
		const unreadMessages = await Message.find({
			// Here we could use Message.countDocuments instead and would return the same as the unreadMessages.length we have lower
			recipient: userId,
			read: false,
		});

		return new Response(unreadMessages.length, { status: 200 });
	} catch (error) {
		console.log(error);
		return new Response("something went wrong", { status: 500 });
	}
};
