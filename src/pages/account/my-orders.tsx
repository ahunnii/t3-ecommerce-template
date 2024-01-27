import type { GetServerSidePropsContext } from "next";

import type { Order } from "@prisma/client";

import useStorePageRender from "~/hooks/use-store-page-render";

import { getUserOrdersServerSide } from "~/modules/orders/utils/get-user-orders-server-side";

import { AccountOrdersPage as DefaultAccountOrdersPage } from "~/blueprints/core/account-orders-blueprint";
import { AccountOrdersPage as CustomAccountOrdersPage } from "~/blueprints/custom/account-orders-blueprint.custom";

import { authenticateUser, redirectToSignIn } from "~/utils/auth";

const MyOrdersPage = (props: { orders: Order[] }) => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultAccountOrdersPage {...props} />;

  return <CustomAccountOrdersPage {...props} />;
};

export default MyOrdersPage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const user = await authenticateUser(ctx);

  if (!user) return redirectToSignIn();

  const orders = await getUserOrdersServerSide(user.id);

  return { props: { orders } };
}
