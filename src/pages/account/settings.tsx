import type { GetServerSidePropsContext } from "next";

import useStorePageRender from "~/hooks/use-store-page-render";

import { AccountSettingsPage as DefaultAccountSettingsPage } from "~/blueprints/core/account-settings";
import { AccountSettingsPage as CustomAccountSettingsPage } from "~/blueprints/custom/account-settings-blueprint.custom";
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
