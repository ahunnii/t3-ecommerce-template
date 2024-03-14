import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";

import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
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
        {isLoading && <AbsolutePageLoader />}
        {!isLoading && discount && <DiscountForm initialData={discount} />}
        {!isLoading && !discount && (
          <DataFetchErrorMessage message="There seems to be an issue with loading the discount." />
        )}
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
