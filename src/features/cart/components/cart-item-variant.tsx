import type { Variation } from "~/types";
import { cn } from "~/utils/styles";

//Display the variant values of the current product in a readable manner
const CartItemVariant = ({ variant }: { variant: Variation | null }) => {
  if (!variant) return null;

  const variantValues = variant.values.split(", ");
  return (
    <div className=" col-span-2 flex text-sm ">
      {variantValues.map((item, idx) => (
        <p
          className={cn(
            "border-gray-200  text-gray-500",
            idx > 0 ? "ml-4 border-l pl-4" : ""
          )}
          key={idx}
        >
          {item}
        </p>
      ))}
    </div>
  );
};

export default CartItemVariant;
