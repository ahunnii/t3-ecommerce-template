import { CustomOrderType } from "@prisma/client";
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

export type CustomRequestFormValues = z.infer<typeof customRequestFormSchema>;

export type SocialMedia = {
  Icon: LucideIcon;
  href: string;
  name: string;
};
