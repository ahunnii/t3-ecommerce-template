import type { ElementRef, HTMLAttributes } from "react";
import { cn } from "~/utils/styles";

export const SlashIcon = ({ className }: HTMLAttributes<ElementRef<"svg">>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn(className)}
  >
    <path d="M22 2 2 22" />
  </svg>
);
