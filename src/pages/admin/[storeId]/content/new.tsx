import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { AboutPageForm } from "~/modules/content/components/admin/about-page-form.admin";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import AdminLayout from "~/components/layouts/admin-layout";

const CreateNewPage = () => {
  return (
    <AdminLayout>
      <AboutPageForm initialData={null} />
    </AdminLayout>
  );
};

export default CreateNewPage;
