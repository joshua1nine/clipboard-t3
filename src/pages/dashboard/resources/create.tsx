import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "src/utils/trpc";

const Create = () => {
  const [mainImage, setMainImage] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [tags, setTags] = useState([]);

  const addResource = trpc.resource.add.useMutation();
  const router = useRouter();

  const handleOnSubmit = async (e: any) => {
    e.preventDefault();
    const input = { type, mainImage, title };
    try {
      await addResource.mutateAsync(input);
    } catch {}

    router.push("/dashboard/resources");
  };

  return (
    <main>
      <h1>Create New Resource</h1>
      <form className="space-y-3" onSubmit={handleOnSubmit}>
        <label htmlFor="name" className="flex flex-col">
          <span>Name</span>
          <input
            type="text"
            name="name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label htmlFor="type" className="flex flex-col">
          <span>Type</span>
          <input
            type="text"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </label>
        <label htmlFor="image" className="flex flex-col">
          <span>Image</span>
          <input
            type="text"
            name="image"
            value={mainImage}
            onChange={(e) => setMainImage(e.target.value)}
          />
        </label>
        <input
          type="submit"
          value="Submit"
          className="rounded-md bg-blue py-3 px-5 text-white"
        />
      </form>
    </main>
  );
};

export default Create;
