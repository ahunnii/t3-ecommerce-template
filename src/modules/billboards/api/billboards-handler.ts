import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { type NextApiRequest, type NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

const billboardsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ message: "Method not allowed" });
  }

  // Create context and caller
  const ctx = await createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);

  const { storeId } = req.query;

  try {
    if (!storeId)
      return res.status(400).json({ message: "Store id is required" });

    const getAllBillboards = await caller.billboards.getAllBillboards({
      storeId: storeId as string,
    });
    return res.status(200).json(getAllBillboards);
  } catch (cause) {
    if (cause instanceof TRPCError) {
      // An error from tRPC occurred
      const httpCode = getHTTPStatusCodeFromError(cause);
      return res.status(httpCode).json(cause);
    }
    // Another error occurred
    console.error(cause);
    res.status(500).json({ message: "Internal server error", cause });
  }
};

export default billboardsHandler;
