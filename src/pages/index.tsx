import Head from 'next/head';
import { type NextPage } from 'next';
import Fuse from 'fuse.js';
import { trpc } from '../utils/trpc';
import Header from '../components/Header';
import { Card } from '../components/Card';
import { useState } from 'react';
import { applyFilters } from '../utils/applyFilters';
import { FilterOverlay } from '../components/FilterOverlay';
import { SearchBar } from '@components/SearchBar';

const Home: NextPage = () => {
   const { data: resources, isLoading } = trpc.resource.getAll.useQuery();
   const { data: tags } = trpc.tag.getAll.useQuery();
   const [filters, setFilters] = useState({ type: 'none', tags: [] });
   const [toggleFilter, setToggleFilter] = useState(false);
   const [query, setQuery] = useState('');

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
      <>
         <Head>
            <title>Clipboard</title>
            <meta
               name='description'
               content='Shawnee Public Schools Clipboard'
            />
            <link rel='icon' href='/favicon.ico' />
         </Head>
         <div className='page'>
            <Header title='Clipboard' />
            <main className='relative mx-auto max-w-4xl'>
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
               <section className='grid gap-4 p-3 sm:grid-cols-2 lg:grid-cols-3'>
                  {searchResults?.map((resource: any) => {
                     return (
                        <Card
                           key={resource.id}
                           id={resource.id}
                           title={resource.title}
                           image={resource.mainImage}
                           type={resource.type}
                        />
                     );
                  })}
               </section>
            </main>
         </div>
      </>
   );
};

export default Home;
