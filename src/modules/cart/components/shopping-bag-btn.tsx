import { ShoppingBag } from "lucide-react";

import React from "react";

import { Button } from "~/components/ui/button";
import { cn } from "~/utils/styles";

const ShoppingBagBtn = ({
  quantity,
  className,
}: { quantity: string | number } & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    // <Link href="/cart" className="flex">
    <Button
      className={cn(
        "flex items-center rounded-full bg-black px-4 py-2",
        className
      )}
      // onClick={() => void router.push("/cart")}
    >
      <ShoppingBag size={20} color="white" />
      <span className="ml-2 text-sm font-medium text-white">{quantity}</span>
    </Button>
    // </Link>
  );
};
export default ShoppingBagBtn;
