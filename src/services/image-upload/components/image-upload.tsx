"use client";

import { useEffect, useState } from "react";

import { CloudinaryUpload } from "./cloudinary-upload";
import { ImageUploadPreview } from "./image-upload-preview";

interface ImageUploadProps {
  disabled?: boolean;
  secure?: boolean;
  buttonClassName?: string;
  previewImages?: boolean;

  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
  buttonClassName,
  secure = true,
  previewImages = true,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {previewImages &&
          value.map((url) => (
            <ImageUploadPreview
              key={url}
              url={url}
              onRemove={onRemove}
              className={value?.length > 1 ? "h-32 w-32" : ""}
            />
          ))}
      </div>
      <CloudinaryUpload
        disabled={disabled}
        onChange={onChange}
        secure={secure}
        buttonClassName={buttonClassName}
      />
      {/* <UploadThingUpload disabled={disabled} onChange={onChange} /> */}
    </div>
  );
};

export default ImageUpload;
