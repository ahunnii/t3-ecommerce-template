import { format } from "date-fns";
import { useCallback, useEffect, useState, type FC } from "react";

import type { Category, Color, Product, Size } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import type { ProductColumn } from "~/components/admin/products/columns";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";
import { formatter } from "~/utils/styles";

import { ProductsClient } from "~/components/admin/products/client";
import PageLoader from "~/components/ui/page-loader";
import AdminLayout from "~/layouts/AdminLayout";

interface IProps {
  storeId: string;
}

interface ExtendedProduct extends Product {
  category: Category;
  // size?: Size;
  // color?: Color;
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
      name: item.name,
      isFeatured: item.isFeatured,
      isArchived: item.isArchived,
      price: formatter.format(parseFloat(item.price.toString())),
      category: item.category.name,
      // size: item?.size?.name ?? "N/A",
      // color: item?.color?.value ?? "N/A",
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));
  }, []);

  useEffect(() => {
    if (products)
      setFormattedProducts(formatProducts(products) as ProductColumn[]);
  }, [products, formatProducts]);

  return (
    <AdminLayout>
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
