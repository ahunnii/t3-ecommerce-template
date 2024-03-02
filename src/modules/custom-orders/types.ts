import {
  CustomOrderStatus,
  CustomOrderType,
  type Prisma,
} from "@prisma/client";
import type { LucideIcon } from "lucide-react";
import * as z from "zod";

export type CustomProduct = "hat" | "shirt" | "hoodie";

export const customProductOptions = [
  { label: "Hat", value: "hat" },
  { label: "Shirt", value: "shirt" },
  { label: "Hoodie", value: "hoodie" },
] as const;

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

export type CustomOrderAdminFormValues = z.infer<
  typeof customOrderAdminFormSchema
>;
export type CustomRequestFormValues = z.infer<typeof customRequestFormSchema>;

export type SocialMedia = {
  Icon: LucideIcon;
  href: string;
  name: string;
};

export type CustomOrderColumn = {
  id: string;
  storeId: string;
  email: string;
  name: string;
  type: string;
  status: string;
  store: {
    name: string;
    address:
      | {
          street: string;
          additional: string | null;
          city: string;
          state: string;
          postal_code: string;
        }
      | null
      | undefined;
  };
  description: string;
  createdAt: Date;
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
  } | null;
};

export type CustomOrder = Prisma.CustomOrderRequestGetPayload<{
  include: { images: true; product: true };
}>;

export const invoiceSchema = z.object({
  customerName: z.string(),
  customerEmail: z.string().email(),
  invoiceNumber: z.string(),
  createdAt: z.string(),
  dueAt: z.string(),
  businessLogo: z.string(),
  businessName: z.string(),
  businessStreet: z.string(),
  businessCity: z.string(),
  businessState: z.string(),
  businessPostalCode: z.string(),
  product: z.string(),
  productCost: z.number().min(0),
  productTotal: z.number().min(0),
  productLink: z.string(),
  productDescription: z.string(),
});
