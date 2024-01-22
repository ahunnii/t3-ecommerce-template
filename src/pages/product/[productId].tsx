import type { GetServerSidePropsContext } from "next";

import useStorePageRender from "~/hooks/use-store-page-render";
import { prisma } from "~/server/db";

import { SingleProductPage as DefaultSingleProductPage } from "~/shop/core/pages/single-product";
import { SingleProductPage as CustomSingleProductPage } from "~/shop/custom/pages/single-product";

const ProductPage = (props: { name: string; prevUrl: string }) => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultSingleProductPage {...props} />;

  return <CustomSingleProductPage {...props} />;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { productId } = context.params!;

  const product = await prisma.product.findFirst({
    where: {
      id: productId as string,
    },
  });

  if (!product)
    return {
      notFound: true,
    };
  return {
    props: {
      prevUrl: context.req.headers.referer ?? "",
      name: product?.name ?? "",
    },
  };
}

export default ProductPage;
