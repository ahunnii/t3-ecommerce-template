import type { GetServerSidePropsContext } from "next";

import useStorePageRender from "~/hooks/use-store-page-render";

import { AccountSettingsPage as DefaultAccountSettingsPage } from "~/shop/core/pages/account-settings";
import { AccountSettingsPage as CustomAccountSettingsPage } from "~/shop/custom/pages/account-settings";
import { authenticateUser, redirectToSignIn } from "~/utils/auth";

const AccountSettingsPage = () => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultAccountSettingsPage />;

  return <CustomAccountSettingsPage />;
};

export default AccountSettingsPage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const user = await authenticateUser(ctx);

  if (!user) return redirectToSignIn();

  return { props: {} };
}
