import type { GetServerSidePropsContext } from "next";
import { useEffect, type FC } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { CreditCard, DollarSign, Info, Package } from "lucide-react";
import { useRouter } from "next/router";
import { AdminFormHeader } from "~/components/common/admin/admin-form-header";
import AdminLayout from "~/components/layouts/admin-layout";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

const NewGalleryImagePage: FC = () => {
  const getUsage = api.mediaUpload.getUsage.useQuery({}, { enabled: false });
  const router = useRouter();
  const { storeId } = router.query as {
    storeId: string;
  };

  useEffect(() => {
    void getUsage.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminLayout>
      {/* <GalleryForm initialData={null} /> */}

      <AdminFormHeader
        title={"Cloudinary Media Uploads"}
        description={"Review and manage your media upload service here."}
        contentName="Services"
        link={`/admin/${storeId}/services`}
      ></AdminFormHeader>

      <section className="mx-auto w-full max-w-7xl space-y-4 p-8">
        <div className="grid  grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plan Usage</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {getUsage.data?.credits?.usage} /{" "}
                {getUsage.data?.credits?.limit}
              </div>
            </CardContent>{" "}
            <CardFooter className="text-xs text-muted-foreground">
              {getUsage.data?.credits?.limit - getUsage.data?.credits?.usage}{" "}
              credits remaining
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bandwidth</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {" "}
                {getUsage.data?.bandwidth?.credits_usage} credits
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {" "}
                {getUsage.data?.storage?.credits_usage} credits
              </div>
            </CardContent>{" "}
            <CardFooter className="text-xs text-muted-foreground">
              {getUsage.data?.credits?.limit - getUsage.data?.credits?.usage}{" "}
              credits remaining
            </CardFooter>
          </Card>{" "}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Transformations
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {" "}
                {getUsage.data?.transformations?.credits_usage} credits
              </div>
            </CardContent>
          </Card>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>What does this mean?</AlertTitle>
          <AlertDescription>
            So for Cloudinary, usage is based on &apos;Credits&apos;. You get 25
            credits per month while under the Free Tier. You need to stay within
            25k monthly transformations, 25 GB of storage total, and 25 GB of
            bandwidth per month.{" "}
          </AlertDescription>
        </Alert>
      </section>
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default NewGalleryImagePage;
