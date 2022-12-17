import Image from 'next/image';
import { HiChevronLeft } from 'react-icons/hi';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { DayPicker } from 'react-day-picker';
import { useEffect, useState } from 'react';
import { trpc } from '../../utils/trpc';
import React from 'react';

const Resource = () => {
   const router = useRouter();
   const id = useRouter().query.id as string;
   const { data: resource, status } = trpc.resource.getById.useQuery({ id });
   const { data: sessionData } = useSession();

   // State
   const [range, setRange] = useState<any>();
   const [name, setName] = useState<string>('');
   const [email, setEmail] = useState<string>('');

   const addReservation = trpc.reservation.add.useMutation();

   useEffect(() => {
      setName(sessionData?.user?.name as string);
      setEmail(sessionData?.user?.email as string);
   }, [sessionData]);

   // Date Picker Options
   const disabledDays = resource?.reservations?.map((r: any) => ({
      from: new Date(r.startDate),
      to: new Date(r.endDate),
   }));

   let footer = <p>Please pick the first day.</p>;

   if (range?.from) {
      if (!range.to) {
         footer = <p>{format(range.from, 'PPP')}</p>;
      } else if (range.to) {
         footer = (
            <p>
               {format(range.from, 'PPP')} - {format(range.to, 'PPP')}
            </p>
         );
      }
   }

   // ToDo update Make Reservation Api
   async function handleOnSubmit(e: any) {
      e.preventDefault();
      await addReservation.mutateAsync({
         userId: sessionData?.user?.id as string,
         resourceId: id,
         startDate: format(range.from, 'PPP'),
         endDate: format(range.to, 'PPP'),
      });
   }

   if (status !== 'success') {
      return <div>Loading...</div>;
   }

   return (
      <main className='mx-auto max-w-4xl p-4'>
         <header className='mb-6'>
            <div className='flex items-center space-x-2'>
               <HiChevronLeft />
               <button type='button' onClick={() => router.back()}>
                  Back
               </button>
            </div>
         </header>
         <h1 className='mb-4 text-3xl font-bold'>{resource?.title}</h1>
         <div className='res-grid'>
            <div>
               <div
                  className={`relative aspect-[4/3] border border-blue shadow-lg`}
               >
                  <Image
                     src={resource?.mainImage}
                     alt='Resource Image'
                     fill={true}
                     style={{ objectFit: 'cover' }}
                     priority
                  />
               </div>
               <div className='my-2 space-x-1'>
                  {resource.tags?.map((tag) => {
                     return (
                        <span
                           key={tag.id}
                           className='rounded-md bg-blue py-1 px-2 text-sm text-white'
                        >
                           {tag.tag}
                        </span>
                     );
                  })}
               </div>
            </div>
            <div>
               <DayPicker
                  mode='range'
                  selected={range}
                  footer={footer}
                  onSelect={setRange}
                  disabled={disabledDays}
               />
               {sessionData ? (
                  <form className='space-y-3' onSubmit={handleOnSubmit}>
                     <input
                        type='submit'
                        value='Reserve'
                        className='rounded-md bg-blue py-3 px-5 text-white'
                     />
                  </form>
               ) : (
                  <p>Please login to reserve a resource.</p>
               )}
            </div>
         </div>
      </main>
   );
};

export default Resource;
