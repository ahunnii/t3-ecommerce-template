import Image from "next/image";
import Link from "next/link";

import { useConfig } from "~/providers/style-config-provider";

import type { DetailedCategory } from "~/types";

import { cn } from "~/utils/styles";

type CategoryCardProps = React.HTMLAttributes<HTMLDivElement> & {
  category: DetailedCategory;
};

export function CategoryCard({ category, className }: CategoryCardProps) {
  const config = useConfig();

  return (
    <Link
      href={`/categories/${category?.id}`}
      className={cn(
        "group cursor-pointer space-y-4 rounded-xl border bg-white p-3",
        className,
        config.collection.card.background
      )}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl">
        <Image
          src={category?.collection?.image?.url ?? "/placeholder-image.webp"}
          alt={category.name}
          fill
          className={cn(
            "h-auto w-auto object-cover transition-all hover:scale-105",
            "aspect-square"
          )}
        />
      </div>

      <div className="space-y-1 text-sm">
        <h3
          className={cn(
            "font-medium leading-none",
            config.collection.card.text
          )}
        >
          {category.name}
        </h3>
        <p
          className={cn(
            "text-xs text-muted-foreground",
            config.collection.card.caption
          )}
        >
          {category.attributes.length} attributes available
        </p>
      </div>
    </Link>
  );
}
