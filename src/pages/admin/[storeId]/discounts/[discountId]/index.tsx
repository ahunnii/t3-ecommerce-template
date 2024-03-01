import parse from "html-react-parser";
import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";
import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import AdminLayout from "~/components/layouts/admin-layout";
import PageLoader from "~/components/ui/page-loader";

import { Pencil } from "lucide-react";
import Link from "next/link";
import { BackToButton } from "~/components/common/buttons/back-to-button";
import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { ViewBlogImage } from "~/modules/blog-posts/admin/view-blog-images";
import { cn } from "~/utils/styles";

interface IProps {
  storeId: string;
  discountId: string;
}

const DiscountPage: FC<IProps> = ({ storeId, discountId }) => {
  const { data: discount, isLoading } = api.discounts.getDiscount.useQuery({
    discountId,
  });
  const editDiscountUrl = `/admin/${storeId}/discounts/${discount?.id}/edit`;

  const isPercentage = discount?.valueType === "PERCENTAGE";
  const isFixed = discount?.valueType === "FIXED";

  return (
    <>
      <AdminLayout>
        {isLoading && <AbsolutePageLoader />}

        {!isLoading && (
          <div className="flex-1 space-y-4 p-8 pt-6">
            {discount && (
              <>
                <BackToButton
                  link={`/admin/${storeId}/discounts`}
                  title="Back to Discounts"
                />
                <div className="flex w-full items-center justify-between">
                  <Heading
                    title={discount.code}
                    description={discount.description ?? "No description added"}
                  />
                  <Link href={editDiscountUrl}>
                    <Button className="flex gap-2" size={"sm"}>
                      <Pencil className="h-5 w-5" /> Edit Discount
                    </Button>
                  </Link>
                </div>

                <div className="flex gap-4">
                  <div className="w-full rounded-md border border-border bg-background/50 p-4">
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                      Details
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Basic details of the discount
                    </p>

                    <p>
                      {isFixed && "$"} {discount.value}{" "}
                      {isPercentage
                        ? "% off"
                        : isFixed
                        ? "off"
                        : "Free Shipping"}
                      {/* {discount.allocation === "ITEM"
                        ? " on select items"
                        : " on total order"} */}
                    </p>
                    <ul className="mt-5">
                      <li>Start Date: {discount.startDate.toDateString()}</li>
                      <li>
                        End Date:{" "}
                        {discount.endDate?.toDateString() ??
                          "No end date provided"}
                      </li>
                      <li>Discount Type: {discount.type}</li>
                      <li>Discount Amount: {discount.value}</li>
                      <li>Discount Code: {discount.code}</li>
                      <li>
                        Discount Active: {discount.active ? "True" : "False"}
                      </li>
                      <li>
                        Discount Code Required:{" "}
                        {/* {discount.isCodeRequired ? "True" : "False"} */}
                      </li>
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        {!discount && <div>Discount post not found</div>}
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
