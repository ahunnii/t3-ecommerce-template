import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { type NextApiRequest, type NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

const billboardByIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // Create context and caller
  const ctx = await createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);

  const userId = ctx.session?.user.id;
  const { billboardId } = req.query;
  const { storeId } = req.query;
  const { label, imageUrl } = req.body;

  const storeByUserId = await ctx.prisma.store.findFirst({
    where: {
      id: storeId as string,
      userId,
    },
  });

  try {
    switch (req.method) {
      case "GET":
        if (!billboardId)
          return res.status(400).json({ message: "Category id is required" });

        const getBillboard = await caller.billboards.getBillboard({
          billboardId: billboardId as string,
        });
        return res.status(200).json(getBillboard);
      case "PATCH":
        if (!userId)
          return res.status(403).json({ message: "Unauthenticated" });
        if (!label)
          return res.status(400).json({ message: "Label is required" });
        if (!billboardId)
          return res.status(400).json({ message: "Billboard id is required" });
        if (!imageUrl)
          return res.status(400).json({ message: "Image URL is required" });
        if (!storeByUserId)
          return res.status(405).json({ message: "Unauthorized" });

        const updateBillboard = await caller.billboards.updateBillboard({
          imageUrl,
          storeId: storeId as string,
          billboardId: billboardId as string,
          label,
        });
        return res.status(200).json(updateBillboard);
      case "DELETE":
        if (!userId)
          return res.status(403).json({ message: "Unauthenticated" });
        if (!billboardId)
          return res.status(400).json({ message: "Billboard Id is required" });
        if (!storeByUserId)
          return res.status(405).json({ message: "Unauthorized" });

        const deleteBillboard = await caller.billboards.deleteBillboard({
          billboardId: billboardId as string,
          storeId: storeId as string,
        });
        return res.status(200).json(deleteBillboard);
      default:
        res.setHeader("Allow", "GET, POST");
        return res.status(405).end("Method Not Allowed");
    }
  } catch (cause) {
    if (cause instanceof TRPCError) {
      const httpCode = getHTTPStatusCodeFromError(cause);
      return res.status(httpCode).json(cause);
    }

    console.error(cause);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default billboardByIdHandler;
