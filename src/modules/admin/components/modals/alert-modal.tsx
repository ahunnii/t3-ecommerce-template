"use client";

import { Trash } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import { Modal } from "~/components/ui/modal";

interface AlertModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onConfirm: () => void;
  loading: boolean;
  asChild?: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  setIsOpen,
  onConfirm,
  loading,
  asChild = false,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 500);
    }
  }, [isOpen]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Modal
        title="Are you sure?"
        description="This action cannot be undone."
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="flex w-full items-center justify-end space-x-2 pt-6">
          <Button
            disabled={loading}
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button disabled={loading} variant="destructive" onClick={onConfirm}>
            Continue
          </Button>
        </div>
      </Modal>
      {asChild && (
        <Button
          disabled={loading}
          variant="destructive"
          size="sm"
          onClick={() => setIsOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      )}
    </>
  );
};
