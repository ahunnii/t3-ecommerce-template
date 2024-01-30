import { Badge } from "~/components/ui/badge";
import type { DetailedCategory } from "~/types";
import { CategoryCard } from "../core/category-card";

export const ViewAttributes = ({
  category,
}: {
  category: DetailedCategory;
}) => {
  return (
    <div className="w-full rounded-md border border-border bg-background/50 p-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Attributes
      </h3>
      <p className="text-sm text-muted-foreground">
        The main reason for categories is to be able to provide common
        attributes for every product that is a part of this category.
      </p>

      {category.attributes.map((attribute) => (
        <div className="flex flex-col py-8" key={attribute.id}>
          <div className="w-full">
            <p className="font-medium">{attribute.name}</p>
            {attribute?.values.split(";").map((value: string) => (
              <Badge key={value} color="primary">
                {value}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
