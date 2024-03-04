import type { Variation } from "~/types";
import { cn } from "~/utils/styles";

//Display the variant values of the current product in a readable manner
const CartItemVariant = ({ variant }: { variant: Variation | null }) => {
  if (!variant) return null;

  const variantValues = variant.values.split(", ");
  return (
    <div className=" col-span-2 flex text-xs ">
      {variantValues.map((item, idx) => (
        <p
          className={cn(
            "text-gray-600"
            // idx > 0 ? "ml-4 border-l pl-4" : ""
          )}
          key={idx}
        >
          {item}{" "}
          <span className="px-1">
            {idx < variantValues.length - 1 ? " / " : " "}
          </span>
        </p>
      ))}
    </div>
  );
};

export default CartItemVariant;
