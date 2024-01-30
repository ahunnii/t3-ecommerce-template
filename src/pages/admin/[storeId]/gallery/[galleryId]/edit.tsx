import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";
import AdminLayout from "~/components/layouts/admin-layout";
import { GalleryForm } from "~/modules/gallery/admin/gallery-form";

interface IProps {
  galleryId: string;
  storeId: string;
}
const EditGalleryImagePage: FC<IProps> = ({ galleryId }) => {
  const { data: galleryImage, isLoading } =
    api.gallery.getGalleryImage.useQuery({
      id: galleryId,
    });

  return (
    <AdminLayout>
      {isLoading && <AbsolutePageLoader />}
      {!isLoading && (
        <div className="flex-1 space-y-4 p-8 pt-6">
          {galleryImage && <GalleryForm initialData={galleryImage} />}
          {!galleryImage && (
            <DataFetchErrorMessage message="There seems to be an issue with loading the image." />
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { store, user, redirect } = await authenticateAdminOrOwner(ctx);

  if (!store || !user) return { redirect };

  return {
    props: {
      galleryId: ctx.query.galleryId,
    },
  };
}

export default EditGalleryImagePage;
