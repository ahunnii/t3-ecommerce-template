import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export const SuccessPanel = () => {
  return (
    <div className="flex w-full max-w-5xl flex-col  items-center space-y-8 border border-gray-100 bg-white p-4 py-28 shadow-lg">
      <CheckCircle2 className="mx-auto h-32 w-32 text-green-500" />
      <div className="">
        <h1 className="text-center text-3xl font-bold text-black">
          Your order is complete!
        </h1>
        <p className="text-center text-muted-foreground">
          Thank you for shopping with us. You will be receiving a confirmation
          email with order details soon.
        </p>
      </div>
      <Button className="w-fit px-16" variant={"secondary"}>
        <Link href="/collections/all-products">Continue Shopping</Link>
      </Button>
    </div>
  );
};
