import type { GetServerSidePropsContext } from "next";
import type { FC } from "react";
import { ColorForm } from "~/components/admin/colors/color-form";
import AdminLayout from "~/layouts/AdminLayout";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const userId = session.user.id;

  const store = await prisma.store.findFirst({
    where: {
      id: ctx.query.storeId as string,
      userId,
    },
  });

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
      colorId: ctx.query.colorId,
    },
  };
}

interface IProps {
  colorId: string;
}
const ColorPage: FC<IProps> = ({ colorId }) => {
  const { data: color } = api.colors.getColor.useQuery({
    colorId,
  });
  return (
    <AdminLayout>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {color && <ColorForm initialData={color} />}
          {!color && <ColorForm initialData={null} />}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ColorPage;
