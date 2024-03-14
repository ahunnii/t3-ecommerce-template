import { forwardRef, type ElementRef } from "react";
import { Button } from "~/components/ui/button";

import {
  ContentSwitchWrapper,
  type ContentSwitchWrapperProps,
} from "../../../components/utility/content-switch-wrapper";

export interface CategoryCardProps extends ContentSwitchWrapperProps {
  hasButton?: boolean;
  title: string;
  subtitle?: string;
}
export const CategoryCard = forwardRef<ElementRef<"div">, CategoryCardProps>(
  ({ hasButton = true, ...props }, ref) => {
    return (
      <ContentSwitchWrapper {...props} ref={ref}>
        {props?.subtitle && (
          <p className="absolute bottom-32 left-5 z-50  text-lg font-semibold text-white lg:text-xl ">
            {props?.subtitle}
          </p>
        )}

        <p className="absolute bottom-20 left-5  z-50  text-2xl font-semibold text-white lg:text-3xl">
          {props?.title}
        </p>
        {hasButton && (
          <Button className="absolute bottom-5 left-5 z-50" variant={"outline"}>
            Shop {props.title}
          </Button>
        )}
      </ContentSwitchWrapper>
    );
  }
);

CategoryCard.displayName = "CategoryCard";
