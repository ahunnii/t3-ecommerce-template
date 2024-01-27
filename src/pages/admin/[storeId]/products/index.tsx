import { format } from "date-fns";
import { useCallback, useEffect, useState, type FC } from "react";

import type { Category, Product } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import type { ProductColumn } from "~/modules/products/admin/columns";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";
import { formatter } from "~/utils/styles";

import AdminLayout from "~/components/layouts/AdminLayout";
import PageLoader from "~/components/ui/page-loader";
import { ProductsClient } from "~/modules/products/admin/client";

interface IProps {
  storeId: string;
}

interface ExtendedProduct extends Product {
  category: Category;
}

const ProductsPage: FC<IProps> = ({ storeId }) => {
  const [formattedProducts, setFormattedProducts] = useState<ProductColumn[]>(
    []
  );
  const { data: products } = api.products.getAllProducts.useQuery({
    storeId,
  });

  const formatProducts = useCallback((products: ExtendedProduct[]) => {
    return products.map((item: ExtendedProduct) => ({
      id: item.id,
      storeId: item.storeId,
      name: item.name,
      isFeatured: item.isFeatured,
      isArchived: item.isArchived,
      price: formatter.format(parseFloat(item.price.toString())),
      category: item.category.name,
      featuredImage: item.featuredImage,

      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));
  }, []);

  useEffect(() => {
    if (products)
      setFormattedProducts(formatProducts(products) as ProductColumn[]);
  }, [products, formatProducts]);

  return (
    <AdminLayout title="Products">
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {!products && <PageLoader />}
          {products && <ProductsClient data={formattedProducts} />}
        </div>
      </div>
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const store = await authenticateSession(ctx);

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
      storeId: ctx.query.storeId,
    },
  };
}

export default ProductsPage;
