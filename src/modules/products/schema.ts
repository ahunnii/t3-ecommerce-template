import { ProductType, ShippingType } from "@prisma/client";
import * as z from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  description: z.string(),
  quantity: z.coerce.number().min(1).default(1),
  variants: z.array(
    z.object({
      names: z.string().min(1),
      values: z.string().min(1),
      price: z.coerce.number().min(0),
      quantity: z.coerce.number().min(0),
      sku: z.string().optional(),
      imageUrl: z.string().optional(),
    })
  ),
  tags: z.array(z.object({ name: z.string(), id: z.string() })),
  materials: z.array(z.object({ name: z.string(), id: z.string() })),
  featuredImage: z.string().min(1),
  shippingCost: z.coerce.number().min(0).optional(),
  shippingType: z.nativeEnum(ShippingType),
  weight: z.coerce.number().min(0).optional(),
  length: z.coerce.number().min(0).optional(),
  width: z.coerce.number().min(0).optional(),
  height: z.coerce.number().min(0).optional(),
  estimatedCompletion: z.coerce.number().min(0).int(),
  productType: z.nativeEnum(ProductType),
  weight_oz: z.coerce.number().min(0).optional(),
  weight_lb: z.coerce.number().min(0).optional(),
});
