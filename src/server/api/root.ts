import { exampleRouter } from "~/server/api/routers/example";
import { sizesRouter } from "~/server/api/routers/sizes";
import { storeRouter } from "~/server/api/routers/stores";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  store: storeRouter,
  sizes: sizesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
