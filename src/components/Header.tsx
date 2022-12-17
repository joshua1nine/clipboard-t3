import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { HiCog } from 'react-icons/hi';
import { LogInOutBtn } from './LogInOutBtn';

interface Props {
   title: string;
}

const Header = ({ title }: Props) => {
   const { data: sessionData } = useSession();
   return (
      <>
         <header className='mb-1 flex items-center justify-between p-3'>
            <h1 className='text-3xl font-bold'>
               <Link href={'/'}>{title}</Link>
            </h1>
            <div className='flex items-center space-x-2'>
               {sessionData ? (
                  <Link href='/dashboard'>
                     <HiCog size={30} className='text-blue' />
                  </Link>
               ) : null}
               <LogInOutBtn />
            </div>
         </header>
      </>
   );
};

export default Header;
