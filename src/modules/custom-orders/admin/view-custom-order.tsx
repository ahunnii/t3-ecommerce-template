import type { Billboard, Prisma } from "@prisma/client";
import BillboardDisplay from "~/components/core/ui/billboard";

export const ViewCustomOrder = ({
  customOrder,
}: {
  customOrder: Prisma.CustomOrderRequestGetPayload<{
    include: {
      images: true;
    };
  }>;
}) => {
  return (
    <div className="flex w-3/4 flex-col space-y-2">
      <div className="w-full rounded-md border border-border bg-background/50 p-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Customer
        </h3>
        <p className="text-lg">
          Name:{" "}
          <span className="text-muted-foreground">{customOrder.name}</span>
        </p>
        <p className="text-lg">
          Email:{" "}
          <span className="text-muted-foreground">{customOrder.email}</span>
        </p>
      </div>{" "}
      <div className="w-full rounded-md border border-border bg-background/50 p-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Type Requested
        </h3>
        <p className="text-lg">{customOrder.type}</p>
      </div>
      <div className="w-full rounded-md border border-border bg-background/50 p-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Description
        </h3>

        <p className="mt-4 text-base text-muted-foreground">
          {customOrder.description
            ? customOrder.description
            : "No description added"}
        </p>
      </div>
    </div>
  );
};
