import { Size } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import { ProductForm } from "~/components/admin/products/product-form";
import AdminLayout from "~/layouts/AdminLayout";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

import { api } from "~/utils/api";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const userId = session.user.id;

  const store = await prisma.store.findFirst({
    where: {
      id: ctx.query.storeId as string,
      userId,
    },
  });

  if (!store) {
    return {
      redirect: {
        destination: `/admin`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      params: ctx.query,
    },
  };
}

const ProductPage = ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  const { data: product } = api.products.getProduct.useQuery({
    productId: params?.productId,
  });

  const { data: categories } = api.categories.getAllCategories.useQuery({
    storeId: params?.storeId,
  });
  const { data: sizes } = api.sizes.getAllSizes.useQuery({
    storeId: params?.storeId,
  });

  const { data: colors } = api.colors.getAllColors.useQuery({
    storeId: params?.storeId,
  });

  return (
    <AdminLayout>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {product && (
            <ProductForm
              categories={categories ?? []}
              colors={colors ?? []}
              sizes={sizes ?? []}
              initialData={product}
            />
          )}
          {!product && (
            <ProductForm
              categories={categories ?? []}
              colors={colors ?? []}
              sizes={sizes ?? []}
              initialData={null}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductPage;
