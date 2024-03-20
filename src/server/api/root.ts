import { billboardsRouter } from "~/modules/billboards/api/billboards-router.trpc";
import { categoriesRouter } from "~/modules/categories/api/categories-router.trpc";
import { collectionsRouter } from "~/modules/collections/api/collections-router.trpc";

import { ordersRouter } from "~/modules/orders/api/orders-router.trpc";
import { shippingLabelRouter } from "~/modules/shipping/api/shipping-router.trpc";
import { storeRouter } from "~/server/api/routers/stores";
import { createTRPCRouter } from "~/server/api/trpc";

import { blogPostRouter } from "~/modules/blog-posts/api/blog-posts-router.trpc";

import { galleryRouter } from "~/modules/gallery/api/gallery-router.trpc";
import { productsRouter } from "~/modules/products/api/product-router.trpc";

import { customRouter } from "~/modules/custom-orders/api/custom-order-router.trpc";
import { discountRouter } from "~/modules/discounts/api/discount-router.trpc";
import { emailServiceRouter } from "~/services/email/api/email-service-router.trpc";
import { cloudinaryRouter } from "~/services/image-upload/api/cloudinary-router.trpc";
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
  mediaUpload: cloudinaryRouter,
  emailService: emailServiceRouter,

  // Add your routers here
  customOrder: customRouter,
  discounts: discountRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
