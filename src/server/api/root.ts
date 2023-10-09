import { billboardsRouter } from "~/server/api/routers/billboards";
import { categoriesRouter } from "~/server/api/routers/categories";
import { collectionsRouter } from "~/server/api/routers/collections";
import { colorsRouter } from "~/server/api/routers/colors";
import { exampleRouter } from "~/server/api/routers/example";
import { ordersRouter } from "~/server/api/routers/orders";
import { sizesRouter } from "~/server/api/routers/sizes";
import { storeRouter } from "~/server/api/routers/stores";
import { createTRPCRouter } from "~/server/api/trpc";
import { productsRouter } from "./routers/products";
import { userRouter } from "./routers/users";

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
  collections: collectionsRouter,
  billboards: billboardsRouter,
  orders: ordersRouter,
  products: productsRouter,
  users: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
