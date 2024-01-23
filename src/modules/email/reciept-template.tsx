import * as React from "react";

import { Button } from "@react-email/button";

import { Tailwind } from "@react-email/tailwind";

interface EmailTemplateProps {
  fullName: string;
  message: string;
  email: string;
}

export const RecieptTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  fullName,
  message,
  email,
}) => (
  <Tailwind>
    <Button
      className="bg-brand px-3 py-2 font-medium leading-4 text-white"
      href="https://example.com"
    >
      Click me
    </Button>
  </Tailwind>
);
