import type { LucideIcon } from "lucide-react";
import * as z from "zod";

export const contactFormSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  body: z.string(),
  images: z.object({ url: z.string() }).array().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export type SocialMedia = {
  Icon: LucideIcon;
  href: string;
  name: string;
};
