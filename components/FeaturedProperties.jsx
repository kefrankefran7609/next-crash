import { fetchProperties } from "@/utils/requests";
import Link from "next/link";
import Image from "next/image";
import {
	FaBed,
	FaBath,
	FaRulerCombined,
	FaMoneyBill,
	FaMapMarker,
} from "react-icons/fa";

const FeaturedProperties = async ({ property }) => {
	const properties = await fetchProperties({ showFeatured: true });

	const getRateDisplay = (property) => {
		if (property.rates.monthly)
			return `${property.rates.monthly.toLocaleString()} / mo`;
		else if (property.rates.weekly)
			return `${property.rates.weekly.toLocaleString()} / wk`;
		else if (property.rates.nightly)
			return `${property.rates.nightly.toLocaleString()} / night`;
	};

	return (
		properties.length > 0 && (
			<section className='bg-blue-50 px-4 pt-6 pb-10'>
				<div className='container-xl lg:container m-auto'>
					<h2 className='text-3xl font-bold text-blue-500 mb-6 text-center'>
						Featured Properties
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{properties.map((property) => (
							<div
								key={property._id}
								className='bg-white rounded-xl shadow-md relative flex flex-col md:flex-row'>
								<Image
									src={property.images[0]}
									alt=''
									width={400}
									height={400}
									sizes={400}
									className='object-cover rounded-t-xl md:rounded-tr-none md:rounded-l-xl w-full md:w-2/5'
								/>
								<div className='p-6'>
									<h3 className='text-xl font-bold'>{property.name}</h3>
									<div className='text-gray-600 mb-4'>{property.type}</div>
									<h3 className='absolute top-[10px] left-[10px] bg-white px-4 py-2 rounded-lg text-blue-500 font-bold text-right md:text-center lg:text-right'>
										${getRateDisplay(property)}
									</h3>
									<div className='flex justify-center gap-4 text-gray-500 mb-4'>
										<p>
											<FaBed className='inline-block mr-2' /> {property.beds}
											<span className='md:hidden lg:inline'>Beds</span>
										</p>
										<p>
											<FaBath className='inline-block mr-2' /> {property.baths}
											<span className='md:hidden lg:inline'>Baths</span>
										</p>
										<p>
											<FaRulerCombined className='inline-block mr-2' />{" "}
											{property.baths}
											{property.square_feet}{" "}
											<span className='md:hidden lg:inline'>sqft</span>
										</p>
									</div>

									<div className='flex justify-center gap-4 text-green-900 text-sm mb-4'>
										<p>
											<FaMoneyBill className='inline-block mr-2' />{" "}
											{property.baths} Nightly
										</p>
										<p>
											<FaMoneyBill className='inline-block mr-2' />
											Weekly
										</p>
									</div>

									<div className='border border-gray-200 mb-5'></div>

									<div className='flex flex-col lg:flex-row justify-between'>
										<div className='flex align-middle gap-2 mb-4 lg:mb-0'>
											<FaMapMarker className='inline-block' />
											<span className='text-orange-700'>
												{" "}
												{property.location.city} {property.location.state}{" "}
											</span>
										</div>
										<Link
											href={`/properties/${property._id}`}
											className='h-[36px] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm'>
											Details
										</Link>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		)
	);
};

export default FeaturedProperties;
