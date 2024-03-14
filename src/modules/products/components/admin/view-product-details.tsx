import parse from "html-react-parser";

import Currency from "~/components/core/ui/currency";

import { Label } from "~/components/ui/label";
import { cn } from "~/utils/styles";

type Props = {
  name: string;
  category: {
    id: string;
    name: string;
  };
  collections: {
    id: string;
    name: string;
  }[];

  quantity: number;
  price: number;
  estimatedCompletion: number;
  description?: string | null;
  storeId: string;
  id: string;
  variants: {
    id: string;
    price: number;
  }[];
};
export const ViewProductDetails = ({
  name,
  category,
  collections,
  quantity,
  price,
  estimatedCompletion,
  description,

  variants,
}: Props) => {
  const lowestPrice =
    variants?.length > 0 ? Math.min(...variants.map((v) => v.price)) : price;

  const highestPrice =
    variants?.length > 0 ? Math.max(...variants.map((v) => v.price)) : price;
  return (
    <div className="w-full rounded-md border border-border bg-background/50 p-4">
      <div className="flex justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {name}
        </h3>
      </div>

      <div className="grid grid-cols-3 items-start">
        <Label className="text-sm" htmlFor="name">
          Name
        </Label>
        <div className="col-span-2 flex items-center text-sm">{name}</div>
      </div>

      <div className="grid grid-cols-3 items-start">
        <Label className="text-sm" htmlFor="price">
          Pricing
        </Label>
        <div className="col-span-2 flex items-center gap-1 text-sm">
          {" "}
          <Currency
            value={lowestPrice}
            className="text-sm font-normal"
          /> to{" "}
          <Currency value={highestPrice} className="text-sm font-normal" />
        </div>
      </div>
      <div className="grid grid-cols-3 items-start">
        <Label className="text-sm" htmlFor="availability">
          Availability
        </Label>
        <div className="col-span-2 flex items-center text-sm">
          {variants?.length > 0 ? "See variants" : quantity}
        </div>
      </div>
      <div className="grid grid-cols-3 items-start">
        <Label className="text-sm" htmlFor="availability">
          Estimated Completion
        </Label>
        <div className="col-span-2 flex items-center text-sm">
          {estimatedCompletion && estimatedCompletion > 0
            ? `${estimatedCompletion} day{s}`
            : "Ready to Ship"}
        </div>
      </div>
      <div className="grid grid-cols-3 items-start">
        <Label className="text-sm" htmlFor="availability">
          Category
        </Label>
        <div className="col-span-2 flex items-center text-sm">
          {category?.name}
        </div>
      </div>
      <div className="grid grid-cols-3 items-start">
        <Label className="text-sm" htmlFor="availability">
          Collections
        </Label>
        <div className="col-span-2 flex items-center text-sm">
          {collections.map((collection, idx) => (
            <span key={collection.id}>
              {collection?.name} {idx < collections?.length - 1 ? "," : ""}
            </span>
          ))}
        </div>
      </div>
      <Label className="text-sm" htmlFor="availability">
        Description
      </Label>

      <div className={cn(" text-sm", "")}>
        {parse(
          description && description !== ""
            ? description
            : "No description provided"
        )}
      </div>
    </div>
  );
};
