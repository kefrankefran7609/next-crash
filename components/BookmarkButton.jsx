"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { FaBookmark } from "react-icons/fa";

const BookmarkButton = ({ property }) => {
	const { data: session } = useSession();
	const userId = session?.user?.id;

	const [isBookmarked, setIsBookmarked] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!userId) {
			// If not logged in
			setLoading(false);
			return;
		}

		const checkBookmark = async () => {
			try {
				const res = await fetch("/api/bookmarks/check", {
					method: "POST",
					header: {
						"Content-type": "application/json",
					},
					body: JSON.stringify({
						propertyId: property._id,
					}),
				});

				if (res.status === 200) {
					const data = await res.json();
					setIsBookmarked(data.isBookmarked);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};
		checkBookmark();
	}, [property._id, userId]);

	const handleClick = async () => {
		if (!userId) {
			toast.error("You need to sign in to book mark a property");
			return;
		}

		try {
			const res = await fetch("/api/bookmarks", {
				method: "POST",
				header: {
					"Content-type": "application/json",
				},
				body: JSON.stringify({
					propertyId: property._id,
				}),
			});

			if (res.status === 200) {
				const data = await res.json();
				toast.success(data.message);
				setIsBookmarked(data.isBookmarked);
			}
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong");
		}
	};

	if (loading) return <p>loading... </p>;

	return isBookmarked ? (
		<button
			onClick={handleClick}
			className='bg-red-500 hover:bg-red-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center'>
			<FaBookmark className='mr-2' /> Remove bookmark
		</button>
	) : (
		<button
			onClick={handleClick}
			className='bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center'>
			<FaBookmark className='mr-2' /> Bookmark Property
		</button>
	);
};

export default BookmarkButton;
