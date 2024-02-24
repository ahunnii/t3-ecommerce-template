import { billboardsRouter } from "~/server/api/routers/billboards";
import { categoriesRouter } from "~/server/api/routers/categories";
import { collectionsRouter } from "~/server/api/routers/collections";

import { ordersRouter } from "~/server/api/routers/orders";
import { storeRouter } from "~/server/api/routers/stores";
import { createTRPCRouter } from "~/server/api/trpc";
import { shippingLabelRouter } from "./routers/admin/shipping-labels";

import { blogPostRouter } from "./routers/blog-posts";
import { emailRouter } from "./routers/core/emails";
import { galleryRouter } from "./routers/gallery";
import { productsRouter } from "./routers/products";

import { userRouter } from "./routers/users";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  store: storeRouter,
  blogPosts: blogPostRouter,
  gallery: galleryRouter,
  categories: categoriesRouter,
  collections: collectionsRouter,
  billboards: billboardsRouter,
  orders: ordersRouter,
  products: productsRouter,
  users: userRouter,

  shippingLabels: shippingLabelRouter,
  email: emailRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
