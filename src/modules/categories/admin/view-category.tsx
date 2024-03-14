import { ViewSection } from "~/components/common/sections/view-section.admin";
import { CollectionCard } from "~/modules/collections/components/collection-card";
import type { Collection } from "~/modules/collections/types";
import type { DetailedCategory, DetailedCollection } from "~/types";
import { CategoryCard } from "../core/category-card";

type Props = {
  collection: DetailedCollection | null;
};
export const ViewCategoryCollection = ({ collection }: Props) => {
  return (
    <ViewSection
      title="Collection Preview"
      description="This is what is visible to customers."
    >
      {collection ? (
        <div className="grid grid-cols-1">
          <CollectionCard collection={collection} />
        </div>
      ) : (
        <p>This category does not have a collection.</p>
      )}
    </ViewSection>
  );
};
