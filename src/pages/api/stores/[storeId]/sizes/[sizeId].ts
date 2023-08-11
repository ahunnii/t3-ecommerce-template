import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { type NextApiRequest, type NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

const sizeByIdHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Create context and caller
  const ctx = await createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);

  const userId = ctx.session?.user.id;
  const { sizeId } = req.query;
  const { storeId } = req.query;
  const { name, value } = req.body;

  const storeByUserId = await ctx.prisma.store.findFirst({
    where: {
      id: storeId as string,
      userId,
    },
  });

  try {
    switch (req.method) {
      case "GET":
        if (!sizeId)
          return res.status(400).json({ message: "sizeId is required" });

        const getSize = await caller.sizes.getSize({
          sizeId: sizeId as string,
        });
        return res.status(200).json(getSize);
      case "PATCH":
        if (!userId)
          return res.status(403).json({ message: "Unauthenticated" });
        if (!name) return res.status(400).json({ message: "Name is required" });
        if (!value)
          return res.status(400).json({ message: "Value is required" });
        if (!sizeId)
          return res.status(400).json({ message: "sizeId is required" });
        if (!storeByUserId)
          return res.status(405).json({ message: "Unauthorized" });

        const updateSize = await caller.sizes.updateSize({
          sizeId: sizeId as string,
          storeId: storeId as string,
          name: req.body.name,
          value: req.body.value,
        });
        return res.status(200).json(updateSize);
      case "DELETE":
        if (!userId)
          return res.status(403).json({ message: "Unauthenticated" });
        if (!sizeId)
          return res.status(400).json({ message: "size Id is required" });
        if (!storeByUserId)
          return res.status(405).json({ message: "Unauthorized" });

        const deleteSize = await caller.sizes.deleteSize({
          sizeId: sizeId as string,
          storeId: storeId as string,
        });
        return res.status(200).json(deleteSize);
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

export default sizeByIdHandler;
