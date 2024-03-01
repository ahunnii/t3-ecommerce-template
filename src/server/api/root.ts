import { billboardsRouter } from "~/server/api/routers/billboards";
import { categoriesRouter } from "~/server/api/routers/categories";
import { collectionsRouter } from "~/server/api/routers/collections";

import { ordersRouter } from "~/server/api/routers/orders";
import { storeRouter } from "~/server/api/routers/stores";
import { createTRPCRouter } from "~/server/api/trpc";
import { shippingLabelRouter } from "../../modules/shipping/api/shipping-router.trpc";

import { blogPostRouter } from "./routers/blog-posts";

import { productsRouter } from "~/modules/products/api/product-router.trpc";
import { galleryRouter } from "./routers/gallery";

import { customRouter } from "~/modules/custom-orders/api/custom-order-router.trpc";
import { discountRouter } from "~/modules/discounts/api/discount-router.trpc";
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

  // Add your routers here
  customOrder: customRouter,
  discounts: discountRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
