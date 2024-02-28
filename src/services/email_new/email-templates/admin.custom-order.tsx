import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { storeTheme } from "~/data/config.custom";
import { env } from "~/env.mjs";

interface NewCustomOrderEmailProps {
  firstName: string;
  orderLink: string;
}

// const baseUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : env.NEXT_PUBLIC_URL;

const baseUrl = "https://trend-anomaly.vercel.app";

const config = storeTheme;
export const NewCustomOrderEmail = ({
  firstName,
  orderLink,
}: NewCustomOrderEmailProps) => (
  <Html>
    <Head />
    <Preview>You have a new custom order request from {firstName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}${config.logo.default}`}
          width="80"
          height="80"
          alt="logo"
          style={logo}
        />
        <Text style={paragraph}>Hey there,</Text>
        <Text style={paragraph}>
          It looks like you got a new custom order request from {firstName}.
          Check it out here!
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={orderLink}>
            Check it out
          </Button>
        </Section>
        <Text style={paragraph}>
          Best,
          <br />
          The {config.brand.name} team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default NewCustomOrderEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#5F51E8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};
