import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";
import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import AdminLayout from "~/components/layouts/admin-layout";

import { Pencil } from "lucide-react";
import Link from "next/link";
import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { AdminFormBody } from "~/components/common/admin/admin-form-body";
import { AdminFormHeader } from "~/components/common/admin/admin-form-header";

import { ViewSection } from "~/components/common/sections/view-section.admin";
import { Button } from "~/components/ui/button";

interface IProps {
  storeId: string;
  discountId: string;
}

const DiscountPage: FC<IProps> = ({ storeId, discountId }) => {
  const { data: discount, isLoading } = api.discounts.getDiscount.useQuery({
    discountId,
  });

  const isPercentage = discount?.valueType === "PERCENTAGE";
  const isFixed = discount?.valueType === "FIXED";

  return (
    <>
      <AdminLayout>
        {isLoading && <AbsolutePageLoader />}
        {!isLoading && discount && (
          <>
            <AdminFormHeader
              title={discount.code}
              description={"View details on your discount at a glance."}
              contentName="Discounts"
              link={`/admin/${storeId}/discounts`}
            >
              <Link href={`/admin/${storeId}/discounts/${discount?.id}/edit`}>
                <Button className="flex gap-2">
                  <Pencil className="h-5 w-5" />
                  Edit...
                </Button>
              </Link>
            </AdminFormHeader>

            <AdminFormBody>
              <ViewSection
                title="Details"
                description=" Basic details of the discount"
              >
                <p className="mt-5">
                  {isFixed && "$"} {discount.value}{" "}
                  {isPercentage ? "% off" : isFixed ? "off" : "Free Shipping"}
                  {/* {discount.allocation === "ITEM"
                        ? " on select items"
                        : " on total order"} */}
                </p>
                <ul className="mt-5">
                  <li>Start Date: {discount.startDate.toDateString()}</li>
                  <li>
                    End Date:{" "}
                    {discount.endDate?.toDateString() ?? "No end date provided"}
                  </li>
                  <li>Discount Type: {discount.type}</li>
                  <li>Discount Amount: {discount.value}</li>
                  <li>Discount Code: {discount.code}</li>
                  <li>Discount Active: {discount.active ? "True" : "False"}</li>
                  <li>
                    Discount Code Required:{" "}
                    {/* {discount.isCodeRequired ? "True" : "False"} */}
                  </li>
                </ul>
              </ViewSection>
            </AdminFormBody>
          </>
        )}
        {!isLoading && !discount && <div>Discount post not found</div>}
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

export default DiscountPage;
