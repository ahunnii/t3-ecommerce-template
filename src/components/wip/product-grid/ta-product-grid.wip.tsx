import { Component, type FC, type ReactNode } from "react";
import { cn } from "~/utils/styles";
import s from "./ta-product-grid.wip.module.css";

interface GridProps {
  className?: string;
  children?: ReactNode;
  layout?: "A" | "B" | "C" | "D" | "normal";
  variant?: "default" | "filled";
}

const Grid: FC<GridProps> = ({
  className,
  layout = "A",
  children,
  variant = "default",
}) => {
  const rootClassName = cn(
    s.root,
    {
      [s.layoutA!]: layout === "A",
      [s.layoutB!]: layout === "B",
      [s.layoutC!]: layout === "C",
      [s.layoutD!]: layout === "D",
      [s.layoutNormal!]: layout === "normal",
      [s.default!]: variant === "default",
      [s.filled!]: variant === "filled",
    },
    className,
    "thing"
  );
  return <div className={rootClassName}>{children}</div>;
};

export default Grid;
