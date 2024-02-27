import type {
  CustomOrderEmailData,
  CustomerCustomOrderProps,
  RouteEmailData,
} from "./types";

type SendEmailProps<T> = {
  data: T;
};

export interface EmailProcessor<Client> {
  client: Client;

  sendCustomOrderToAdmin<T extends CustomOrderEmailData>({
    data,
  }: SendEmailProps<T>): Promise<unknown>;

  sendCustomOrderToCustomer<T extends CustomerCustomOrderProps>({
    data,
  }: SendEmailProps<T>): Promise<unknown>;
}

export class EmailService<Client> {
  constructor(private service: EmailProcessor<Client>) {}

  client: Client = this.service.client;

  sendCustomOrderToAdmin = async <T extends CustomOrderEmailData>(
    props: SendEmailProps<T>
  ) => {
    return this.service.sendCustomOrderToAdmin(props);
  };

  sendCustomOrderToCustomer = async <T extends CustomerCustomOrderProps>(
    props: SendEmailProps<T>
  ) => {
    return this.service.sendCustomOrderToCustomer(props);
  };
}
