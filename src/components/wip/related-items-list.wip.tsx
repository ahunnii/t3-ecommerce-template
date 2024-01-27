import { cva, type VariantProps } from "class-variance-authority";
import type { FC } from "react";
import NoResults from "~/components/core/ui/no-results";
import ProductCard from "~/components/wip/product-card.wip";
import type { DetailedProductFull } from "~/types";
import { cn } from "~/utils/styles";

interface ProductListProps extends VariantProps<typeof infoVariants> {
  title: string;
  items: DetailedProductFull[];
}

const infoVariants = cva("", {
  variants: {
    variant: {
      default: "text-slate-700",
      dark: "text-black",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const RelatedItemsList: FC<ProductListProps> = ({
  title,
  items,
  ...props
}) => {
  const textStyles = infoVariants({ variant: props?.variant ?? "default" });

  return (
    <div className="mx-auto max-w-7xl  space-y-4">
      <h3 className={cn("text-3xl font-bold ", textStyles)}>{title}</h3>
      {items.length === 0 && <NoResults />}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <ProductCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
};
