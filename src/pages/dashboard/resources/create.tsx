import { useRouter } from 'next/router';
import { useState } from 'react';
import { trpc } from 'src/utils/trpc';
import { CldUploadButton, CldImage } from 'next-cloudinary';
import { FaWindowClose } from 'react-icons/fa';

const Create = () => {
   const [mainImage, setMainImage] = useState('');
   const [cloudRes, setCloudRes] = useState<any>({});
   const [previewUrl, setPreviewUrl] = useState('');
   const [title, setTitle] = useState('');
   const [type, setType] = useState('');
   const [resourceTags, setResourceTags] = useState([]);

   // Server Side Actions
   const tags = trpc.tag.getAll.useQuery();
   const addResource = trpc.resource.add.useMutation();
   const deleteImage = trpc.cloudinary.deleteImage.useMutation();
   console.log(tags.data);

   const router = useRouter();

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
      await addResource.mutateAsync({ type, mainImage, title });

      router.push('/dashboard/resources');
   }

   return (
      <main className='mx-auto max-w-4xl p-3'>
         <h1 className='text-2xl'>Create New Resource</h1>
         <form className='space-y-3' onSubmit={handleOnSubmit}>
            <label htmlFor='name' className='flex flex-col'>
               <span>Name</span>
               <input
                  type='text'
                  name='name'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
               />
            </label>

            <label htmlFor='type' className='flex flex-col'>
               <span>Type</span>
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
            {!previewUrl && (
               <div>
                  <CldUploadButton
                     onUpload={(error: any, result: any, widget: any) => {
                        setMainImage(result?.info?.public_id); // Updating local state with asset details
                        setPreviewUrl(result?.info?.thumbnail_url);
                        setCloudRes(result?.info);
                        widget.close(); // Close widget immediately after successful upload
                        console.log(error);
                     }}
                     uploadPreset='clipboard'
                  >
                     Upload to Cloudinary
                  </CldUploadButton>
               </div>
            )}
            {previewUrl && (
               <div className='relative inline-block'>
                  <CldImage
                     src={previewUrl}
                     width='400'
                     height='400'
                     alt='resource upload'
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
            <div>
               <input
                  type='submit'
                  value='Submit'
                  className='cursor-pointer rounded-md bg-blue py-3 px-5 text-white'
               />
            </div>
         </form>
      </main>
   );
};

export default Create;
