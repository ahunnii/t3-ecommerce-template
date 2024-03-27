import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { AboutPageForm } from "~/modules/content/components/admin/about-page-form.admin";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import AdminLayout from "~/components/layouts/admin-layout";

interface IProps {
  contentSlug: string;
}

const EditAboutPage: FC<IProps> = ({ contentSlug }) => {
  const getAboutData = api.content.getPage.useQuery({
    slug: contentSlug,
  });

  const isLoading = getAboutData.isLoading;
  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}

      {!isLoading && getAboutData.data && (
        <AboutPageForm initialData={getAboutData.data} />
      )}

      {!isLoading && !getAboutData.data && (
        <DataFetchErrorMessage message="There seems to be an issue with loading the category." />
      )}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx, (ctx) => {
    return {
      props: {
        contentSlug: ctx.query.contentSlug,
      },
    };
  });
}

export default EditAboutPage;
