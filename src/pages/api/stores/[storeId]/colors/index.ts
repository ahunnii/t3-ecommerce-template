import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { type NextApiRequest, type NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

const colorsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Create context and caller
  const ctx = await createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);
  if (req.method === "GET") {
    try {
      const { storeId } = req.query;
      const user = await caller.colors.getAllColors({
        storeId: storeId as string,
      });
      res.status(200).json(user);
    } catch (cause) {
      if (cause instanceof TRPCError) {
        // An error from tRPC occured
        const httpCode = getHTTPStatusCodeFromError(cause);
        return res.status(httpCode).json(cause);
      }
      // Another error occured
      console.error(cause);
      res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === "POST") {
    try {
      const { storeId } = req.query;
      const createColor = await caller.colors.createColor({
        storeId: storeId as string,
        name: req.body.name,
        value: req.body.value,
      });
      res.status(200).json(createColor);
    } catch (cause) {
      if (cause instanceof TRPCError) {
        // An error from tRPC occured
        const httpCode = getHTTPStatusCodeFromError(cause);
        return res.status(httpCode).json(cause);
      }
      // Another error occured
      console.error(cause);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default colorsHandler;
