import { useRouter } from 'next/router';
import { useState } from 'react';
import { trpc } from 'src/utils/trpc';
import { CldUploadButton, CldImage } from 'next-cloudinary';
import { FaWindowClose } from 'react-icons/fa';
import { Tag } from '@prisma/client';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { appRouter } from 'src/server/trpc/router/_app';
import { createContextInner } from 'src/server/trpc/context';
import superjson from 'superjson';

export async function getServerSideProps(
   context: GetServerSidePropsContext<{ id: string }>
) {
   const ssg = createProxySSGHelpers({
      router: appRouter,
      ctx: await createContextInner({ session: null }),
      transformer: superjson, // optional - adds superjson serialization
   });

   const id = context?.query?.id as string;
   const resource = await ssg.resource.getById.fetch({ id });
   const tags = await ssg.tag.getAll.fetch();

   // Make sure to return { props: { trpcState: ssg.dehydrate() } }
   return {
      props: {
         trpcState: ssg.dehydrate(),
         id,
         resource,
         tags,
      },
   };
}

const Edit = (
   props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
   const router = useRouter();
   const { resource, tags } = props;

   // State
   const [mainImage, setMainImage] = useState(resource.mainImage);
   const [cloudRes, setCloudRes] = useState<any>({});
   const [previewUrl, setPreviewUrl] = useState(resource.mainImage);
   const [title, setTitle] = useState(resource.title);
   const [type, setType] = useState(resource.type);
   const [resourceTags, setResourceTags] = useState(resource.tags);

   // Helpers
   const deleteImage = trpc.cloudinary.deleteImage.useMutation();
   const updateResource = trpc.resource.update.useMutation();

   function isChecked(tag: Tag) {
      return resourceTags?.some((r) => r.id == tag.id);
   }

   function handleTagChange(e: any) {
      const box = e.target;
      if (box.checked) {
         setResourceTags((current: any) => [...current, { id: box.value }]);
      } else {
         setResourceTags(resourceTags?.filter((f: any) => f.id !== box.value));
      }
   }

   async function handleDeleteImage() {
      const result = await deleteImage.mutateAsync({
         publicId: cloudRes.public_id,
         resource_type: cloudRes.resource_type,
      });

      if (result?.result == 'ok') {
         setPreviewUrl('');
      } else {
         console.log(result);
      }
   }

   async function handleOnSubmit(e: any) {
      e.preventDefault();
      await updateResource.mutateAsync({
         id: resource?.id,
         type: type,
         mainImage: mainImage,
         title: title,
         tags: resourceTags,
      });

      router.push('/dashboard/resources');
   }

   return (
      <main className='mx-auto max-w-4xl p-3'>
         <h1 className='mb-3 text-2xl'>{title}</h1>
         <form onSubmit={handleOnSubmit} className='space-y-5'>
            <label htmlFor='name' className='flex flex-col'>
               <span className='mb-2'>Name</span>
               <input
                  type='text'
                  name='name'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
               />
            </label>
            <label htmlFor='image' className='flex flex-col'>
               <span className='mb-2'>Image</span>
               {!previewUrl && (
                  <CldUploadButton
                     className='flex h-52 w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-100'
                     onUpload={(error: any, result: any, widget: any) => {
                        setMainImage(result?.info?.url); // Updating local state with asset details
                        setPreviewUrl(result?.info?.thumbnail_url);
                        setCloudRes(result?.info);
                        widget.close(); // Close widget immediately after successful upload
                        console.log(error);
                     }}
                     uploadPreset='clipboard'
                  >
                     <span className='text-blue'>Add Image</span>
                  </CldUploadButton>
               )}
               {previewUrl && (
                  <div className='relative inline-block'>
                     <CldImage
                        src={previewUrl}
                        priority={true}
                        width={800}
                        height={800}
                        alt='resource upload'
                        className='m-auto h-auto w-auto'
                     />
                     <button
                        className='absolute top-0 right-0'
                        type='button'
                        onClick={handleDeleteImage}
                     >
                        <FaWindowClose
                           size={30}
                           className='text-red-600 hover:text-red-500'
                        />
                     </button>
                  </div>
               )}
            </label>
            <label htmlFor='type' className='flex flex-col'>
               <span className='mb-2'>Type</span>
               <select
                  name='type'
                  id='type'
                  value={type}
                  onChange={(e) => setType(e.target.value)}
               >
                  <option value='ELA'>ELA</option>
                  <option value='STEM'>STEM</option>
               </select>
            </label>
            <label htmlFor='tags' className='flex flex-col'>
               <span className='mb-2'>Tags</span>
               <div className='flex w-full flex-wrap gap-2'>
                  {tags?.map((tag: any) => {
                     return (
                        <label key={tag.id} className='filter-btn'>
                           <input
                              className='hidden'
                              type='checkbox'
                              name={tag.tag}
                              id={tag.tag}
                              value={tag.id}
                              checked={isChecked(tag)}
                              onChange={handleTagChange}
                           />
                           <span className='inline-block rounded-md border border-blue py-1 px-3'>
                              {tag.tag}
                           </span>
                        </label>
                     );
                  })}
               </div>
            </label>
            <div className='flex flex-col pt-2'>
               <input
                  type='submit'
                  value='Update'
                  className='cursor-pointer rounded-md bg-blue py-5 text-white'
               />
            </div>
         </form>
      </main>
   );
};

export default Edit;
