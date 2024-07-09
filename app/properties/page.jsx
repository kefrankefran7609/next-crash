import PropertySearchForm from "@/components/PropertySearchForm";
import Properties from "@/components/Properties";

const PropertyPage = async () => {
	return (
		<>
			<section className='px-4'>
				<div className='bg-blue-700 py-20 mb-4'>
					<h1 className='text-center text-4xl text-bold text-white mb-4'>
						{" "}
						Search properties
					</h1>
					<PropertySearchForm />
				</div>
			</section>
			<Properties />
		</>
	);
};

export default PropertyPage;
