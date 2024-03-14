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
      description=" The main reason for categories is to be able to provide common
    attributes for every product that is a part of this category."
      className="h-fit"
    >
      {category.attributes.map((attribute) => (
        <div className="flex flex-col py-8" key={attribute.id}>
          <p className="font-medium">{attribute.name}</p>
          <div className="flex space-x-2">
            {attribute?.values.split(";").map((value: string) => (
              <Badge key={value} color="primary">
                {value}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </ViewSection>
  );
};
