import { toast } from "sonner";

import { Toaster } from "~/components/ui/sonner";

import type { TToastService } from "./types";

const SonarToaster = () => <Toaster position="top-center" richColors={true} />;

export const SonarToastService: TToastService = {
  Toaster: SonarToaster,
  success: (message: string) => {
    return toast.success(message);
  },
  error: <Error,>(message: string, error: Error) => {
    console.error("Toast Service Error:", error);
    return toast.error(message);
  },
  inform: (message: string) => {
    return toast(message);
  },
};
