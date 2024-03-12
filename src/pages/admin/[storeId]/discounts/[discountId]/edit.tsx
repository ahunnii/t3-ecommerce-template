import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";

import { DiscountForm } from "~/modules/discounts/admin/discount-form";

interface IProps {
  storeId: string;
  discountId: string;
}

const EditDiscountPage: FC<IProps> = ({ discountId }) => {
  const { data: discount, isLoading } = api.discounts.getDiscount.useQuery({
    discountId,
  });

  return (
    <>
      <AdminLayout>
        <div className="flex h-full flex-col bg-gray-50/25 dark:bg-slate-900">
          <div className="flex-1 space-y-4 p-8 pt-6">
            {isLoading && <AbsolutePageLoader />}
            {!isLoading && discount && <DiscountForm initialData={discount} />}
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx, (ctx) => {
    return {
      props: {
        storeId: ctx.query.storeId,
        discountId: ctx.query.discountId,
      },
    };
  });
}

export default EditDiscountPage;
