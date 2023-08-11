import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { type NextApiRequest, type NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

const billboardsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Create context and caller
  const ctx = await createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);

  const userId = ctx.session?.user.id;
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
        if (!storeId)
          return res.status(400).json({ message: "Store id is required" });

        const getAllBillboards = await caller.billboards.getAllBillboards({
          storeId: storeId as string,
        });
        return res.status(200).json(getAllBillboards);

      case "POST":
        if (!userId)
          return res.status(403).json({ message: "Unauthenticated" });
        if (!label)
          return res.status(400).json({ message: "Label is required" });
        if (!imageUrl)
          return res.status(400).json({ message: "imageUrl is required" });
        if (!storeByUserId)
          return res.status(405).json({ message: "Unauthorized" });

        const createBillboard = await caller.billboards.createBillboard({
          storeId: storeId as string,
          label,
          imageUrl,
        });
        return res.status(200).json(createBillboard);

      default:
        res.setHeader("Allow", "GET, POST");
        return res.status(405).end("Method Not Allowed");
    }
  } catch (cause) {
    if (cause instanceof TRPCError) {
      // An error from tRPC occurred
      const httpCode = getHTTPStatusCodeFromError(cause);
      return res.status(httpCode).json(cause);
    }
    // Another error occurred
    console.error(cause);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default billboardsHandler;
