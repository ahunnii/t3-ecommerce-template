import { CustomOrderStatus, CustomOrderType } from "@prisma/client";
import * as z from "zod";

export const customRequestFormSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  type: z.nativeEnum(CustomOrderType),
  description: z.string(),
  images: z.object({ url: z.string() }).array(),
});

export const customOrderAdminFormSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  description: z.string(),
  productDescription: z.string(),
  notes: z.string().optional(),
  images: z.object({ url: z.string() }).array(),
  status: z.nativeEnum(CustomOrderStatus),
  type: z.nativeEnum(CustomOrderType),
  price: z.coerce.number().min(0),
});
