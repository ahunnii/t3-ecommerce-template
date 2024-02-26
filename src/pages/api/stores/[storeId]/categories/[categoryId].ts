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
  const { categoryId } = req.query;
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
        if (!categoryId)
          return res.status(400).json({ message: "Category id is required" });

        const getCategory = await caller.categories.getCategory({
          categoryId: categoryId as string,
        });
        return res.status(200).json(getCategory);
      // case "PATCH":
      //   if (!userId)
      //     return res.status(403).json({ message: "Unauthenticated" });
      //   if (!name) return res.status(400).json({ message: "Name is required" });
      //   if (!billboardId)
      //     return res.status(400).json({ message: "Billboard id is required" });
      //   if (!categoryId)
      //     return res.status(400).json({ message: "Category Id is required" });
      //   if (!storeByUserId)
      //     return res.status(405).json({ message: "Unauthorized" });

      //   const updateCategory = await caller.categories.updateCategory({
      //     categoryId: categoryId as string,
      //     storeId: storeId as string,
      //     billboardId: billboardId as string,
      //     name: req.body.name,
      //   });
      //   return res.status(200).json(updateCategory);
      case "DELETE":
        if (!userId)
          return res.status(403).json({ message: "Unauthenticated" });
        if (!categoryId)
          return res.status(400).json({ message: "Category Id is required" });
        if (!storeByUserId)
          return res.status(405).json({ message: "Unauthorized" });

        const deleteCategory = await caller.categories.deleteCategory({
          categoryId: categoryId as string,
        });
        return res.status(200).json(deleteCategory);
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
