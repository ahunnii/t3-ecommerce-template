import { ViewSection } from "~/components/common/sections/view-section.admin";
import { Badge } from "~/components/ui/badge";
import type { Category } from "~/modules/categories/types";

type Props = {
  category: Category;
};

export const ViewAvailableAttributes = ({ category }: Props) => {
  return (
    <ViewSection
      title="Attributes"
      description="Common attributes that each product in this category has access to for variants."
      className="h-fit"
    >
      {category.attributes.map((attribute) => (
        <div className="flex flex-col pb-4" key={attribute.id}>
          <p className="font-base text-zinc-700">{attribute.name}</p>
          <div className="flex flex-wrap gap-2">
            {attribute?.values.split(";").map((value: string) => (
              <Badge
                key={value}
                variant="outline"
                className="line-clamp-1 block truncate "
              >
                {value}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </ViewSection>
  );
};
