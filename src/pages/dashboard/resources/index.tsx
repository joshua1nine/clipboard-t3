import Fuse from 'fuse.js';
import Link from 'next/link';
import React, { useState } from 'react';
import BackBtn from '@components/BackBtn';
import { FilterOverlay } from '@components/FilterOverlay';
import Header from '@components/Header';
import { SearchBar } from '@components/SearchBar';
import { applyFilters } from 'src/utils/applyFilters';
import { trpc } from 'src/utils/trpc';
import { Resource } from '@prisma/client';
import { useRouter } from 'next/router';

const resources = () => {
   const { data: resources, isLoading } = trpc.resource.getAll.useQuery();
   const { data: tags } = trpc.tag.getAll.useQuery();

   const router = useRouter();
   const [filters, setFilters] = useState({ type: 'none', tags: [] });
   const [toggleFilter, setToggleFilter] = useState(false);
   const [query, setQuery] = useState('');

   const deleteResource = trpc.resource.delete.useMutation();

   const searchItems = isLoading ? [] : applyFilters(resources, filters);

   const fuse = new Fuse(searchItems, {
      keys: ['title', 'tags', 'type'],
   });

   const results = fuse.search(query);

   const searchResults = query
      ? results.map((result: any) => result.item)
      : searchItems;

   const handleOnSearch = (e: any) => {
      const value = e.target.value;
      setQuery(value);
   };
   return (
      <div className='page'>
         <BackBtn />
         <Header title='Resources' />
         <SearchBar
            query={query}
            handleOnSearch={handleOnSearch}
            setToggleFilter={setToggleFilter}
            toggleFilter={toggleFilter}
         />
         {toggleFilter && (
            <FilterOverlay
               filters={filters}
               setFilters={setFilters}
               setToggleFilter={setToggleFilter}
               tags={tags}
            />
         )}
         <main className='mx-auto max-w-4xl px-3'>
            <div className='flex justify-end py-4'>
               <Link href='resources/create'>
                  <button className='rounded bg-blue py-2 px-4 text-white'>
                     Create New Resource
                  </button>
               </Link>
            </div>
            <table className='w-full table-auto border-collapse border border-blue'>
               <thead>
                  <tr className='bg-blue text-white'>
                     <th className='p-4 text-left'>Name</th>
                     <th className='p-4 text-left'>Type</th>
                     <th className='p-4 text-left'></th>
                  </tr>
               </thead>
               <tbody>
                  {searchResults?.map((r: Resource) => {
                     return (
                        <tr key={r.id} className='border-b border-blue'>
                           <td className='p-4 text-left'>
                              <Link href={`resources/${r.id}`}>
                                 <span className='underline'>{r.title}</span>
                              </Link>
                           </td>
                           <td className='p-4 text-left'>
                              <span>{r.type}</span>
                           </td>
                           <td className='flex space-x-3 p-4 text-center'>
                              <Link href={`/dashboard/resources/${r.id}`}>
                                 <img
                                    className='h-5 w-5 text-blue'
                                    src='/pen-solid.svg'
                                    alt=''
                                 />
                              </Link>
                              <button
                                 onClick={() => {
                                    deleteResource.mutate({ id: r.id });
                                    router.reload();
                                 }}
                              >
                                 <img
                                    className='h-5 w-5  text-red-700'
                                    src='/trash-solid.svg'
                                    alt=''
                                 />
                              </button>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </main>
      </div>
   );
};

export default resources;
