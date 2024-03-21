import { ProductStatus, ProductType } from "@prisma/client";
import * as z from "zod";

export const variantSchema = z.object({
  names: z.string().min(1),
  values: z.string().min(1),
  price: z.coerce.number().min(0),
  quantity: z.coerce.number().min(0),
  sku: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const imageSchema = z.object({ url: z.string() });

export const productFormSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  images: z.array(z.string()),
  price: z.coerce.number().min(0),
  categoryId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  status: z.nativeEnum(ProductStatus),
  type: z.nativeEnum(ProductType),
  description: z.string(),
  quantity: z.coerce.number().min(1).default(1),
  variants: z.array(variantSchema),
  tags: z.array(z.object({ name: z.string(), id: z.string() })),
  materials: z.array(z.object({ name: z.string(), id: z.string() })),
  featuredImage: z.string().min(1, {
    message: "You need at least a featured image",
  }),
  shippingCost: z.coerce.number().min(0).optional(),

  weight: z.coerce.number().min(0).optional(),
  length: z.coerce.number().min(0).optional(),
  width: z.coerce.number().min(0).optional(),
  height: z.coerce.number().min(0).optional(),
  estimatedCompletion: z.coerce.number().min(0).int(),

  weight_oz: z.coerce.number().min(0).optional(),
  weight_lb: z.coerce.number().min(0).optional(),
});
