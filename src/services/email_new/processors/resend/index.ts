import type { CreateEmailOptions } from "resend/build/src/emails/interfaces";

import type { EmailProcessor } from "../../interface";
import type { EmailProps } from "../../types";

import { Resend } from "resend";

import { env } from "~/env.mjs";

export const resendClient = new Resend(env.RESEND_API_KEY);

export const ResendEmailService: EmailProcessor<typeof resendClient> = {
  client: resendClient,

  sendEmail: async <V>(props: EmailProps<V>) => {
    try {
      const res = await resendClient.emails.send({
        from: props.from,
        to: props.to,
        subject: props.subject,
        react: props.template(props.data),
      } as CreateEmailOptions);

      return {
        status: res?.error ? "error" : "success",
        message: res?.error ? res?.error?.message : "Email sent successfully",
      };
    } catch (e) {
      console.error("sendEmail error: ", e);
    }
  },
};
