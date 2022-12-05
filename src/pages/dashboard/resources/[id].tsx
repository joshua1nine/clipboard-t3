import { useRouter } from "next/router";
import { trpc } from "src/utils/trpc";

const SingleResource = () => {
  const id = useRouter().query.id as string;
  const { data: resource, status } = trpc.resource.getById.useQuery({ id });

  if (status !== "success") {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>{resource?.title}</h1>
    </div>
  );
};

export default SingleResource;
