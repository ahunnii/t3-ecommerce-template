"use client";

import { useEffect, useState } from "react";

import { Trash } from "lucide-react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { CloudinaryUpload } from "./cloudinary-upload";

interface ImageUploadProps {
  disabled?: boolean;

  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,

  value,
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
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative h-[200px] w-[200px] overflow-hidden rounded-md"
          >
            <div className="absolute right-2 top-2 z-10">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="sm"
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
        ))}
      </div>
      <CloudinaryUpload disabled={disabled} onChange={onChange} />
      {/* <UploadThingUpload disabled={disabled} onChange={onChange} /> */}
    </div>
  );
};

export default ImageUpload;
