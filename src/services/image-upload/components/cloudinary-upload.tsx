import { CldUploadWidget } from "next-cloudinary";

import { ImagePlus } from "lucide-react";

import { Button } from "~/components/ui/button";
import { env } from "~/env.mjs";
import { ImageUpIcon } from "~/modules/icons/image-up";
import { cn } from "~/utils/styles";

type Results = { secure_url: string };

type Props = {
  disabled?: boolean;

  folder?: string;
  maxFiles?: number;

  buttonClassName?: string;
  isSimplifiedBtn?: boolean;

  onChange: (value: string) => void;
};

export const CloudinaryUpload = ({
  disabled,
  onChange,
  buttonClassName,
  folder,
  maxFiles = 3,
  isSimplifiedBtn = false,
}: Props) => {
  const onUpload = (result: { event: string; info: Partial<Results> }) => {
    onChange(result.info.secure_url!);
  };

  if (!env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) return null;

  return (
    <>
      <CldUploadWidget
        onUpload={onUpload}
        options={{
          sources: ["local", "url", "unsplash"],
          ...{ folder, maxFiles },
        }}
        signatureEndpoint={"/api/cloudinary"}
      >
        {({ open }) => {
          const onClick = () => open();

          return (
            <Button
              type="button"
              disabled={disabled}
              variant={isSimplifiedBtn ? "outline" : "secondary"}
              onClick={onClick}
              className={cn(
                isSimplifiedBtn && "m-0 aspect-square border-dashed p-0",
                buttonClassName
              )}
            >
              <ImageUpIcon
                className={cn("h-4 w-4", !isSimplifiedBtn && "mr-2")}
              />
              <span className={cn(isSimplifiedBtn && "sr-only")}>
                Upload an Image
              </span>
            </Button>
          );
        }}
      </CldUploadWidget>
    </>
  );
};
