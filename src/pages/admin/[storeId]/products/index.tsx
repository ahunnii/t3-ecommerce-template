import { format } from "date-fns";
import type { GetServerSidePropsContext } from "next";
import AdminLayout from "~/layouts/AdminLayout";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

import { useEffect, useState } from "react";
import { ProductsClient } from "~/components/admin/products/client";
import type { ProductColumn } from "~/components/admin/products/columns";
import { api } from "~/utils/api";
import { formatter } from "~/utils/styles";

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

const ProductsPage = ({ params }: { params: { storeId: string } }) => {
  const [formattedProducts, setFormattedProducts] = useState<ProductColumn[]>(
    []
  );
  const { data: products } = api.products.getAllProducts.useQuery({
    storeId: params?.storeId,
  });

  useEffect(() => {
    if (products) {
      setFormattedProducts(
        products.map((item) => ({
          id: item.id,
          name: item.name,
          isFeatured: item.isFeatured,
          isArchived: item.isArchived,
          price: formatter.format(parseFloat(item.price.toString())),
          category: item.category.name,
          size: item.size.name,
          color: item.color.value,
          createdAt: format(item.createdAt, "MMMM do, yyyy"),
        }))
      );
    }
  }, [products]);

  return (
    <AdminLayout>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ProductsClient data={formattedProducts} />
        </div>
      </div>
      ;
    </AdminLayout>
  );
};
export default ProductsPage;
