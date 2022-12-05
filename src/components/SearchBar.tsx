import { HiChevronDown } from 'react-icons/hi';

interface Props {
	query: string;
	handleOnSearch: any;
	setToggleFilter: any;
	toggleFilter: any;
}

export const SearchBar = ({
	query,
	handleOnSearch,
	setToggleFilter,
	toggleFilter,
}: Props) => {
	return (
		<nav className='flex justify-between border-t border-b border-blue space-x-2 p-2 mb-2'>
			<input
				className='flex-1 border-t-0 border-b-0 border-l-0 border-r border-blue placeholder:text-blue focus:ring-0 focus:border-blue'
				type='text'
				name='search'
				value={query}
				onChange={handleOnSearch}
				placeholder='Search...'
			/>
			<div
				className='flex justify-center items-center space-x-2 px-4 cursor-pointer'
				onClick={() => setToggleFilter(!toggleFilter)}>
				<button type='button'>Filters</button>
				<HiChevronDown
					className={`transition-transform ease-in-out ${
						toggleFilter && 'rotate-180'
					}`}
				/>
			</div>
		</nav>
	);
};
