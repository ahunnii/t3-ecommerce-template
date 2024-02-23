/* eslint-disable react-hooks/exhaustive-deps */
import type { TimeLineEntry } from "@prisma/client";
import { CheckCircle, Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";

import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { toastService } from "~/services/toast";
import { api } from "~/utils/api";
import { timeSinceDate } from "~/utils/calculate-time-difference";
import { cn } from "~/utils/styles";

type VierOrderTimelineProps = {
  timeline: TimeLineEntry[];
};

export const ViewOrderTimeline = ({ timeline }: VierOrderTimelineProps) => {
  const timelineRef = useRef<HTMLTextAreaElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const { orderId } = useParams();

  const handleNewTimelineEntry = () => {
    createTimelineEntry.mutate({
      orderId: orderId as string,
      type: "ORDER_NOTE",
      title: "Note from Owner",
      description: timelineRef.current!.value,
    });
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (!e.shiftKey || e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleNewTimelineEntry();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const apiContext = api.useContext();

  const createTimelineEntry = api.orders.createTimelineEntry.useMutation({
    onSuccess: () => {
      toastService.success("Timeline entry created");
    },
    onError: (error: unknown) =>
      toastService.error("Failed to create timeline entry", error),
    onSettled: () => {
      timelineRef.current!.value = "";
      void apiContext.orders.invalidate();
    },
  });

  useEffect(() => {
    if (topRef.current && createTimelineEntry.isSuccess)
      topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [createTimelineEntry.isSuccess]);
  return (
    <div className="w-full space-y-5 rounded-md border border-border bg-background/50 p-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Timeline
      </h3>
      <div className="flex items-end gap-2">
        <Textarea
          placeholder="Write a note..."
          ref={timelineRef}
          className="resize-none"
        />
        <Button size={"icon"} onClick={handleNewTimelineEntry}>
          <Send className="size-4" />
        </Button>
      </div>
      <Separator />
      <ScrollArea className="flex max-h-96 flex-col gap-4">
        <div ref={topRef} />
        {timeline.map((item: TimeLineEntry) => (
          <div key={item.id} className={cn("flex w-full gap-4 p-2")}>
            {item?.type === "ORDER_PLACED" && (
              <CheckCircle className="h-6 w-6" />
            )}
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
      </ScrollArea>
    </div>
  );
};
