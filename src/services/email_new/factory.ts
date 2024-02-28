import { EmailService } from "./email-service";

import { ResendEmailService } from "./processors/resend";
import type { resendClient } from "./processors/resend/client";

export class EmailProcessorFactory {
  static createEmailService(processorType: string) {
    switch (processorType) {
      case "resend":
        return new EmailService<typeof resendClient>(ResendEmailService);

      default:
        throw new Error("Unsupported email processor type");
    }
  }
}
