import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import AdminLayout from "~/components/layouts/admin-layout";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/utils/api";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { Button } from "~/components/ui/button";

import { uniqueId } from "lodash";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";
import { GalleryImageClient } from "~/modules/gallery/components/admin/client";
import { authenticateAdminOrOwner } from "~/utils/auth";

interface IProps {
  storeId: string;
}
const MediaUploadAdminPage: FC<IProps> = ({ storeId }) => {
  const services = [
    {
      name: "Media Uploads",
      description: "How you upload media to your site",
      homepage: "https://console.cloudinary.com/pm/",
      dashboard: `/admin/${storeId}/services/media-uploads`,
      disabled: false,
    },
    // {
    //   name: "Payment Gateway",
    //   description: "How you accept payments on your site (COMING SOON)",
    //   homepage: "https://dashboard.stripe.com/dashboard",
    //   disabled: true,
    // },
    // {
    //   name: "Shipping Labels",
    //   description: "How you ship your products to customers (COMING SOON)",
    //   homepage: "https://apps.goshippo.com/shipments",
    //   disabled: true,
    // },
    // {
    //   name: "Infrastructure",
    //   description: "How your site is hosted and managed (COMING SOON)",
    //   homepage: "https://railway.app/dashboard",
    //   disabled: true,
    // },
    // {
    //   name: "Authentication",
    //   description: "How users log in and sign up (COMING SOON)",
    //   disabled: true,
    // },
    // {
    //   name: "Logging",
    //   description:
    //     "How you track and monitor your site's activity (COMING SOON)",
    //   disabled: true,
    // },
  ] as const;
  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-4 p-8">
        <div className="flex items-center justify-between">
          <Heading
            title={`Site Services`}
            description="Manage the services used on your site"
          />
        </div>
        <Separator />{" "}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {services.map((service) => (
            <Card className="w-full" key={uniqueId()}>
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent></CardContent>
              <CardFooter className="mt-auto flex justify-end gap-2">
                <Link href={service.homepage} target="_blank">
                  <Button variant="outline">
                    <ExternalLink />
                  </Button>
                </Link>{" "}
                <Link href={service.dashboard}>
                  <Button>Dashboard</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default MediaUploadAdminPage;
