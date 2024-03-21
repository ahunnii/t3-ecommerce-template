import type { LucideIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useConfig } from "~/providers/style-config-provider";
import { cn } from "~/utils/styles";

type TCheckoutBtnProps = {
  onCheckout: () => void;
  isDisabled: boolean;
  style: CheckoutBtnProcessor;
};

type CheckoutBtnProcessor = {
  Icon: LucideIcon;
  label: string;
  style: string;
};
export const CheckoutBtn = (props: TCheckoutBtnProps) => {
  const config = useConfig();
  return (
    <Button
      onClick={props.onCheckout}
      variant={"outline"}
      disabled={props.isDisabled}
      className={cn("mt-6 w-full", config.cart.button)}
    >
      Checkout
    </Button>
  );
};
