import NextImage from "next/image";

type Props = { featuredImg: string | null };

export const ViewBlogImage = ({ featuredImg }: Props) => {
  return (
    <div className="relative w-full  rounded-md p-4">
      <NextImage
        src={featuredImg ?? "/placeholder-image.webp"}
        alt="Product thumbnail"
        className=" w-full object-contain"
        sizes="(max-width: 640px) 100vw,"
        layout="responsive"
        width={640}
        height={640}
      />
    </div>
  );
};
