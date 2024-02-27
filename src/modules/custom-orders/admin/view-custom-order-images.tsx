import type { Image } from "@prisma/client";
import NextImage from "next/image";

type ViewCustomOrderImagesProps = {
  images: Image[];
};

export const ViewCustomOrderImages = ({
  images,
}: ViewCustomOrderImagesProps) => {
  return (
    <div className="w-1/4 w-full rounded-md border border-border bg-background/50 p-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Images
      </h3>

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
