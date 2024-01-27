import type { GetServerSidePropsContext } from "next";

import type { FC } from "react";

import { SingleCollectionPage as DefaultSingleCollectionPage } from "~/blueprints/core/single-collection-blueprint";
import { SingleCollectionPage as CustomSingleCollectionPage } from "~/blueprints/custom/single-collection-blueprint.custom";

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
