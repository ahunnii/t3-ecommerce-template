"use client";

import { useEffect, useState } from "react";

import { CloudinaryUpload } from "./cloudinary-upload";
import { ImageManagementPanel } from "./image-management-panel";
import { ImageUploadPreview } from "./image-upload-preview";

interface ImageUploadProps {
  disabled?: boolean;
  secure?: boolean;
  buttonClassName?: string;
  previewImages?: boolean;
  isSimplifiedBtn?: boolean;
  productUpload?: boolean;
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
  isSimplifiedBtn = false,
  secure = true,
  previewImages = true,
  productUpload = false,
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
      {isSimplifiedBtn ? (
        <>
          <div className=" absolute z-40 flex flex-wrap items-center gap-4">
            {previewImages &&
              value.map((url) => (
                <ImageUploadPreview
                  key={url}
                  url={url}
                  onRemove={onRemove}
                  className={"aspect-square h-10 w-10"}
                  isSimplifiedBtn={isSimplifiedBtn}
                />
              ))}
          </div>
        </>
      ) : (
        <>
          {" "}
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
        </>
      )}

      <CloudinaryUpload
        disabled={disabled}
        onChange={onChange}
        secure={secure}
        buttonClassName={buttonClassName}
        isSimplifiedBtn={isSimplifiedBtn}
      />
      <ImageManagementPanel />
      {/* <UploadThingUpload disabled={disabled} onChange={onChange} /> */}
    </div>
  );
};

export default ImageUpload;
