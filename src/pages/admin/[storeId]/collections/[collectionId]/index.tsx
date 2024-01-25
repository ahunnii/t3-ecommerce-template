import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import PageLoader from "~/components/ui/page-loader";
import { CollectionForm } from "~/modules/collections/collection-form";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

import Image from "next/image";
import Link from "next/link";
import { BackToButton } from "~/components/common/buttons/back-to-button";
import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";
import Currency from "~/components/core/ui/currency";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { ScrollArea } from "~/components/ui/scroll-area";
import AdminLayout from "~/layouts/AdminLayout";
import { CollectionCard } from "~/modules/categories/core/collection-card";

interface IProps {
  collectionId: string;
  storeId: string;
}
const CollectionPage: FC<IProps> = ({ collectionId, storeId }) => {
  const { data: collection, isLoading: isCollectionLoading } =
    api.collections.getCollection.useQuery({
      collectionId,
    });

  const { data: products, isLoading: areProductsLoading } =
    api.products.getAllProducts.useQuery({
      storeId,
    });
  const { data: billboards, isLoading: areBillboardsLoading } =
    api.billboards.getAllBillboards.useQuery({
      storeId,
    });
  const editCollectionURL = `/admin/${storeId}/collections/${collection?.id}/edit`;
  return (
    <AdminLayout>
      {isCollectionLoading ?? <AbsolutePageLoader />}
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {!isCollectionLoading &&
            collection &&
            !areProductsLoading &&
            !areBillboardsLoading && (
              <>
                <BackToButton
                  link={`/admin/${storeId}/collections`}
                  title="Back to Collections"
                />
                <div className="flex w-full items-center justify-between">
                  <Heading
                    title={collection.name}
                    description={"No description added"}
                  />
                  <Link href={editCollectionURL}>
                    <Button> Edit Collection</Button>
                  </Link>
                </div>
                <div className="flex gap-4">
                  <div className="w-full rounded-md border border-border bg-background/50 p-4">
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                      Preview
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      This is what is shown to customers on the &quot;All
                      Collections&quot; page.
                    </p>

                    <div className="grid grid-cols-2 py-8">
                      {collection && <CollectionCard collection={collection} />}
                    </div>
                  </div>
                  <div className="w-full rounded-md border border-border bg-background/50 p-4">
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                      Products
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      List of products associated with this collection:
                    </p>

                    <ScrollArea className="relative my-8 h-96 border border-slate-100 p-2 shadow-inner">
                      <div className="flex flex-col space-y-4 ">
                        {collection?.products.map((product) => (
                          <div
                            className="flex items-center p-4 odd:bg-slate-200 even:bg-slate-50"
                            key={product.id}
                          >
                            <div className="h-10 w-10 flex-shrink-0">
                              <Image
                                className="h-10 w-10 rounded-md object-cover"
                                src={
                                  product.featuredImage ??
                                  "/placeholder-image.webp"
                                }
                                alt={product.name}
                                height={40}
                                width={40}
                              />
                            </div>
                            <div className="ml-4">
                              <Link
                                href={`/admin/${product.storeId}/products/${product.id}`}
                                className="text-sm font-medium text-gray-900"
                              >
                                <Button variant={"link"} className="mx-0 px-0">
                                  {product.name}
                                </Button>
                              </Link>
                              <div className="text-sm text-gray-500">
                                <Currency value={product.price} />
                              </div>
                            </div>
                          </div>
                        ))}{" "}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </>
            )}
        </div>
      </div>
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const store = await authenticateSession(ctx);

  if (!store) {
    return {
      redirect: {
        destination: `/admin`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      collectionId: ctx.query.collectionId,
      storeId: ctx.query.storeId,
    },
  };
}

export default CollectionPage;
