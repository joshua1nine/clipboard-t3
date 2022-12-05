import { useUser } from '@auth0/nextjs-auth0';

const LoginBtn = () => {
	const { user, error, isLoading } = useUser();
	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>{error.message}</div>;

	if (user) {
		return (
			<div>
				Welcome {user.name}!{' '}
				<a
					className='bg-red-600 text-white p-2 rounded'
					href='/api/auth/logout'>
					Logout
				</a>
			</div>
		);
	}

	return (
		<a className='bg-blue text-white p-2 rounded' href='/api/auth/login'>
			Login
		</a>
	);
};

export default LoginBtn;
