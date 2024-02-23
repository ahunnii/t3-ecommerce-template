import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import AdminLayout from "~/components/layouts/admin-layout";

import { api } from "~/utils/api";

import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";
import { GalleryImageClient } from "~/modules/gallery/admin/client";
import { authenticateAdminOrOwner } from "~/utils/auth";

interface IProps {
  storeId: string;
}
const GalleryImagesPage: FC<IProps> = ({ storeId }) => {
  const { data: galleryImages, isLoading } =
    api.gallery.getAllGalleryImages.useQuery({
      storeId,
    });

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}
      {!isLoading && (
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <GalleryImageClient data={galleryImages ?? []} />
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default GalleryImagesPage;
