import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { type NextApiRequest, type NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

const categoryByIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // Create context and caller
  const ctx = await createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);

  const { categoryId } = req.query;

  try {
    switch (req.method) {
      case "GET":
        if (!categoryId)
          return res.status(400).json({ message: "Category id is required" });

        const getCategory = await caller.categories.getCategory({
          categoryId: categoryId as string,
        });
        return res.status(200).json(getCategory);

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

export default categoryByIdHandler;
