import type { FC } from "react";
import { cn } from "~/utils/styles";

type Props = {
  children: React.ReactNode;
  title: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const ViewSection: FC<Props> = ({ children, title, className }) => {
  return (
    <div
      className={cn(
        "w-full rounded-md border border-border bg-background/50 p-4",
        className
      )}
    >
      <h3 className="scroll-m-20 pb-4 text-2xl font-semibold tracking-tight">
        {title}
      </h3>

      {children}
    </div>
  );
};
