import { toast, Toaster } from "react-hot-toast";
import type { TToastService } from "./types";

export const HotToastService: TToastService = {
  Toaster: Toaster,
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
