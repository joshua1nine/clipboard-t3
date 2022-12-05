import router from 'next/router';
import { HiChevronLeft } from 'react-icons/hi';

const BackBtn = () => {
	return (
		<div className='flex items-center space-x-2 my-3'>
			<HiChevronLeft />
			<button type='button' onClick={() => router.back()}>
				Back
			</button>
		</div>
	);
};

export default BackBtn;
