import type { ElementRef, FC, HTMLAttributes } from "react";

import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/utils/styles";
import { BackToButton } from "./back-to-button";

type Props = {
  link: string;
  contentName: string;
  title: string;
  description?: string;
} & HTMLAttributes<ElementRef<"div">>;
export const AdminFormHeader: FC<Props> = ({
  title,
  contentName,
  description,
  link,
  children,
  className,
  ...props
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white ">
      <div
        className={cn(
          " mx-auto flex max-w-7xl items-center justify-between px-8 py-4",
          className
        )}
        {...props}
      >
        <div>
          <BackToButton link={link} title={`Back to ${contentName}`} />
          <Heading title={title} description={description ?? ""} />
        </div>
        <div className="flex items-center gap-2">{children}</div>
      </div>
      <Separator className="sticky top-32  z-30 shadow" />
    </header>
  );
};
