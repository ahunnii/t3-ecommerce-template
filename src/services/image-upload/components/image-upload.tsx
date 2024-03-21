"use client";

import { useEffect, useState } from "react";

import { uniqueId } from "lodash";
import { cn } from "~/utils/styles";
import { CloudinaryImageManagementPanel } from "./cloudinary-image-management-panel";
import { CloudinaryUpload } from "./cloudinary-upload";
import { ImageUploadPreview } from "./image-upload-preview";

type ClassNames = {
  button?: string;
  preview?: string;
};

interface ImageUploadProps {
  disabled?: boolean;
  selected?: string[];
  buttonClassName?: string;
  previewImages?: boolean;
  isSimplifiedBtn?: boolean;
  folder: string;
  maxFiles?: number;
  onChange: (value: string) => void;
  onBulkChange?: (value: string[]) => void;
  onRemove: (value: string) => void;
  value: string[];

  selectPreviousImages?: boolean;

  onMediaDelete?: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  selected,
  onBulkChange,
  onRemove,
  folder,
  value,
  maxFiles,
  buttonClassName,
  onMediaDelete,
  selectPreviousImages = false,
  isSimplifiedBtn = false,

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
    <>
      <div
        className={cn(
          isSimplifiedBtn && " absolute z-0 flex flex-wrap items-center gap-4",
          !isSimplifiedBtn && "mb-4 flex flex-wrap items-center gap-4"
        )}
      >
        {previewImages &&
          value.map((url) => (
            <ImageUploadPreview
              key={url + "-" + uniqueId()}
              url={url}
              onRemove={onRemove}
              className={cn(
                isSimplifiedBtn
                  ? "aspect-square h-10 w-10"
                  : value?.length > 1
                  ? "h-32 w-32"
                  : ""
              )}
              isSimplifiedBtn={isSimplifiedBtn}
            />
          ))}
      </div>

      <div
        className={cn(
          "flex items-center gap-2",
          isSimplifiedBtn && "flex-row-reverse justify-end gap-2"
        )}
      >
        <CloudinaryUpload
          disabled={disabled}
          onChange={onChange}
          folder={folder}
          maxFiles={maxFiles}
          buttonClassName={buttonClassName}
          isSimplifiedBtn={isSimplifiedBtn}
        />

        {selectPreviousImages && (
          <CloudinaryImageManagementPanel
            selected={selected ?? []}
            folder={folder}
            maxLimit={maxFiles}
            isSimplifiedBtn={isSimplifiedBtn}
            handleImageUrls={(imageUrls) => {
              if (onBulkChange) onBulkChange(imageUrls);
            }}
            onMediaDelete={onMediaDelete}
          />
        )}
      </div>
    </>
  );
};

export default ImageUpload;
