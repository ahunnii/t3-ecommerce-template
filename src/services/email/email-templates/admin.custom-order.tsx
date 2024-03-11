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

interface NewCustomOrderEmailProps {
  firstName: string;
  orderLink: string;
}

// const baseUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : env.NEXT_PUBLIC_URL;

const baseUrl = env.NEXT_PUBLIC_URL;

const config = storeTheme;
export const NewCustomOrderEmail = ({
  firstName,
  orderLink,
}: NewCustomOrderEmailProps) => (
  <Html>
    <Head />
    <Preview>You have a new custom order request from {firstName}</Preview>
    <Tailwind>
      <Body className="p-8">
        <Container className="border border-solid border-[#eaeaea] p-8">
          <Img
            src={`${baseUrl}${config.logo.default}`}
            width="80"
            height="80"
            alt="logo"
            className="mx-auto mt-8"
            style={logo}
          />
          <div className="p-8">
            <Heading className="text-center text-2xl">
              New Custom Order Request
            </Heading>

            <Text style={paragraph}>
              It looks like you got a new custom order request from {firstName}.
              Check it out!
            </Text>

            <Button style={button} href={orderLink}>
              View Order Request
            </Button>
          </div>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default NewCustomOrderEmail;

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
