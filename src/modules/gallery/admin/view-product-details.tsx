import parse from "html-react-parser";
import { Pencil } from "lucide-react";
import Link from "next/link";
import Currency from "~/components/core/ui/currency";
import { Button } from "~/components/ui/button";
import { cn } from "~/utils/styles";
type ViewProductDetailsProps = {
  name: string;
  category: {
    name: string;
  };
  price: number;
  estimatedCompletion: number;
  description?: string | null;
  storeId: string;
  id: string;
};
export const ViewProductDetails = ({
  name,
  category,
  price,
  estimatedCompletion,
  description,
  storeId,
  id,
}: ViewProductDetailsProps) => {
  return (
    <div className="w-full rounded-md border border-border bg-background/50 p-4">
      <div className="flex justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {name}
        </h3>
        <Link href={`/admin/${storeId}/products/${id}/edit`}>
          <Button className="flex gap-2">
            {" "}
            <Pencil className="h-5 w-5" />
            Edit...
          </Button>
        </Link>
      </div>
      <p>Details</p>
      <p>
        Priced at: <Currency value={price} />
      </p>
      <p>Category: {category?.name}</p>
      <p>Estimated Completion: {estimatedCompletion} days</p>
      <p>Collection: TODO</p>
      <p>Description: </p>{" "}
      <div className={cn("", "")}>
        {parse(description ?? "No description provided")}
      </div>
    </div>
  );
};
