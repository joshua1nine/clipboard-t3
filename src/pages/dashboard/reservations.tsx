import { SearchBar } from '../../components/SearchBar';
import Fuse from 'fuse.js';
import { useState } from 'react';
import Header from '@components/Header';
import BackBtn from '@components/BackBtn';
import { trpc } from 'src/utils/trpc';
import { Reservation } from '@prisma/client';

const Reservations = () => {
   const { data: reservations, isLoading } = trpc.reservation.getAll.useQuery();
   const [query, setQuery] = useState('');
   const [toggleFilter, setToggleFilter] = useState(false);

   const searchItems = isLoading ? [] : (reservations as Reservation[]);

   const fuse = new Fuse(searchItems, {
      keys: ['resource', 'teacher.name', 'type'],
   });

   const results = fuse.search(query);

   const searchResults = query
      ? results.map((result: any) => result.item)
      : reservations;

   const handleOnSearch = (e: any) => {
      const value = e.target.value;
      setQuery(value);
   };
   return (
      <div className='page'>
         <BackBtn />
         <Header title='Reservations' />
         <main className='mx-auto max-w-4xl'>
            <SearchBar
               query={query}
               handleOnSearch={handleOnSearch}
               setToggleFilter={setToggleFilter}
               toggleFilter={toggleFilter}
            />
            <section className='space-y-4 p-3'>
               {searchResults?.map((reservation) => {
                  return (
                     <div
                        key={reservation.id}
                        className={`border-l-4 p-2 ${
                           reservation.resource.type == 'ELA'
                              ? 'border-green'
                              : 'border-coral'
                        }`}
                     >
                        <p>{reservation.user.email}</p>
                        <p className='font-semibold'>
                           {reservation.resource.title}
                        </p>
                        <p>
                           {reservation.startDate} - {reservation.endDate}
                        </p>
                     </div>
                  );
               })}
            </section>
         </main>
      </div>
   );
};

export default Reservations;
