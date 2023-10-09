import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { type NextApiRequest, type NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

const productsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Create context and caller
  const ctx = await createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);

  const userId = ctx.session?.user.id;
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
        if (!storeId)
          return res.status(400).json({ message: "Store id is required" });

        const categoryId = req.query.categoryId;
        const colorId = req.query.colorId;
        const sizeId = req.query.sizeId;
        const isFeatured = req.query.isFeatured;
        const collectionId = req.query.collectionId;

        const allProducts = await ctx.prisma.product.findMany({
          where: {
            storeId: storeId as string,
            categoryId: categoryId ? (categoryId as string) : undefined,
            collections: {
              some: {
                id: collectionId ? (collectionId as string) : undefined,
              },
            },
            colorId: colorId ? (colorId as string) : undefined,
            sizeId: sizeId ? (sizeId as string) : undefined,
            isFeatured: isFeatured ? isFeatured === "true" : undefined,
            isArchived: false,
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
          orderBy: {
            createdAt: "desc",
          },
        });

        // const getAllProducts = await caller.products.getAllProducts({
        //   storeId: storeId as string,
        // });
        return res.status(200).json(allProducts);

      case "POST":
        if (!userId)
          return res.status(403).json({ message: "Unauthenticated" });
        if (!req.body.name)
          return res.status(400).json({ message: "Name is required" });

        if (!req.body.images ?? !req.body.images.length)
          return res.status(400).json({ message: "Images are required" });
        if (!req.body.price)
          return res.status(400).json({ message: "price is required" });
        if (!req.body.categoryId)
          return res.status(400).json({ message: "Category Id is required" });
        if (!req.body.colorId)
          return res.status(400).json({ message: "color Id is required" });
        if (!req.body.sizeId)
          return res.status(400).json({ message: "size Id is required" });
        if (!storeByUserId)
          return res.status(405).json({ message: "Unauthorized" });
        const createProduct = await caller.products.createProduct({
          name: req.body.name,
          price: req.body.price,
          categoryId: req.body.categoryId,
          colorId: req.body.colorId,
          sizeId: req.body.sizeId,
          images: req.body.images,
          isFeatured: req.body.isFeatured,
          isArchived: req.body.isArchived,
          storeId: storeId as string,
        });
        return res.status(200).json(createProduct);

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

export default productsHandler;
