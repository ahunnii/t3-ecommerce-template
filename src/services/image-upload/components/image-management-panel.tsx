import { Check } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { api } from "~/utils/api";
import { cn } from "~/utils/styles";

export function ImageManagementPanel() {
  const getProductImages = api.mediaUpload.getProductImages.useQuery(
    undefined,
    {
      enabled: false,
    }
  );

  const [open, setOpen] = useState(false);

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      void getProductImages.refetch();
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button">
          Select from Previous
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-7xl">
        <DialogHeader>
          <DialogTitle>Images</DialogTitle>
          <DialogDescription>
            Select an image from the previous uploads
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96">
          <div className="flex flex-wrap justify-evenly gap-4 py-4">
            {getProductImages.data?.resources.map(
              (image: {
                public_id: string;
                secure_url: string;
                url: string;
              }) => (
                <div
                  key={image.public_id}
                  className={cn(
                    "group relative h-48 w-48",
                    imageUrls.includes(image.url) && "shadow-lg"
                  )}
                >
                  <Image
                    src={image.secure_url}
                    alt={image.public_id}
                    fill
                    className={"h-full w-full object-cover "}
                  />
                  <div
                    className={cn(
                      "relative hidden h-full w-full border-8 border-zinc-600 bg-zinc-500/25 ",
                      imageUrls.includes(image.url) && "flex"
                    )}
                  >
                    <Check className="absolute right-2 top-2 h-8  w-8  text-white" />
                  </div>

                  <div
                    className={cn(
                      "0 absolute inset-0 flex items-end justify-between bg-black/25 p-2 opacity-0  transition-all duration-150 ease-in-out group-hover:opacity-100"
                    )}
                  >
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        if (imageUrls.includes(image.url)) {
                          setImageUrls((prev) =>
                            prev.filter((url) => url !== image.url)
                          );
                        } else {
                          setImageUrls((prev) => [...prev, image.url]);
                        }
                      }}
                    >
                      Select
                    </Button>

                    <Button
                      variant="destructive"
                      type="button"
                      onClick={() => {
                        console.log("clicked");
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button
            type="button"
            variant={"outline"}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button">Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
