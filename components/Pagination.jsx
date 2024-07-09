const Pagination = ({ page, pageSize, totalItems, onChangePage }) => {
	const totalPages = Math.ceil(totalItems / pageSize);

	const handleChangePage = (newPage) => {
		if (newPage >= 1 && newPage <= totalPages) {
			console.log("hey");
			// Be sure that we don't call a page smaller than 1 and bigger than the total pages
			onChangePage(newPage);
		}
	};

	return (
		<section className='container mx-auto flex justify-center items-center my-8'>
			<button
				onClick={() => handleChangePage(page - 1)}
				className='mr-2 px-2 py-1 border border-gray-300 rounded'
				disabled={page === 1}>
				Previous
			</button>
			<span className='mx-2'>
				Page {page} of {totalPages}
			</span>
			<button
				onClick={() => handleChangePage(page + 1)}
				className='ml-2 px-2 py-1 border border-gray-300 rounded'
				disabled={page === totalPages}>
				Next
			</button>
		</section>
	);
};

export default Pagination;
