import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";

// GET /api/properties/:id
export const GET = async (request, { params }) => {
	try {
		await connectDB();

		const property = await Property.findById(params.id);

		if (!property) return new Response("Property not found", { status: 404 }); // if property is not found
		return new Response(JSON.stringify(property), {
			status: 200,
		});
	} catch (error) {
		console.log(error);
		return new Response("Something went wrong", { status: 500 });
	}
};

// Delete /api/properties/:id
export const DELETE = async (request, { params }) => {
	try {
		const propertyId = params.id;

		const sessionUser = await getSessionUser();
		// Check for session
		if (!sessionUser || !sessionUser.userId) {
			return new Response("user id is required", { status: 401 });
		}

		const { userId } = sessionUser;

		await connectDB();

		const property = await Property.findById(propertyId);

		if (!property) return new Response("Property not found", { status: 404 }); // if property is not found

		// Verify ownership
		if (property.owner.toString() !== userId) {
			return new Response("Unauthorized", { status: 401 });
		}

		await property.deleteOne(); // deleteOne() is a MongoDB function to delete a single document from a collection that matches a specified filter.

		return new Response("Property deleted", {
			status: 200,
		});
	} catch (error) {
		console.log(error);
		return new Response("Something went wrong", { status: 500 });
	}
};

// Modify  property /api/properties/:id
export const PUT = async (request, { params }) => {
	try {
		// Connecting to database
		await connectDB();

		const sessionUser = await getSessionUser();

		if (!sessionUser || !sessionUser.userId) {
			return new Response("user ID is required", { status: 401 });
		}

		const { id } = params;
		// Getting the user id to add the the PUT request
		const { userId } = sessionUser;

		const formData = await request.formData();

		// Access all values from amenities and images
		const amenities = formData.getAll("amenities");

		// Get property to update
		const existingProperty = await Property.findById(id);
		if (!existingProperty) {
			return new Response("Property doesn't exist", { status: 404 });
		}

		//Verify ownership
		if (existingProperty.owner.toString() !== userId) {
			return new Response("Unauthorized", { status: 401 });
		}

		// Create propertyData object for database
		const propertyData = {
			type: formData.get("type"),
			name: formData.get("name"),
			description: formData.get("description"),
			location: {
				street: formData.get("location.street"),
				city: formData.get("location.city"),
				state: formData.get("location.state"),
				zipcode: formData.get("location.zipcode"),
			},
			beds: formData.get("beds"),
			baths: formData.get("baths"),
			square_feet: formData.get("square_feet"),
			amenities,
			rates: {
				weekly: formData.get("rates.weekly"),
				monthly: formData.get("rates.monthly"),
				nightly: formData.get("rates.nightly"),
			},
			seller_info: {
				name: formData.get("seller_info.name"),
				email: formData.get("seller_info.email"),
				phone: formData.get("seller_info.phone"),
			},
			owner: userId,
		};

		//Update property in DB
		const updatedProperty = await Property.findByIdAndUpdate(id, propertyData);

		return new Response(
			JSON.stringify(JSON.stringify(updatedProperty), {
				message: "success",
			}),
			{ status: 200 }
		);
	} catch (error) {
		return new Response("failed to update property", { status: 500 });
	}
};
