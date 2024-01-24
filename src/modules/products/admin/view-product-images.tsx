import type { Image } from "@prisma/client";
import NextImage from "next/image";

type ViewProductImagesProps = {
  featuredImage: string | null;
  images: Image[];
};

export const ViewProductImages = ({
  featuredImage,
  images,
}: ViewProductImagesProps) => {
  return (
    <div className="w-full rounded-md border border-border bg-background/50 p-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Media
      </h3>
      <h4>Thumbnail</h4>
      {!featuredImage && (
        <p>
          You don&apos;t have a featured image set. Defaults to first image in
          media.
        </p>
      )}
      <NextImage
        src={featuredImage ?? "/placeholder-image.webp"}
        alt="Product thumbnail"
        className="h-32 w-32 object-contain"
        width={128}
        height={128}
      />

      <h4>Images</h4>
      {images?.length > 0 &&
        images.map((image) => (
          <NextImage
            key={image.id}
            src={image.url ?? "/placeholder-image.webp"}
            alt="Product thumbnail"
            className="h-32 w-32 object-contain"
            width={128}
            height={128}
          />
        ))}
    </div>
  );
};
