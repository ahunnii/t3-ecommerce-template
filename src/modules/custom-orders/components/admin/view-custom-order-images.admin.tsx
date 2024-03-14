import type { Image } from "@prisma/client";
import NextImage from "next/image";
import { ViewSection } from "~/components/common/sections/view-section.admin";

type Props = { images: Image[] };

export const ViewCustomOrderImages = ({ images }: Props) => {
  return (
    <ViewSection title="Images" className="w-1/4">
      {images?.length === 0 && (
        <p className="text-sm">
          There are no images associated with this custom order
        </p>
      )}
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
    </ViewSection>
  );
};
