import parse from "html-react-parser";
import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { AdminFormBody } from "~/components/common/admin/admin-form-body";
import { AdminFormHeader } from "~/components/common/admin/admin-form-header";

import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import { ViewSection } from "~/components/common/sections/view-section.admin";
import AdminLayout from "~/components/layouts/admin-layout";
import { Button } from "~/components/ui/button";
import { cn } from "~/utils/styles";

interface IProps {
  galleryId: string;
  storeId: string;
}
const GalleryImagePage: FC<IProps> = ({ galleryId, storeId }) => {
  const { data: galleryImage, isLoading } =
    api.gallery.getGalleryImage.useQuery({
      id: galleryId,
    });

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}
      {!isLoading && galleryImage && (
        <>
          <AdminFormHeader
            title={"Gallery Image"}
            description={"View details about the image at a glance"}
            contentName="Gallery"
            link={`/admin/${storeId}/gallery`}
          >
            <Link href={`/admin/${storeId}/gallery/${galleryImage?.id}/edit`}>
              <Button className="flex gap-2" size={"sm"}>
                <Pencil className="h-5 w-5" /> Edit...
              </Button>
            </Link>
          </AdminFormHeader>

          <AdminFormBody className="flex-col">
            <Image
              src={galleryImage?.url}
              alt={galleryImage?.title ?? "gallery item"}
              width={500}
              height={500}
              sizes="(max-width: 500px) 100vw, 500px"
            />

            <ViewSection title="Metadata" description="Helps with SEO ">
              <div className={cn("leading-7 [&:not(:first-child)]:mt-6", "")}>
                {parse(
                  galleryImage?.caption === "" || galleryImage?.caption === null
                    ? "No caption provided."
                    : galleryImage.caption
                )}
              </div>
            </ViewSection>
          </AdminFormBody>
        </>
      )}
      {!isLoading && !galleryImage && (
        <DataFetchErrorMessage message="There seems to be an issue with loading the image." />
      )}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx, (ctx) => {
    return {
      props: {
        galleryId: ctx.query.galleryId,
        storeId: ctx.query.storeId,
      },
    };
  });
}

export default GalleryImagePage;
