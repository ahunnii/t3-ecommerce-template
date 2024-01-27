import type { FC } from "react";
import type { EmailData } from "~/services/email/types";

export const InquiryTemplate: FC<Readonly<EmailData>> = ({
  name,
  body,
  email,
}) => (
  <div>
    <h1>A new membership request from: {name}!</h1>

    <p>{body}</p>

    <p>Get in touch at their email: {email}</p>
  </div>
);
