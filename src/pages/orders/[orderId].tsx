import parse from "html-react-parser";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { ViewSection } from "~/components/common/sections/view-section.admin";

import StorefrontLayout from "~/components/layouts/storefront-layout";
import { Button } from "~/components/ui/button";
import { useConfig } from "~/providers/style-config-provider";

import { api } from "~/utils/api";
import { cn } from "~/utils/styles";

import { Prisma } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import Currency from "~/components/common/currency";
import { OrderViewItem } from "~/modules/cart/components/order-item.wip";
import { createTRPCContext } from "~/server/api/trpc";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";
import paymentService from "~/services/payment";

const metadata = {
  title: "Thank You! | Trend Anomaly",
  description: "Break out the System",
};
type Order = Prisma.OrderGetPayload<{
  include: {
    address: true;
    orderItems: {
      include: {
        product: {
          include: {
            images: true;
          };
        };
        variant: true;
        discount: true;
      };
    };
    shippingLabel: true;
  };
}>;

const OrderPage = ({ order, payment }: { order: Order; payment: unknown }) => {
  const params = useParams();

  const config = useConfig();

  console.log(payment);

  return (
    <StorefrontLayout {...config.layout} metadata={metadata}>
      {/* {<AbsolutePageLoader />} */}

      {order && (
        <div className="space-y-10 py-10">
          <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <h1 className="text-2xl">Order #{params?.orderId} </h1>

              {!order?.userId && (
                <>
                  <h2>Login to view all order details </h2>
                  <p>
                    You can find your order number in the receipt you received
                    via email.
                  </p>
                </>
              )}

              <div className="flex">
                <div className="flex flex-col">
                  <ViewSection title="Shipping" className="bg-fuchsia-50">
                    {order?.whenShipped && (
                      <>
                        <p>
                          {order?.userId ? (
                            <>
                              Your order was shipped out on{" "}
                              <span className="font-bold">
                                {" "}
                                {new Date(
                                  order?.whenShipped
                                ).toDateString()}.{" "}
                              </span>
                            </>
                          ) : (
                            <>
                              Your order has been shipped out to the address you
                              provided.
                            </>
                          )}
                          If you haven&apos;t received it, or if you have any
                          other problems, contact us.
                        </p>
                      </>
                    )}
                  </ViewSection>

                  <ViewSection title="Details" className="bg-fuchsia-50">
                    <p className="font-semibold">Shipping Address</p>
                    {order?.address && (
                      <p>
                        {order?.name}
                        <br />
                        {order?.address?.street}
                        <br />
                        {order?.address?.additional && (
                          <>
                            {order?.address?.additional} <br />
                          </>
                        )}
                        {order?.address?.city}, {order?.address?.state}{" "}
                        {order?.address?.postal_code} {order?.address?.country}
                      </p>
                    )}
                  </ViewSection>
                </div>
                <div className="flex flex-wrap gap-2 px-4 sm:px-6 lg:px-8">
                  <ul>
                    {order.orderItems!.map((item) => (
                      <OrderViewItem
                        key={item.product.id + item?.variant?.id}
                        data={item}
                      />
                    ))}
                  </ul>

                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <div
                        className={cn("text-base font-medium text-gray-500")}
                      >
                        Subtotal
                      </div>
                      <Currency
                        value={order?.subtotal / 100}
                        className={cn()}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div
                        className={cn("text-base font-medium text-gray-500")}
                      >
                        Total
                      </div>
                      <Currency value={order?.total / 100} className={cn()} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!order && (
        <div className="space-y-10 py-10">
          <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold">Order Not Found</h3>
              <p>
                The order you are looking for does not exist. Please try again.
              </p>
            </div>
          </div>
        </div>
      )}
    </StorefrontLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(ctx);

  const order = await prisma.order.findUnique({
    where: {
      id: ctx.params?.orderId as string,
    },
    include: {
      address: true,
      orderItems: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
          variant: true,
          discount: true,
        },
      },
      shippingLabel: true,
    },
  });

  if (!order) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  if (!session || !session.user) {
    return {
      props: {
        order: JSON.parse(
          JSON.stringify(
            exclude(order, [
              "shippingLabel",
              "name",
              "email",
              "phone",
              "address",
              "refundId",
              "userId",
            ])
          )
        ),
        payment: null,
      },
    };
  }

  const { id, role } = session.user;

  if (order.userId !== id && role !== "ADMIN") {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  return {
    props: {
      order: JSON.parse(
        JSON.stringify(exclude(order, ["createdAt", "updatedAt"]))
      ),
      payment: null,
    },
  };
};

function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[]
): Omit<User, Key> {
  return Object.fromEntries(
    Object.entries(user as Record<string, unknown>).filter(
      ([key]: [string, unknown]) => !keys.includes(key as Key)
    )
  ) as Omit<User, Key>;
}

export default OrderPage;
