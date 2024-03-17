import { ViewSection } from "~/components/common/sections/view-section.admin";
import { CollectionCard } from "~/modules/collections/components/collection-card";

import type { DetailedCollection } from "~/types";

type Props = {
  collection: DetailedCollection | null;
};
export const ViewCategoryCollection = ({ collection }: Props) => {
  return (
    <ViewSection
      title="Collection Enabled"
      description={
        collection
          ? "This is what is visible to customers."
          : "This category does not have a collection."
      }
      className="h-fit"
    >
      {collection ? (
        <div className="grid grid-cols-1">
          <CollectionCard collection={collection} />
        </div>
      ) : (
        <p>Mark this category as a collection as well to see the preview. </p>
      )}
    </ViewSection>
  );
};
