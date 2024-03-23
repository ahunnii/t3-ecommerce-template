/* eslint-disable react-hooks/exhaustive-deps */
import { Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { ViewSection } from "~/components/common/sections/view-section.admin";
import { Button } from "~/components/ui/button";

import { Textarea } from "~/components/ui/textarea";
import { toastService } from "~/services/toast";
import { api } from "~/utils/api";

type VierOrderTimelineProps = {
  note: string | null;
};

export const ViewOrderNote = ({ note }: VierOrderTimelineProps) => {
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const { orderId } = useParams();

  const updateOrderNote = api.orders.updateOrderNote.useMutation({
    onSuccess: () => toastService.success("Note has been updated"),
    onError: (error: unknown) =>
      toastService.error("Failed to update note", error),
    onSettled: () => void apiContext.orders.invalidate(),
  });

  const handleNoteUpdate = () => {
    updateOrderNote.mutate({
      orderId: orderId as string,
      note: noteRef.current!.value,
    });
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.key === "Enter" &&
        (!e.shiftKey || e.ctrlKey || e.metaKey) &&
        document.activeElement === noteRef?.current
      ) {
        e.preventDefault();
        handleNoteUpdate();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const apiContext = api.useContext();

  return (
    <ViewSection title="Note" description="Write a quick note about the order">
      <div className="flex items-end gap-2">
        <Textarea
          placeholder="Write a note..."
          ref={noteRef}
          defaultValue={note ?? ""}
          className="resize-none"
        />
        <Button
          size={"icon"}
          onClick={handleNoteUpdate}
          className="aspect-square size-5"
        >
          <Send className="size-4" />
        </Button>
      </div>
    </ViewSection>
  );
};
