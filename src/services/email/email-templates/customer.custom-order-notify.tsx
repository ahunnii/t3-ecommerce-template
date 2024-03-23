import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";
import { storeTheme } from "~/data/config.custom";
import { env } from "~/env.mjs";

type CustomOrderNotifyCustomerEmailProps = {
  firstName: string;
};

const baseUrl = "https://trend-anomaly.up.railway.app" ?? env.NEXT_PUBLIC_URL;

const config = storeTheme;
export const CustomerCustomRequestNotificationEmail = (
  props: CustomOrderNotifyCustomerEmailProps
) => (
  <Html>
    <Head />
    <Preview>Thanks for your request! </Preview>
    <Tailwind>
      <Body className="p-8">
        <CustomerCustomRequestNotificationEmailBody
          firstName={props.firstName}
        />
      </Body>
    </Tailwind>
  </Html>
);

export const CustomerCustomRequestNotificationEmailBody = (
  props: CustomOrderNotifyCustomerEmailProps
) => (
  <Container className="border border-solid border-[#eaeaea] p-8">
    <Img
      src={`${baseUrl}${config.logo.default}`}
      width="80"
      height="80"
      alt="logo"
      className="mx-auto mt-8 pt-8"
      style={logo}
    />
    <div className="p-8">
      <Heading className="text-center text-2xl">
        Thanks for your request!
      </Heading>

      <Text style={paragraph}>
        We have received your custom order request, {props.firstName}. We will
        be in touch with you as soon as possible.
      </Text>

      <Button style={button} href={`${baseUrl}/collections/all-products`}>
        Check out the store
      </Button>
    </div>
  </Container>
);

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  paddingLeft: "8px",
  paddingRight: "8px",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
  width: "100%",
};
