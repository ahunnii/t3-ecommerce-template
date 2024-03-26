import {
  Fragment,
  forwardRef,
  type ElementRef,
  type HTMLAttributes,
} from "react";

import IconButton from "~/components/common/buttons/icon-button";

import { cn } from "~/utils/styles";
import type { QuickAction } from "../../types";

export interface ProductCardQuickActionsProps
  extends HTMLAttributes<ElementRef<"div">> {
  actions: QuickAction[];
}
export const ProductCardQuickActions = forwardRef<
  ElementRef<"div">,
  ProductCardQuickActionsProps
>(({ className, actions, ...props }, ref) => {
  return (
    <div
      className={cn(
        "absolute bottom-5 z-[45] w-full px-6 opacity-0 transition group-hover:opacity-100",
        className
      )}
      ref={ref}
      {...props}
    >
      <div className="flex justify-center gap-x-6">
        {actions.map((action, index) => (
          <Fragment key={index}>
            {action?.renderIf && (
              <IconButton onClick={action.onClick} icon={action.icon} />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
});

ProductCardQuickActions.displayName = "ProductCardQuickActions";
