import type { Order } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import type { User } from "next-auth/core/types";

import { AccountHomePage as DefaultAccountHomePage } from "~/blueprints/core/account-home-blueprint";
import { AccountHomePage as CustomAccountHomePage } from "~/blueprints/custom/account-home-blueprint.custom";

import useStorePageRender from "~/hooks/use-store-page-render";
import { getUserOrdersServerSide } from "~/modules/orders/utils/get-user-orders-server-side";
import { authenticateUser, redirectToSignIn } from "~/utils/auth";
const AccountPage = (props: { orders: Order[]; user: User }) => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultAccountHomePage {...props} />;

  return <CustomAccountHomePage {...props} />;
};

export default AccountPage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const user = await authenticateUser(ctx);

  if (!user) return redirectToSignIn();

  const orders = await getUserOrdersServerSide(user.id);

  return { props: { user, orders } };
}
