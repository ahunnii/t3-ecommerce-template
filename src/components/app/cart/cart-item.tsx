import { FormInput, X } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";

import Currency from "~/components/app/ui/currency";
import IconButton from "~/components/app/ui/icon-button";
import { FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import useCart from "~/hooks/app/use-cart";
import type { CartItem, Product } from "~/types";
import { cn } from "~/utils/styles";

interface CartItemProps {
  data: CartItem;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart();

  const onRemove = () => {
    cart.removeItem(data.product.id);
  };

  return (
    <li className="flex border-b py-6">
      <div className="relative h-24 w-24 overflow-hidden rounded-md sm:h-48 sm:w-48">
        <Image
          fill
          src={data?.product.images[0]?.url ?? ""}
          alt=""
          className="object-cover object-center"
        />
      </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="absolute right-0 top-0 z-10">
          <IconButton onClick={onRemove} icon={<X size={15} />} />
        </div>{" "}
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className=" text-lg font-semibold text-black">
              {data.product.name}
            </p>
          </div>

          <div className="mt-1 flex text-sm">
            {data.variant?.values.split(", ").map((item, idx) => (
              <p
                className={cn(
                  "  border-gray-200  text-gray-500",
                  idx > 0 ? "ml-4 border-l pl-4" : ""
                )}
                key={idx}
              >
                {item}
              </p>
            ))}
          </div>
          <Currency value={data.product.price} />
        </div>
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex flex-col">
            <Label>Quantity</Label>{" "}
            <Input
              type="number"
              min={0}
              max={data.variant?.quantity ?? 10}
              defaultValue={data.quantity}
              onChange={(e) => {
                if (Number(e.target.value) > (data.variant?.quantity ?? 10)) {
                  toast.error("Quantity exceeds stock");
                } else {
                  cart.updateQuantity(data.product.id, Number(e.target.value));

                  if (Number(e.target.value) == (data.variant?.quantity ?? 10))
                    toast.error("Maximum quantity reached");
                }
              }}
            />
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
