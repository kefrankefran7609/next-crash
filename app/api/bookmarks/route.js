import connectDB from "@/config/database";
import User from "@/models/User";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

// Get /api/bookmarks
export const GET = async () => {
	try {
		await connectDB();

		const sessionUser = await getSessionUser(); // Check if logged in

		if (!sessionUser || !sessionUser.userId) {
			// If no user ID, meaning if not logged in
			return new Response("User ID is required", { status: 401 });
		}

		const { userId } = sessionUser; // Get user Id from userSession

		// Find user in DB
		const user = await User.findOne({ _id: userId });

		// Get users bookmarks
		const bookmarks = await Property.find({ _id: { $in: user.bookmarks } });
		return new Response(JSON.stringify(bookmarks), { status: 200 });
	} catch (error) {
		console.log(error);
		return new Response("Something went wrong", { status: 500 });
	}
};

export const POST = async (request) => {
	try {
		await connectDB();
		const { propertyId } = await request.json(); // getting the property ID

		const sessionUser = await getSessionUser(); // Check if logged in

		if (!sessionUser || !sessionUser.userId) {
			return new Response("User ID is required", { status: 401 });
		}

		const { userId } = sessionUser;

		// Find user in DB
		const user = await User.findOne({ _id: userId });

		// Check if property is already bookmarked
		let isBookmarked = user.bookmarks.includes(propertyId);

		let message;

		if (isBookmarked) {
			user.bookmarks.pull(propertyId);
			message = "Bookmark removed successfully";
			isBookmarked = false;
		} else {
			user.bookmarks.push(propertyId);
			message = "Bookmark added successfully";
			isBookmarked = true;
		}

		await user.save();
		return new Response(JSON.stringify({ message, isBookmarked }), {
			status: 200,
		});
	} catch (error) {
		console.log(error);
		return new Response("Something went wrong", { status: 500 });
	}
};
