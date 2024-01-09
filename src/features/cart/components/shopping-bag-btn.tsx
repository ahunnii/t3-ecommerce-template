import { ShoppingBag } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";

const ShoppingBagBtn = ({ quantity }: { quantity: string | number }) => {
  return (
    <Button className="flex items-center rounded-full bg-black px-4 py-2">
      <Link href="/cart" className="flex">
        <ShoppingBag size={20} color="white" />
        <span className="ml-2 text-sm font-medium text-white">{quantity}</span>
      </Link>
    </Button>
  );
};
export default ShoppingBagBtn;
