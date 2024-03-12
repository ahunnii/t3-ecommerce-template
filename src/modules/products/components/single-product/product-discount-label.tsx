import { Tag } from "lucide-react";

type Props = {
  discountDescription: string | undefined | null;
};
export const ProductDiscountLabel = ({ discountDescription }: Props) => {
  if (!discountDescription) return null;
  return (
    <p className="flex items-center gap-2 py-2 text-sm">
      <Tag size={16} /> Discount: {discountDescription}
    </p>
  );
};
