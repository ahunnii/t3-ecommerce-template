import { CldUploadWidget } from "next-cloudinary";
import { useEffect, useState } from "react";

import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { env } from "~/env.mjs";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
}
interface Results {
  secure_url: "https://res.cloudinary.com/dlpkok326/image/upload/v1691613998/i4rjxgj1cirznvtqzbwo.png";
}
export const CloudinaryUpload = ({ disabled, onChange }: ImageUploadProps) => {
  const onUpload = (result: { event: string; info: Partial<Results> }) => {
    onChange(result.info.secure_url as string);
  };
  if (
    !env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    !env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  )
    return null;

  return (
    <>
      <CldUploadWidget
        onUpload={onUpload}
        uploadPreset={env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      >
        {({ open }) => {
          const onClick = () => open();

          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </>
  );
};