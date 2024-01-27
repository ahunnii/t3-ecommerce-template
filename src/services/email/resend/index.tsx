import type { CreateEmailOptions } from "resend/build/src/emails/interfaces";
import { env } from "~/env.mjs";
import { InquiryTemplate } from "~/services/email/resend/email-templates/inquiry";
import type {
  Email,
  EmailData,
  EmailTemplateMap,
  TEmailService,
} from "../types";
import { resendClient } from "./client";

const emailTemplates: EmailTemplateMap = {
  contactUs: {
    from: `Shop Inquiry <contact@dreamwalkerstudios.co>`,
    to: env.SHOP_EMAIL,
    subject: (name: string) => `Shop Inquiry from ${name}`,
    Template: InquiryTemplate,
  },
  default: {
    from: `Shop <contact@dreamwalkerstudios.co>`,
    to: env.SHOP_EMAIL,
    subject: () => "Default from ",
    Template: InquiryTemplate,
  },
};

type SendEmailProps<T> = {
  data: T;
  type: Email;
};

export const ResendEmailService: TEmailService<typeof resendClient> = {
  client: resendClient,
  sendEmail: async <T extends EmailData>({
    data,
    type = "default",
  }: SendEmailProps<T>) => {
    const { name, email, body } = data;
    const res = await resendClient.emails.send({
      from: emailTemplates[type].from,
      to: env.SHOP_EMAIL,
      subject: emailTemplates[type].subject(name),
      react: emailTemplates[type].Template({
        name,
        body,
        email,
      }),
    } as CreateEmailOptions);

    console.log(res);
    return res;
  },
};
