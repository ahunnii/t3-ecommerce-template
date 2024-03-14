import type { DetailedCollection } from "~/types";
import { CollectionCard } from "../collection-card";

export const ViewCollectionPreview = ({
  collection,
}: {
  collection: DetailedCollection;
}) => {
  return (
    <div className="w-full rounded-md border border-border bg-background/50 p-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Preview
      </h3>
      <p className="text-sm text-muted-foreground">
        This is what is shown to customers on the &quot;All Collections&quot;
        page.
      </p>

      <div className="grid grid-cols-2 py-8">
        {collection && <CollectionCard collection={collection} />}
      </div>
    </div>
  );
};
