import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { CategoryForm } from "~/modules/categories/admin/category-form";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { useParams } from "next/navigation";
import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";

const NewCategoryPage: FC = () => {
  const { storeId } = useParams();

  const { data: billboards, isLoading } =
    api.billboards.getAllBillboards.useQuery({
      storeId: storeId as string,
    });

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}
      {!isLoading && (
        <CategoryForm billboards={billboards ?? []} initialData={null} />
      )}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default NewCategoryPage;
