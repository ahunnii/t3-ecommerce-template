import type { FC } from "react";
import { FormDescription, FormLabel } from "~/components/ui/form";
import { cn } from "~/utils/styles";

type Props = {
  children: React.ReactNode;
  title: string;
  description?: string;
  bodyClassName?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const EditSection: FC<Props> = ({
  children,
  title,
  description,
  className,
  bodyClassName,
}) => {
  return (
    <div
      className={cn(
        "w-full rounded-md border border-border bg-background/50 p-4 ",
        className
      )}
    >
      <FormLabel>{title}</FormLabel>{" "}
      {description && <FormDescription>{description}</FormDescription>}
      <div className={cn("mt-5", bodyClassName)}>{children}</div>
    </div>
  );
};
