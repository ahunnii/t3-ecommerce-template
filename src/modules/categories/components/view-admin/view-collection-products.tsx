import { ViewSection } from "~/components/common/sections/view-section.admin";
import { AdvancedDataTable } from "~/components/common/tables/advanced-data-table";
import type { CategoryProduct } from "../../../products/types";
import { productColumn } from "./product-columns";

export const ViewCategoryProducts = ({
  products,
}: {
  products: CategoryProduct[];
}) => {
  return (
    <ViewSection
      title="Products"
      description="These are all the products associated with this category"
      bodyClassName="mt-4"
    >
      <AdvancedDataTable
        searchKey="name"
        columns={productColumn}
        data={products}
      />
    </ViewSection>
  );
};
