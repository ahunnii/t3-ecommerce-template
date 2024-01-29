import parse from "html-react-parser";
import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";
import PageLoader from "~/components/ui/page-loader";
import { GalleryForm } from "~/modules/gallery/admin/gallery-form";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

import { Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AdminLayout from "~/components/layouts/AdminLayout";
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
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {isLoading && <PageLoader />}
          {!galleryImage && <div>Gallery image not found</div>}
          {!isLoading && galleryImage && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    {galleryImage?.title === ""
                      ? "Gallery Image"
                      : galleryImage?.title}
                  </h1>
                  <p>Uploaded: {galleryImage?.createdAt.toDateString()}</p>
                </div>
                <Link
                  href={`/admin/${storeId}/gallery/${galleryImage?.id}/edit`}
                >
                  <Button className="flex gap-2">
                    {" "}
                    <Pencil className="h-5 w-5" />
                    Edit...
                  </Button>
                </Link>
              </div>

              <Image
                src={galleryImage?.url}
                alt={galleryImage?.title ?? "gallery item"}
                width={500}
                height={500}
                sizes="(max-width: 500px) 100vw, 500px"
              />

              <div className="w-full rounded-md border border-border bg-background/50 p-4">
                <div className={cn("leading-7 [&:not(:first-child)]:mt-6", "")}>
                  {parse(
                    galleryImage?.caption === "" ||
                      galleryImage?.caption === null
                      ? "No caption provided."
                      : galleryImage.caption
                  )}
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
      galleryId: ctx.query.galleryId,
      storeId: ctx.query.storeId,
    },
  };
}

export default GalleryImagePage;
