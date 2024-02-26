import { CldUploadWidget } from "next-cloudinary";

import { ImagePlus } from "lucide-react";

import { Button } from "~/components/ui/button";
import { env } from "~/env.mjs";

type Results = { secure_url: string };

type Props = {
  disabled?: boolean;
  secure?: boolean;
  onChange: (value: string) => void;
};

export const CloudinaryUpload = ({
  disabled,
  onChange,
  secure = true,
}: Props) => {
  const onUpload = (result: { event: string; info: Partial<Results> }) => {
    onChange(result.info.secure_url!);
  };

  if (!env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) return null;

  const props = secure
    ? { signatureEndpoint: "/api/cloudinary" }
    : { uploadPreset: env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET, maxFiles: 3 };

  return (
    <>
      <CldUploadWidget
        onUpload={onUpload}
        options={{ sources: ["local", "url", "unsplash"] }}
        {...props}
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
