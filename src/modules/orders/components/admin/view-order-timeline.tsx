import type { TimeLineEntry } from "@prisma/client";
import { CheckCircle } from "lucide-react";

import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { timeSinceDate } from "~/utils/calculate-time-difference";
import { cn } from "~/utils/styles";

type VierOrderTimelineProps = {
  timeline: TimeLineEntry[];
};

export const ViewOrderTimeline = ({ timeline }: VierOrderTimelineProps) => {
  return (
    <div className="w-full space-y-5 rounded-md border border-border bg-background/50 p-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Timeline
      </h3>
      <Input placeholder="Write a note..." />
      <Separator />
      {timeline.map((item: TimeLineEntry) => (
        <div key={item.id} className={cn("flex w-full gap-4 p-2")}>
          {item?.type === "ORDER_PLACED" && <CheckCircle className="h-6 w-6" />}
          <div className="w-full">
            {" "}
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="text-sm text-muted-foreground">
              {timeSinceDate(item.createdAt.getTime())}
            </p>{" "}
            <p className="my-2 w-full rounded-md bg-slate-100 p-2 text-sm">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
