import type { CreateEmailOptions } from "resend/build/src/emails/interfaces";

import NewCustomOrderEmail from "../../email-templates/new-custom-order";
import NewCustomOrderCustomer from "../../email-templates/new-custom-order-customer";
import type { EmailProcessor } from "../../factory";
import type {
  CustomOrderEmailData,
  CustomerCustomOrderProps,
  Email,
  RouteEmailData,
} from "../../types";
import { resendClient } from "./client";

type SendEmailProps<T> = {
  data: T;
  type: Email;
};

export const ResendEmailService: EmailProcessor<typeof resendClient> = {
  client: resendClient,

  sendCustomOrderToAdmin: async <T extends CustomOrderEmailData>({
    data,
  }: SendEmailProps<T>) => {
    const { email, name, url } = data;
    try {
      const res = await resendClient.emails.send({
        from: "Trend Anomaly <no-reply@trendanomaly.com>",
        to: email,
        subject: "New Custom Order Request",
        react: NewCustomOrderEmail({
          firstName: name,
          orderLink: url,
        }),
      } as CreateEmailOptions);

      return res;
    } catch (e) {
      console.log(e);
    }
  },

  sendCustomOrderToCustomer: async <T extends CustomerCustomOrderProps>({
    data,
  }: SendEmailProps<T>) => {
    const { email } = data;
    try {
      const res = await resendClient.emails.send({
        from: "Trend Anomaly <no-reply@trendanomaly.com>",
        to: email,
        subject: "New Invoice from Trend Anomaly",
        react: NewCustomOrderCustomer({
          ...data,
        }),
      } as CreateEmailOptions);

      return res;
    } catch (e) {
      console.log(e);
    }
  },
};
