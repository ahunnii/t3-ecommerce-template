import type * as z from "zod";
import type { storeFormSchema } from "./schema";

export type SettingsFormValues = z.infer<typeof storeFormSchema>;
