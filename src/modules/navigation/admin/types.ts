import type { LucideIcon } from "lucide-react";

export type Route = {
  href: string;
  label: string;
  active: boolean;
  Icon: LucideIcon;
  subRoutes?: {
    href: string;
    label: string;
    active: boolean;
  }[];
};
