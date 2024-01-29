import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { GalleryForm } from "~/modules/gallery/admin/gallery-form";

import { authenticateSession } from "~/utils/auth";

import AdminLayout from "~/components/layouts/AdminLayout";

interface IProps {
  storeId: string;
}
const NewGalleryImagePage: FC<IProps> = ({ storeId }) => {
  return (
    <AdminLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <GalleryForm initialData={null} />
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

export default NewGalleryImagePage;
