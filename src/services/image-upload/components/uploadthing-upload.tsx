import { ImagePlus } from "lucide-react";
import { env } from "~/env.mjs";
import { UploadButton } from "~/services/image-upload/utils/uploadthing";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
}

export const UploadThingUpload = ({ onChange }: ImageUploadProps) => {
  if (!env.NEXT_PUBLIC_UPLOADTHING_APP_ID) return null;

  return (
    <>
      <UploadButton
        className=" items-start justify-start"
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);

          if (res.length > 0) {
            alert("Upload Completed");
            onChange(res[0]!.url);
          } else alert("Upload Failed");
          //   onChange(res[0].url);
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
        appearance={{
          allowedContent: " text-center items-center place-self-center",
          container: "w-max flex-col ",
          button:
            "w-auto inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2",
        }}
        content={{
          button({ ready }) {
            if (ready)
              return (
                <>
                  {" "}
                  <ImagePlus className="mr-2 h-4 w-4" />
                  <p className=""> Upload an Image</p>
                </>
              );

            return "Getting ready...";
          },
        }}
      />
    </>
  );
};
