import { env } from "~/env.mjs";
import { availableServices } from "./available";
import { EmailService } from "./emailService";

const selectedService =
  availableServices[
    (env.NEXT_PUBLIC_EMAIL_SERVICE ??
      "resend") as keyof typeof availableServices
  ];

export const emailService = new EmailService<typeof selectedService.client>(
  selectedService
);
