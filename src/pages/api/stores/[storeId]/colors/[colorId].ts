import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { type NextApiRequest, type NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

const colorByIdHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Create context and caller
  const ctx = await createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);

  const userId = ctx.session?.user.id;
  const { colorId } = req.query;
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
        if (!colorId)
          return res.status(400).json({ message: "Color id is required" });

        const getColor = await caller.colors.getColor({
          colorId: colorId as string,
        });
        return res.status(200).json(getColor);
      case "PATCH":
        if (!userId)
          return res.status(403).json({ message: "Unauthenticated" });
        if (!name) return res.status(400).json({ message: "Name is required" });
        if (!value)
          return res.status(400).json({ message: "Value is required" });
        if (!colorId)
          return res.status(400).json({ message: "Color Id is required" });
        if (!storeByUserId)
          return res.status(405).json({ message: "Unauthorized" });

        const updateColor = await caller.colors.updateColor({
          colorId: colorId as string,
          storeId: storeId as string,
          name: req.body.name,
          value: req.body.value,
        });
        return res.status(200).json(updateColor);
      case "DELETE":
        if (!userId)
          return res.status(403).json({ message: "Unauthenticated" });
        if (!colorId)
          return res.status(400).json({ message: "Color Id is required" });
        if (!storeByUserId)
          return res.status(405).json({ message: "Unauthorized" });

        const deleteColor = await caller.colors.deleteColor({
          colorId: colorId as string,
          storeId: storeId as string,
        });
        return res.status(200).json(deleteColor);
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

export default colorByIdHandler;
