import type { GetServerSidePropsContext } from "next";
import { useCallback, useEffect, useState, type FC } from "react";

import { format } from "date-fns";

import PageLoader from "~/components/ui/page-loader";

import AdminLayout from "~/components/layouts/AdminLayout";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

import type { GalleryImage } from "@prisma/client";
import { GalleryImageClient } from "~/modules/gallery/admin/client";
import type { GalleryImageColumn } from "~/modules/gallery/admin/columns";

interface IProps {
  storeId: string;
}
const GalleryImagesPage: FC<IProps> = ({ storeId }) => {
  const [formattedGalleryImage, setFormattedGalleryImage] = useState<
    GalleryImageColumn[]
  >([]);

  const { data: galleryImages, isLoading } =
    api.gallery.getAllGalleryImages.useQuery({
      storeId,
    });

  const formatGalleryImages = useCallback((images: GalleryImage[]) => {
    return images.map((item: GalleryImage) => ({
      id: item.id,
      title: item?.title === "" ? null : item.title,
      url: item.url,
      storeId: item.storeId,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }));
  }, []);

  useEffect(() => {
    if (galleryImages)
      setFormattedGalleryImage(
        formatGalleryImages(galleryImages) as GalleryImageColumn[]
      );
  }, [galleryImages, formatGalleryImages]);

  return (
    <AdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {isLoading ? (
            <PageLoader />
          ) : (
            <GalleryImageClient data={formattedGalleryImage} />
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
      storeId: ctx.query.storeId,
    },
  };
}

export default GalleryImagesPage;
