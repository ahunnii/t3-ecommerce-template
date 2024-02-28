import type { EmailProcessor } from "./interface";
import type { EmailProps } from "./types";

export class EmailService<Client> {
  constructor(private service: EmailProcessor<Client>) {}

  client: Client = this.service.client;

  sendEmail = async <V>(props: EmailProps<V>) => {
    return this.service.sendEmail(props);
  };
}
