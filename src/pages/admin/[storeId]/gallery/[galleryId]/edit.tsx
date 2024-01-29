import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import PageLoader from "~/components/ui/page-loader";

import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

import AdminLayout from "~/components/layouts/AdminLayout";
import { GalleryForm } from "~/modules/gallery/admin/gallery-form";

interface IProps {
  galleryId: string;
  storeId: string;
}
const EditGalleryImagePage: FC<IProps> = ({ galleryId, storeId }) => {
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
            <GalleryForm initialData={galleryImage} />
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
      categoryId: ctx.query.galleryId,
      storeId: ctx.query.storeId,
    },
  };
}

export default EditGalleryImagePage;
