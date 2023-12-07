import Image from "next/image";
import { useRouter } from "next/navigation";
import { DetailedCollection } from "~/types";

import { cn } from "~/utils/styles";

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  collection: DetailedCollection;
}

export function CollectionCard({
  collection,

  className,
  ...props
}: AlbumArtworkProps) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/collections/${collection?.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group cursor-pointer space-y-4 rounded-xl border bg-white p-3",
        className
      )}
      {...props}
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
        <h3 className="font-medium leading-none">{collection.name}</h3>
        <p className="text-xs text-muted-foreground">
          {collection.products.length} products
        </p>
      </div>
    </div>
  );
}
