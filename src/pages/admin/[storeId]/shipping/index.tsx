import { format } from "date-fns";
import { useCallback, useEffect, useState, type FC } from "react";

import type { Color } from "@prisma/client";
import type { GetServerSidePropsContext } from "next";
import type { ColorColumn } from "~/components/admin/colors/columns";
import { api } from "~/utils/api";
import { authenticateSession } from "~/utils/auth";

import { ColorClient } from "~/components/admin/colors/client";
import PageLoader from "~/components/ui/page-loader";
import AdminLayout from "~/layouts/AdminLayout";

interface IProps {
  storeId: string;
}

const ShippingPage: FC<IProps> = ({ storeId }) => {
  return (
    <AdminLayout>
      <h1>Shipping Test</h1>
    </AdminLayout>
  );
};

// export async function getServerSideProps(ctx: GetServerSidePropsContext) {
//   const store = await authenticateSession(ctx);

//   if (!store) {
//     return {
//       redirect: {
//         destination: `/admin`,
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       storeId: ctx.query.storeId,
//     },
//   };
// }

export default ShippingPage;
