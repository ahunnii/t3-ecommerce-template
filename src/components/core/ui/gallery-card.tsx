import { Product } from "@prisma/client";
import { Expand, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { MouseEventHandler } from "react";

import Currency from "~/components/core/ui/currency";
import IconButton from "~/components/core/ui/icon-button";
import useCart from "~/hooks/core/use-cart";
import usePreviewModal from "~/hooks/core/use-preview-modal";
import { DetailedProductFull } from "~/types";

interface ProductCard {
  data: string;
}

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

const GalleryCard: React.FC<ProductCard> = ({ data }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group cursor-pointer space-y-4 rounded-xl border bg-white p-3">
          {/* Image & actions */}
          <div className="relative aspect-square rounded-xl bg-gray-100">
            <Image
              src={data ?? ""}
              alt=""
              fill
              className="aspect-square rounded-md object-cover"
            />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="aspect-square ">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Image
              src={data ?? ""}
              alt=""
              fill
              className="aspect-square rounded-md object-cover"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryCard;
