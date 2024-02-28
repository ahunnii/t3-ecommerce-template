import { EmailService } from "./email-service";

import type { resendClient } from "./processors/resend";
import { ResendEmailService } from "./processors/resend";

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
