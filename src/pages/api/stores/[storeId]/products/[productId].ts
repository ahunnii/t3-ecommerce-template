import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { type NextApiRequest, type NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

const productByIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // Create context and caller
  const ctx = await createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);

  const userId = ctx.session?.user.id;
  const { productId } = req.query;
  const { storeId } = req.query;

  const storeByUserId = await ctx.prisma.store.findFirst({
    where: {
      id: storeId as string,
      userId,
    },
  });

  try {
    switch (req.method) {
      case "GET":
        if (!productId)
          return res.status(400).json({ message: "Category id is required" });

        const getProduct = await ctx.prisma.product.findUnique({
          where: {
            id: productId as string,
          },
          include: {
            images: true,
            category: {
              include: {
                attributes: true,
              },
            },

     
            variants: true,
          },
        });
        return res.status(200).json(getProduct);

        if (!userId)
          return res.status(403).json({ message: "Unauthenticated" });
        if (!productId)
          return res.status(400).json({ message: "productId  is required" });
        if (!storeByUserId)
          return res.status(405).json({ message: "Unauthorized" });

        const deleteProduct = await caller.products.deleteProduct({
          productId: productId as string,
          storeId: storeId as string,
        });
        return res.status(200).json(deleteProduct);
      default:
        res.setHeader("Allow", "GET");
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

export default productByIdHandler;
