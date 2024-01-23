import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Button } from "~/components/ui/button";
import { cn } from "~/utils/styles";

const ShoppingBagBtn = ({
  quantity,
  className,
}: { quantity: string | number } & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <Button
      className={cn(
        "flex items-center rounded-full bg-black px-4 py-2",
        className
      )}
    >
      <Link href="/cart" className="flex">
        <ShoppingBag size={20} color="white" />
        <span className="ml-2 text-sm font-medium text-white">{quantity}</span>
      </Link>
    </Button>
  );
};
export default ShoppingBagBtn;
