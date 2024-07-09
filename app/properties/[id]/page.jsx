"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchProperty } from "@/utils/requests";
import PropertyHeaderImage from "@/components/PropertyHeaderImage";
import Link from "next/link";
import PropertyImages from "@/components/PropertyImages";
import {
	FaBed,
	FaBath,
	FaRulerCombined,
	FaMapMarker,
	FaTimes,
	FaCheck,
	FaArrowLeft,
	FaPaperPlane,
} from "react-icons/fa";
import Spinner from "@/components/Spinner";
import BookmarkButton from "@/components/BookmarkButton";
import ShareButton from "@/components/ShareButton";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const PropertiesPage = () => {
	const { id } = useParams();
	const { data: session } = useSession();

	const [property, setProperty] = useState(null);
	const [loading, setLoading] = useState(true);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [message, setMessage] = useState("");
	const [wasSubmitted, setWasSubmitted] = useState(false);

	useEffect(() => {
		const fetchPropertyData = async () => {
			if (!id) return;
			try {
				const property = await fetchProperty(id);
				setProperty(property);
			} catch (error) {
				console.error("Error fetching property");
			} finally {
				setLoading(false);
			}
		};

		if (property === null) {
			fetchPropertyData();
		}
	}, [id, property]);

	if (!property && !loading) {
		return (
			<h1 className='text-center text 2xl font-bold'>Property not found</h1>
		);
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		const data = {
			name,
			email,
			phone,
			message,
			recipient: property.owner,
			property: property._id,
		};

		try {
			const res = await fetch("/api/messages", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (res.status === 200) {
				toast.success("Your message has been sent successfully");
				setWasSubmitted(true);
			} else if (res.status === 400 || res.status === 401) {
				toast.error("Something went really wrong");
			} else {
				toast.error("Error sending form");
			}
		} catch (error) {
			console.log(error);
			toast.error("Error sending formsss");
		} finally {
			setName("");
			setEmail("");
			setPhone("");
			setMessage("");
		}
	};

	return (
		<>
			{loading && <Spinner loading={loading} />}
			{!loading && property && (
				<>
					<PropertyHeaderImage image={property.images[0]} />
					<section>
						<div className='container m-auto py-6 px-6'>
							<Link
								href='/properties'
								className='text-blue-500 hover:text-blue-600 flex items-center'>
								<FaArrowLeft className='mr-2' /> Back to Properties
							</Link>
						</div>
					</section>
					<section className='bg-blue-50'>
						<div className='container m-auto py-10 px-6'>
							<div className='grid grid-cols-1 md:grid-cols-70/30 w-full gap-6'>
								<main>
									<div className='bg-white p-6 rounded-lg shadow-md text-center md:text-left'>
										<div className='text-gray-500 mb-4'>{property.type}</div>
										<h1 className='text-3xl font-bold mb-4'>{property.name}</h1>
										<div className='text-gray-500 mb-4 flex align-middle justify-center md:justify-start'>
											<FaMapMarker className='text-lg text-orange-700 mr-2' />
											<p className='text-orange-700'>
												{property.location.street}, {property.location.city},{" "}
												{property.location.state}
											</p>
										</div>

										<h3 className='text-lg font-bold my-6 bg-gray-800 text-white p-2'>
											Rates & Options
										</h3>
										<div className='flex flex-col md:flex-row justify-around'>
											<div className='flex items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0'>
												<div className='text-gray-500 mr-2 font-bold'>
													Nightly
												</div>
												<div className='text-2xl font-bold text-blue-500'>
													{property.rates.nightly ? (
														`$${property.rates.nightly.toLocaleString()}`
													) : (
														<FaTimes className='text-red-700' />
													)}
												</div>
											</div>
											<div className='flex items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0'>
												<div className='text-gray-500 mr-2 font-bold'>
													Weekly
												</div>
												<div className='text-2xl font-bold text-blue-500'>
													{property.rates.weekly ? (
														`$${property.rates.weekly.toLocaleString()}`
													) : (
														<FaTimes className='text-red-700' />
													)}
												</div>
											</div>
											<div className='flex items-center justify-center mb-4 pb-4 md:pb-0'>
												<div className='text-gray-500 mr-2 font-bold'>
													Monthly
												</div>
												<div className='text-2xl font-bold text-blue-500'>
													{property.rates.monthly ? (
														`$${property.rates.monthly.toLocaleString()}`
													) : (
														<FaTimes className='text-red-700' />
													)}
												</div>
											</div>
										</div>
									</div>

									<div className='bg-white p-6 rounded-lg shadow-md mt-6'>
										<h3 className='text-lg font-bold mb-6'>
											Description & Details
										</h3>
										<div className='flex justify-center gap-4 text-blue-500 mb-4 text-xl space-x-9'>
											<p>
												<FaBed className='mr-2 inline-block' /> {property.beds}{" "}
												<span className='hidden sm:inline'>Beds</span>
											</p>
											<p>
												<FaBath className='mr-2 inline-block' />{" "}
												{property.baths}{" "}
												<span className='hidden sm:inline'>Baths</span>
											</p>
											<p>
												<FaRulerCombined className='mr-2 inline-block' />
												{property.square_feet}{" "}
												<span className='hidden sm:inline'>sqft</span>
											</p>
										</div>
										<p className='text-gray-500 mb-4 text-center'>
											{property.description}
										</p>
									</div>

									<div className='bg-white p-6 rounded-lg shadow-md mt-6'>
										<h3 className='text-lg font-bold mb-6'>Amenities</h3>

										<ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 list-none'>
											{property.amenities.map((amenity, index) => (
												<li key={index}>
													<FaCheck className='text-green-600 mr-2 inline-block' />
													{amenity}
												</li>
											))}
										</ul>
									</div>
									<div className='bg-white p-6 rounded-lg shadow-md mt-6'>
										<div id='map'></div>
									</div>
								</main>

								{/* <!-- Sidebar --> */}
								<aside className='space-y-4'>
									<BookmarkButton property={property} />
									<ShareButton property={property} />
									{!session ? (
										<p className='text-white bg-blue-700 width-full py-8 text-center'>
											Your must be logged in to send a message
										</p>
									) : (
										<div className='bg-white p-6 rounded-lg shadow-md'>
											<h3 className='text-xl font-bold mb-6'>
												Contact Property Manager
											</h3>
											{wasSubmitted ? (
												<p className='text-green-500 mb-4'>
													{" "}
													Your message have been sent successfully
												</p>
											) : (
												<form onSubmit={handleSubmit}>
													<div className='mb-4'>
														<label
															className='block text-gray-700 text-sm font-bold mb-2'
															htmlFor='name'>
															Name:
														</label>
														<input
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															id='name'
															type='text'
															placeholder='Enter your name'
															required
															value={name}
															onChange={(e) => setName(e.target.value)}
														/>
													</div>
													<div className='mb-4'>
														<label
															className='block text-gray-700 text-sm font-bold mb-2'
															htmlFor='email'>
															Email:
														</label>
														<input
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															id='email'
															type='email'
															placeholder='Enter your email'
															required
															value={email}
															onChange={(e) => setEmail(e.target.value)}
														/>
													</div>
													<div className='mb-4'>
														<label
															className='block text-gray-700 text-sm font-bold mb-2'
															htmlFor='phone'>
															Phone:
														</label>
														<input
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															id='phone'
															type='text'
															placeholder='Enter your phone number'
															value={phone}
															onChange={(e) => setPhone(e.target.value)}
														/>
													</div>
													<div className='mb-4'>
														<label
															className='block text-gray-700 text-sm font-bold mb-2'
															htmlFor='message'>
															Message:
														</label>
														<textarea
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 h-44 focus:outline-none focus:shadow-outline'
															id='message'
															placeholder='Enter your message'
															value={message}
															onChange={(e) =>
																setMessage(e.target.value)
															}></textarea>
													</div>
													<div>
														<button
															className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline flex items-center justify-center'
															type='submit'>
															<FaPaperPlane className='mr-2' /> Send Message
														</button>
													</div>
												</form>
											)}
										</div>
									)}
								</aside>
							</div>
						</div>
					</section>
					<PropertyImages images={property.images} />
				</>
			)}
		</>
	);
};

export default PropertiesPage;
