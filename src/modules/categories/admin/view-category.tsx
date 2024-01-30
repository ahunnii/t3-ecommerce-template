import type { DetailedCategory } from "~/types";
import { CategoryCard } from "../core/category-card";

export const ViewCategory = ({ category }: { category: DetailedCategory }) => {
  return (
    <div className="w-full rounded-md border border-border bg-background/50 p-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Preview
      </h3>
      <p className="text-sm text-muted-foreground">
        This is what is shown at the top of each category page. (Currently just
        migrated to all collections....)
      </p>

      <div className="grid grid-cols-3 py-8">
        <CategoryCard category={category} />
      </div>
    </div>
  );
};
