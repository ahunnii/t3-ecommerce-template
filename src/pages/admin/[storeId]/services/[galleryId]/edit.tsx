import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { api } from "~/utils/api";
import { authenticateAdminOrOwner } from "~/utils/auth";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { DataFetchErrorMessage } from "~/components/common/data-fetch-error-message";
import AdminLayout from "~/components/layouts/admin-layout";
import { GalleryForm } from "~/modules/gallery/components/admin/gallery-form";

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
      {!isLoading && galleryImage && <GalleryForm initialData={galleryImage} />}
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
      },
    };
  });
}

export default EditGalleryImagePage;
