import { Trash } from "lucide-react";
import Image from "next/image";
import { forwardRef, type ElementRef, type HTMLAttributes } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/utils/styles";

// value?.length > 1 && "h-32 w-32"
type ImageUploadPreviewProps = {
  url: string;
  onRemove: (value: string) => void;
  isSimplifiedBtn?: boolean;
} & HTMLAttributes<ElementRef<"div">>;
export const ImageUploadPreview = forwardRef<
  ElementRef<"div">,
  ImageUploadPreviewProps
>(({ className, url, onRemove, isSimplifiedBtn, ...props }) => {
  return (
    <div
      className={cn("relative h-48 w-48 overflow-hidden rounded-md", className)}
      {...props}
    >
      <div
        className={cn(
          "absolute right-2 top-2 z-10",
          isSimplifiedBtn && "right-0 top-0 h-5 w-5 "
        )}
      >
        <Button
          type="button"
          onClick={() => onRemove(url)}
          variant="destructive"
          size="sm"
          className={cn(
            isSimplifiedBtn && "m-0 h-5 w-5 rounded-full p-0 hover:bg-red-400"
          )}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      <Image
        fill
        className="object-cover"
        alt="Image"
        src={url}
        sizes=" (max-width: 200px) 100vw, 200px"
        priority
        loading="eager"
      />
    </div>
  );
});

ImageUploadPreview.displayName = "ImageUploadPreview";
