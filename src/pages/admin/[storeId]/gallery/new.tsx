import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";

import { GalleryForm } from "~/modules/gallery/components/admin/gallery-form";

import AdminLayout from "~/components/layouts/admin-layout";
import { authenticateAdminOrOwner } from "~/utils/auth";

const NewGalleryImagePage: FC = () => {
  return (
    <AdminLayout>
      <GalleryForm initialData={null} />
    </AdminLayout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await authenticateAdminOrOwner(ctx);
}

export default NewGalleryImagePage;
