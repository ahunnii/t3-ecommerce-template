import type { GetServerSidePropsContext } from "next";
import { type FC } from "react";

import AdminLayout from "~/components/layouts/admin-layout";

import { api } from "~/utils/api";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { GalleryImageClient } from "~/modules/gallery/components/admin/client";
import { authenticateAdminOrOwner } from "~/utils/auth";

interface IProps {
  storeId: string;
}
const MediaUploadAdminPage: FC<IProps> = ({ storeId }) => {
  const { data: galleryImages, isLoading } =
    api.gallery.getGalleryImages.useQuery({
      storeId,
    });

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}
      {!isLoading && <GalleryImageClient data={galleryImages ?? []} />}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default MediaUploadAdminPage;
