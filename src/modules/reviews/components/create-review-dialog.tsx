import { Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ProductReviewForm } from "./product-review-form";

export function CreateReviewDialog({
  reviews,
  productId,
}: {
  productId: string;
  reviews: Prisma.ReviewGetPayload<{
    include: {
      user: {
        select: {
          id: true;
          name: true;
          image: true;
        };
      };
      images: true;
    };
  }>[];
}) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const userWrittenReview = reviews.find(
    (review) => review.user.id === session?.user?.id
  );

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 500);
    }
  }, [open]);

  if (!session?.user)
    return (
      <Button variant="outline" disabled={true}>
        Login to write review
      </Button>
    );

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {userWrittenReview ? "Edit your review" : "Write a review"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {userWrittenReview ? "Edit your review" : "Write a review"}
          </DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>

        <ProductReviewForm
          initialData={userWrittenReview ?? null}
          onOpenChange={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
