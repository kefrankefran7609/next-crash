"use client";
import { useState, useEffect } from "react";
import PropertyCard from "@/components/PropertyCard";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";

const savedPropertyPage = () => {
	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSavedProperties = async () => {
			try {
				const res = await fetch("/api/bookmarks");

				if (res.status === 200) {
					const data = await res.json();
					setProperties(data);
				} else {
					console.log(res.statusText);
					toast.error("failed to fetch saved propertiesssss");
				}
			} catch (error) {
				console.log(error);
				toast.error("failed to fetch saved properties");
			} finally {
				setLoading(false);
			}
		};

		fetchSavedProperties();
	}, []);
	return loading ? (
		<Spinner loading={loading} />
	) : (
		<section className='px-4 py-6'>
			<div className='container-xl lg:container m-auto px-4 py-6'>
				<h1 className='text-center text-4xl py-10'> My saved properties </h1>
				{properties.length === 0 ? (
					<p>No saved properties</p>
				) : (
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						{properties.map((property) => (
							<PropertyCard key={property._id} property={property} />
						))}
					</div>
				)}
			</div>
		</section>
	);
};

export default savedPropertyPage;
