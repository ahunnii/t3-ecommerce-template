import type { Image as DbImage } from "@prisma/client";
import Image from "next/image";

type Props = {
  featuredImage: string | null;
  images: DbImage[];
};

export const ViewProductImages = ({ featuredImage, images }: Props) => {
  return (
    <div className="w-full rounded-md border border-border bg-background/50 p-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Media
      </h3>
      <h4 className="mt-5 text-sm font-semibold">Featured Image</h4>
      {!featuredImage && (
        <p>
          You don&apos;t have a featured image set. Defaults to first image in
          media.
        </p>
      )}
      <Image
        src={featuredImage ?? "/placeholder-image.webp"}
        alt="Product thumbnail"
        className="h-32 w-32 rounded-md object-contain"
        width={128}
        height={128}
      />

      <h4 className="mt-5 text-sm font-semibold">Media</h4>
      <div className="flex flex-wrap gap-2">
        {images?.length > 0 &&
          images.map((image) => (
            <Image
              key={image.id}
              src={image.url ?? "/placeholder-image.webp"}
              alt="Product thumbnail"
              className="h-24 w-24 rounded-md object-contain"
              width={56}
              height={56}
            />
          ))}
      </div>
    </div>
  );
};
