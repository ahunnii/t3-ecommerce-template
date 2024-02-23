/* eslint-disable @typescript-eslint/no-explicit-any */
import { Children, type Component, type FC, type ReactNode } from "react";
import { default as FastMarquee } from "react-fast-marquee";
import { cn } from "~/utils/styles";
import s from "./ta-marquee.wip.module.css";

interface MarqueeProps {
  className?: string;
  children?: ReactNode[] | Component[] | any[];
  variant?: "primary" | "secondary";
}

const Marquee: FC<MarqueeProps> = ({
  className = "",
  children,
  variant = "primary",
}) => {
  // const rootClassName = cn(
  //   s.root,
  //   {
  //     [s.primary!]: variant === "primary",
  //     [s.secondary!]: variant === "secondary",
  //   },
  //   className
  // );

  return (
    <FastMarquee
      gradient={true}
      className={"my-4 bg-purple-300/20"}
      speed={40}
      gradientColor="rgb(0 0 0  / 0.9)"
    >
      {Children.map(children, (child) => ({
        ...child,
        props: {
          ...child.props,
          className: cn(child.props.className as string, `${variant}`),
        },
      }))}
    </FastMarquee>
  );
};

export default Marquee;
