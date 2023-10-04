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
  const {
    name,
    price,
    categoryId,
    images,
    colorId,
    sizeId,
    isFeatured,
    isArchived,
  } = req.body;

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
            color: true,
            size: true,
            variants: true,
          },
        });
        return res.status(200).json(getProduct);
      case "PATCH":
        if (!userId)
          return res.status(403).json({ message: "Unauthenticated" });
        if (!name) return res.status(400).json({ message: "Name is required" });
        if (!productId)
          return res.status(400).json({ message: "Product id is required" });
        if (!images ?? !images.length)
          return res.status(400).json({ message: "Images are required" });
        if (!price)
          return res.status(400).json({ message: "price is required" });
        if (!categoryId)
          return res.status(400).json({ message: "Category Id is required" });
        if (!colorId)
          return res.status(400).json({ message: "color Id is required" });
        if (!sizeId)
          return res.status(400).json({ message: "size Id is required" });
        if (!storeByUserId)
          return res.status(405).json({ message: "Unauthorized" });

        const updateProduct = await caller.products.updateProduct({
          name,
          price,
          categoryId,
          colorId,
          sizeId,
          images,
          isFeatured,
          isArchived,
          productId: productId as string,
          storeId: storeId as string,
        });
        return res.status(200).json(updateProduct);
      case "DELETE":
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

export default productByIdHandler;
