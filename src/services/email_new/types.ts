import type { FC } from "react";

export type EmailTemplate = {
  from: string;
  to?: string;
  subject: (name: string) => string;
  Template: FC<Readonly<EmailData>>;
};

export type EmailTemplateMap = {
  [key in Email]: EmailTemplate;
};

export type Email = "newRoute" | "default";

export type EmailData = {
  email: string;
  name: string;
  body: string;
};

export type RouteEmailData = {
  email: string;
  loginCode: string;
  url: string;
};

export type CustomOrderEmailData = {
  email: string;
  url: string;
  name: string;
};

export type TEmailService<Client> = {
  sendEmail: <T extends EmailData>({
    data,
    type,
  }: {
    data: T;
    type: Email;
  }) => Promise<unknown>;
  client: Client;
};

export type CustomerCustomOrderProps = {
  name?: string;
  customerName?: string;
  email?: string;
  productLink?: string;
  invoiceId?: string;
  product?: string;
  price?: string;
  total?: string;
  dueDate?: string;
  notes?: string;
};

export type EmailProps<V> = {
  from: string;
  to: string;
  subject: string;
  data: V;
  template: React.FC<V>;
};

export type SendEmailProps<T> = {
  data: T;
};
