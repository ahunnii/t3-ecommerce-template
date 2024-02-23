import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { GalleryForm } from "~/modules/gallery/admin/gallery-form";

import AdminLayout from "~/components/layouts/admin-layout";
import { authenticateAdminOrOwner } from "~/utils/auth";

const NewGalleryImagePage: FC = () => {
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
  return await authenticateAdminOrOwner(ctx);
}

export default NewGalleryImagePage;
