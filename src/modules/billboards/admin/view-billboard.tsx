import type { Billboard } from "@prisma/client";
import BillboardDisplay from "~/components/core/ui/billboard";

export const ViewBillboard = ({ billboard }: { billboard: Billboard }) => {
  return (
    <div className="w-full rounded-md border border-border bg-background/50 p-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Preview
      </h3>
      <p className="text-sm text-muted-foreground">
        This is what is shown at the top of each collections page.
      </p>

      <BillboardDisplay data={billboard} textStyle="text-white" />
    </div>
  );
};
