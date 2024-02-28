import type { EmailProps } from "./types";

export interface EmailProcessor<Client> {
  client: Client;

  sendEmail<V>(props: EmailProps<V>): Promise<unknown>;
}
