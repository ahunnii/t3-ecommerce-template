import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { env } from "~/env.mjs";

type Props = {
  userName: string;
  userEmail: string;
  question: string;
};

// const baseUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : "";
const baseUrl = env.NEXT_PUBLIC_URL;

export const InquiryEmailTemplate = ({
  userName,
  question,
  userEmail,
}: Props) => {
  const previewText = `Read ${userName}'s review`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>

      <Body style={main}>
        <Container style={container}>
          <Section style={centeredSection}>
            <Img
              src={`${baseUrl}/custom/logo.png`}
              width="96"
              height="96"
              alt=" Logo"
            />
          </Section>
          <Section style={{ paddingBottom: "20px" }}>
            <Row>
              <Text style={heading}>You have a new shop inquiry</Text>
              <Text style={review}>
                <p>
                  Name: <span>{userName} </span>
                </p>
                <p>
                  Email: <span>{userEmail} </span>
                </p>
              </Text>
              <Text style={review}>{question}</Text>

              <Button style={button} href={`mailto:${userEmail}`}>
                Respond to {userName}
              </Button>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default InquiryEmailTemplate;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
  maxWidth: "100%",
};

const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
  textAlign: "center" as const,
};

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
  color: "#484848",
};

const review = {
  ...paragraph,
  padding: "24px",
  backgroundColor: "#f2f3f3",
  borderRadius: "4px",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "18px",
  paddingTop: "19px",
  paddingBottom: "19px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
};

const link = {
  ...paragraph,
  color: "#ff5a5f",
  display: "block",
};

const reportLink = {
  fontSize: "14px",
  color: "#9ca299",
  textDecoration: "underline",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#9ca299",
  fontSize: "14px",
  marginBottom: "10px",
};

const centeredSection = {
  display: "flex",

  justifyContent: "center",
  padding: "0 20px",
  width: "100%",
};
