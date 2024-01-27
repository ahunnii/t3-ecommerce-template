import type { Email, EmailData, TEmailService } from "./types";

export class EmailService<Client> {
  constructor(private service: TEmailService<Client>) {}

  client: Client = this.service.client;
  sendEmail = async <T extends EmailData>({
    data,
    type,
  }: {
    data: T;
    type: Email;
  }) => {
    return this.service.sendEmail({ type, data });
  };
}
