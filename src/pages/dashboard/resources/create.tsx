import { useRouter } from 'next/router';
import { useState } from 'react';
import { trpc } from 'src/utils/trpc';
import { CldUploadButton, CldImage } from 'next-cloudinary';

const Create = () => {
  const [mainImage, setMainImage] = useState('');
  const [cloudinaryRes, setCloudinaryRes] = useState({});
  const [previewUrl, setPreviewUrl] = useState('');

  console.log(cloudinaryRes);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [tags, setTags] = useState([]);
  const addResource = trpc.resource.add.useMutation();
  const router = useRouter();

  const handleOnSubmit = async (e: any) => {
    e.preventDefault();
    const input = { type, mainImage, title };
    try {
      await addResource.mutateAsync(input);
    } catch {}

    router.push('/dashboard/resources');
  };

  return (
    <main>
      <h1>Create New Resource</h1>
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
          <input
            type='text'
            name='type'
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </label>
        <div>
          <CldUploadButton
            onUpload={(error: any, result: any, widget: any) => {
              setMainImage(result?.info?.public_id); // Updating local state with asset details
              setPreviewUrl(result?.info?.thumbnail_url);
              setCloudinaryRes(result); // Updating local state with asset details
              widget.close(); // Close widget immediately after successful upload
              console.log(error);
            }}
            uploadPreset='clipboard'
          >
            Upload to Cloudinary
          </CldUploadButton>
          {previewUrl != '' && (
            <CldImage
              src={previewUrl}
              width='400'
              height='400'
              alt='resource upload'
            />
          )}
        </div>
        <input
          type='submit'
          value='Submit'
          className='rounded-md bg-blue py-3 px-5 text-white'
        />
      </form>
    </main>
  );
};

export default Create;
