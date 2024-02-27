import type { CreateEmailOptions } from "resend/build/src/emails/interfaces";

import NewCustomOrderEmail from "../../email-templates/new-custom-order";
import NewRouteTemplate from "../../email-templates/new-route-template";
import type { EmailProcessor } from "../../factory";
import type { CustomOrderEmailData, Email, RouteEmailData } from "../../types";
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
};
