import { billboardsRouter } from "~/server/api/routers/billboards";
import { categoriesRouter } from "~/server/api/routers/categories";
import { colorsRouter } from "~/server/api/routers/colors";
import { exampleRouter } from "~/server/api/routers/example";
import { ordersRouter } from "~/server/api/routers/orders";
import { sizesRouter } from "~/server/api/routers/sizes";
import { storeRouter } from "~/server/api/routers/stores";
import { createTRPCRouter } from "~/server/api/trpc";
import { productsRouter } from "./routers/products";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  store: storeRouter,
  sizes: sizesRouter,
  colors: colorsRouter,
  categories: categoriesRouter,
  billboards: billboardsRouter,
  orders: ordersRouter,
  products: productsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
