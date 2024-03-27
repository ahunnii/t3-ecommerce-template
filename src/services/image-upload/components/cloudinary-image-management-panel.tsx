import { Check, ImagePlus } from "lucide-react";
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
import { AlertModal } from "~/modules/admin/components/modals/alert-modal";
import { toastService } from "~/services/toast";
import { api } from "~/utils/api";
import { cn } from "~/utils/styles";

export function CloudinaryImageManagementPanel({
  handleImageUrls,
  folder,
  maxLimit,
  isSimplifiedBtn = false,
  selected,
  onMediaDelete,
}: {
  handleImageUrls: (imageUrls: string[]) => void;
  folder: string;
  maxLimit?: number;
  isSimplifiedBtn?: boolean;
  selected: string[];
  onMediaDelete?: (value: string) => void;
}) {
  const getProductImages = api.mediaUpload.getImagesByFolder.useQuery(
    { folder },
    {
      enabled: false && !!folder,
    }
  );

  const deleteProductImage = api.mediaUpload.deleteProductImage.useMutation({
    onSuccess: () => {
      void getProductImages.refetch();
      toastService.success("Image deleted successfully");
    },
    onError: (error) => {
      console.log(error);
      toastService.error("Error deleting image", error);
    },
  });

  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [selectedImageForDeletion, setSelectedImageForDeletion] = useState<{
    id: string;
    url: string;
  } | null>(null);

  const [fetchFlag, setFetchFlag] = useState(false);

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      // void getProductImages.refetch();
      // if (!fetchFlag) {
      void getProductImages.refetch();
      // setFetchFlag(true);
      // }
      setImageUrls([]);
    }
  }, [open, fetchFlag]);

  const handleOnDelete = () => {
    if (selectedImageForDeletion?.id && selectedImageForDeletion?.url) {
      deleteProductImage.mutate({
        public_id: selectedImageForDeletion?.id,
      });
      if (onMediaDelete) onMediaDelete(selectedImageForDeletion.url);
      setSelectedImageForDeletion(null);
      setOpenDelete(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        loading={false}
        setIsOpen={setOpenDelete}
        message="Deleting an image already in use will cause issues with the product media. Are you sure you want to delete this image?"
        onConfirm={handleOnDelete}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={isSimplifiedBtn ? "secondary" : "outline"}
            type="button"
            className={cn(
              isSimplifiedBtn && "m-0 aspect-square border-dashed p-0"
            )}
          >
            <ImagePlus className={cn("h-4 w-4", !isSimplifiedBtn && "mr-2")} />
            <span className={cn(isSimplifiedBtn && "sr-only")}>
              Select from Previous
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-4xl">
          <DialogHeader>
            <DialogTitle>Images</DialogTitle>
            <DialogDescription>
              Select an image from the previous uploads.{" "}
              {maxLimit && "You can select up to " + maxLimit + " image(s)."}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="mx-auto h-96">
            <div className="mx-auto  grid grid-cols-2 items-center justify-normal gap-2  py-4 sm:grid-cols-3 lg:grid-cols-4">
              {getProductImages.data?.resources?.map(
                (image: {
                  public_id: string;
                  secure_url: string;
                  url: string;
                }) => (
                  <div
                    key={image.public_id}
                    className={cn(
                      "group relative h-48 w-48",
                      imageUrls.includes(image.secure_url) && "shadow-lg"
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
                        imageUrls.includes(image.secure_url) && "flex"
                      )}
                    >
                      <Check className="absolute right-2 top-2 h-8  w-8  text-white" />
                    </div>

                    <div
                      className={cn(
                        "0 absolute inset-0 flex items-end justify-between bg-black/25 p-2 opacity-0  transition-all duration-150 ease-in-out group-hover:opacity-100",
                        maxLimit &&
                          !imageUrls.includes(image.secure_url) &&
                          imageUrls.length >= maxLimit &&
                          "group-hover:opacity-0"
                      )}
                    >
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => {
                          if (imageUrls.includes(image.secure_url)) {
                            setImageUrls((prev) =>
                              prev.filter((url) => url !== image.secure_url)
                            );
                          } else {
                            if (maxLimit && imageUrls.length < maxLimit)
                              setImageUrls((prev) => [
                                ...prev,
                                image.secure_url,
                              ]);
                          }
                        }}
                      >
                        {imageUrls.includes(image.secure_url)
                          ? "Deselect"
                          : "Select"}
                      </Button>

                      <Button
                        variant="destructive"
                        type="button"
                        onClick={() => {
                          setSelectedImageForDeletion({
                            id: image.public_id,
                            url: image.secure_url,
                          });
                          setOpenDelete(true);

                          // handleImageUrls(
                          //   imageUrls.filter((url) => url !== image.secure_url)
                          // );

                          // setImageUrls((prev) =>
                          //   prev.filter((url) => url !== image.url)
                          // );

                          // deleteProductImage.mutate({
                          //   public_id: image.public_id,
                          // });
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
            <Button
              type="button"
              onClick={() => {
                handleImageUrls(imageUrls);
                setOpen(false);
              }}
            >
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
