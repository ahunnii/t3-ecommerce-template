import { env } from "~/env.mjs";
import { availableToastServices } from "./available";
import { ToastService } from "./toastService";

export const selectedService =
  availableToastServices[
    (env.NEXT_PUBLIC_TOAST_SERVICE ??
      "hotToast") as keyof typeof availableToastServices
  ];

export const toastService = new ToastService(selectedService);
