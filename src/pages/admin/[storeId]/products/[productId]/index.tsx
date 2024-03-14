import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";

import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import AdminLayout from "~/components/layouts/admin-layout";

import { Pencil } from "lucide-react";
import Link from "next/link";
import { AdminFormBody } from "~/components/common/admin/admin-form-body";
import { AdminFormHeader } from "~/components/common/admin/admin-form-header";
import { Button } from "~/components/ui/button";
import { ViewProductAttributes } from "~/modules/products/components/admin/view-product-attributes";
import { ViewProductDetails } from "~/modules/products/components/admin/view-product-details";
import { ViewProductImages } from "~/modules/products/components/admin/view-product-images";
import { ViewProductsShipping } from "~/modules/products/components/admin/view-product-shipping";
import { ViewProductVariants } from "~/modules/products/components/admin/view-product-variants";

interface IProps {
  storeId: string;
  productId: string;
}

const ProductPage: FC<IProps> = ({ storeId, productId }) => {
  const { data: product, isLoading } = api.products.getProduct.useQuery({
    productId,
  });

  const editProduct = `/admin/${storeId}/products/${product?.id}/edit`;
  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}

      {!isLoading && product && (
        <>
          <AdminFormHeader
            title={product.name}
            description={"View details about your product at a glance."}
            contentName="Products"
            link={`/admin/${product.storeId}/products`}
          >
            <Link href={editProduct}>
              <Button className="flex gap-2" size={"sm"}>
                <Pencil className="h-5 w-5" /> Edit...
              </Button>
            </Link>
          </AdminFormHeader>

          <AdminFormBody className="flex w-full gap-4 space-y-0 max-lg:flex-col">
            <div className="flex w-full flex-col space-y-4 lg:w-8/12">
              <ViewProductDetails {...product} />{" "}
              <ViewProductAttributes {...product} />
              <ViewProductVariants {...product} />
              <ViewProductsShipping {...product} />
            </div>
            <div className="flex w-full flex-col lg:w-4/12">
              <ViewProductImages {...product} />
            </div>
          </AdminFormBody>
        </>
      )}
      {!isLoading && !product && (
        <DataFetchErrorMessage message="There seems to be an issue with loading the product." />
      )}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx, (ctx) => {
    return {
      props: {
        productId: ctx.query.productId,
        storeId: ctx.query.storeId,
      },
    };
  });
}

export default ProductPage;
