import type { GetServerSidePropsContext } from "next";

import type { FC } from "react";

import { SingleCollectionPage as DefaultSingleCollectionPage } from "~/shop/core/pages/single-collection";
import { SingleCollectionPage as CustomSingleCollectionPage } from "~/shop/custom/pages/single-collection";

import useStorePageRender from "~/hooks/use-store-page-render";

type ICollectionPageProps = {
  collectionId: string;
};
const SingleCollectionPage: FC<ICollectionPageProps> = (props) => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultSingleCollectionPage {...props} />;

  return <CustomSingleCollectionPage {...props} />;
};

export default SingleCollectionPage;

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  const { collectionId } = ctx.query;

  return {
    props: {
      collectionId,
    },
  };
};
