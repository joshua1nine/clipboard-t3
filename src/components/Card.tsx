import Image from "next/image";
import Link from "next/link";

interface Props {
  type: string;
  image: string;
  title: string;
  id: string;
}

export const Card = ({ type, image, title, id }: Props) => {
  return (
    <Link href={{ pathname: `/resources/${id}` }}>
      <article>
        <div
          className={`relative aspect-[4/3] shadow-lg ${
            type == "ELA" ? "border-green" : "border-coral"
          } border-2`}
        >
          <span
            className={`${
              type == "ELA" ? "border-green bg-green" : "border-coral bg-coral"
            } absolute bottom-0 left-0 z-40 border py-1 px-2 text-white`}
          >
            {type}
          </span>
          <Image alt="resource" src={image} layout="fill" objectFit="cover" />
        </div>
        <h2 className="mt-2 text-2xl font-semibold leading-none md:mt-1 md:text-xl">
          {title}
        </h2>
      </article>
    </Link>
  );
};
