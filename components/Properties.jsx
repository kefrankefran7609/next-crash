"use client";
import PropertyCard from "./PropertyCard";
import { useState, useEffect } from "react";
import Spinner from "@/components/Spinner";
import Pagination from "./Pagination";

const Properties = () => {
	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(3);
	const [totalItems, setTotalItems] = useState(0);

	useEffect(() => {
		const fetchProperties = async () => {
			try {
				const res = await fetch(
					`/api/properties?page=${page}&pageSize=${pageSize}`
				);

				if (!res.ok) {
					throw new Error("Failed to fecth data");
				}

				const data = await res.json();
				setProperties(data.properties);
				setTotalItems(data.total);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};
		fetchProperties();
	}, [page, pageSize]);

	const handleChangePage = (newPage) => {
		setPage(newPage);
	};

	return loading ? (
		<Spinner />
	) : (
		<section className='px-4 py-6'>
			<div className='container-xl lg:container m-auto px-4 py-6'>
				{properties === 0 ? (
					<p>No properties found</p>
				) : (
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						{properties.map((property) => (
							<PropertyCard key={property._id} property={property} />
						))}
					</div>
				)}
				<Pagination
					page={page}
					pageSize={pageSize}
					totalItems={totalItems}
					onChangePage={handleChangePage}
				/>
			</div>
		</section>
	);
};

export default Properties;
