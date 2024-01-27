import Image from "next/image";
import Link from "next/link";

import { useConfig } from "~/providers/style-config-provider";

import type { DetailedCollection } from "~/types";

import { cn } from "~/utils/styles";

type CollectionCardProps = React.HTMLAttributes<HTMLDivElement> & {
  collection: DetailedCollection;
};

export function CollectionCard({ collection, className }: CollectionCardProps) {
  const config = useConfig();

  return (
    <Link
      href={`/collections/${collection?.id}`}
      className={cn(
        "group cursor-pointer space-y-4 rounded-xl border bg-white p-3",
        className,
        config.collection.card.background
      )}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl">
        <Image
          src={collection.billboard.imageUrl}
          alt={collection.name}
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
          {collection.name}
        </h3>
        <p
          className={cn(
            "text-xs text-muted-foreground",
            config.collection.card.caption
          )}
        >
          {collection.products.length} products
        </p>
      </div>
    </Link>
  );
}
