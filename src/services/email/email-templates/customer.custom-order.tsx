import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";
import { Button } from "~/components/ui/button";

import { env } from "~/env.mjs";

interface RoutingMagicLinkProps {
  name?: string;
  customerName?: string;
  email?: string;
  productLink?: string;
  invoiceId?: string;
  product?: string;
  price?: string;
  total?: string;
  dueDate?: string;
  notes?: string;
}

const baseUrl = env.NEXT_PUBLIC_URL;

export const NewCustomOrderCustomer = ({
  customerName = "Andrew Hunn",
  name = "Trend Anomaly",
  product = "Custom Hat",
  price = "30.00",
  total = "30.00",
  productLink = "https://trendanomaly.com",
  invoiceId = "cdasaewrefd234fda",
  notes = "Thank you for your purchase Thank you for your purchase Thank you for your purchase Thank you for your purchase",
}: RoutingMagicLinkProps) => (
  <Html>
    <Head />
    <Preview>New invoice from {name}</Preview>
    <Body style={main}>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#007291",
              },
            },
          },
        }}
      >
        <Container>
          <div className="flex p-8 ">
            <Img
              src={`${baseUrl}/custom/logo.png`}
              width="80"
              height="80"
              alt=" Logo"
            />
          </div>
        </Container>

        <Container className=" shadow">
          <div className="p-8">
            <Heading className="text-left text-lg font-medium text-muted-foreground">
              Invoice from {name}
            </Heading>
            <Text className="text-left text-4xl font-semibold">$30.00</Text>
            <Text className="text-left text-lg font-medium text-muted-foreground">
              Due {new Date().toDateString()}
            </Text>
            <hr className="my-4 border-slate-200 px-4" />{" "}
            <div className="flex flex-col space-y-2 pb-4">
              <p className="text-left text-lg font-medium text-muted-foreground">
                To: {customerName}
              </p>
              <p className="text-left text-lg font-medium text-muted-foreground">
                From: <span>{name}</span>
              </p>
              {/* Notes */}
              <p className="text-left text-lg font-medium text-muted-foreground">
                Notes: {notes}
              </p>
            </div>
            <Link href={productLink}>
              <Button className="w-full">Pay invoice now</Button>
            </Link>
          </div>
        </Container>

        <Container className=" mt-4 shadow">
          <div className="p-8">
            <Text className="text-left font-medium text-muted-foreground">
              Invoice #{invoiceId}
            </Text>
            <div className="flex items-center justify-between">
              <div className="flex flex-col ">
                <p className="text-left font-semibold">{product}</p>
                <p className="text-left text-muted-foreground">Qty: 1</p>
              </div>
              <Text className="text-left text-xl font-bold">${price}</Text>
            </div>
            <hr className="my-4 border-slate-200 px-4" />{" "}
            <div className="flex items-center justify-between">
              <div className="flex flex-col ">
                <p className="text-left font-semibold">Subtotal Due</p>
              </div>
              <Text className="text-left text-xl font-bold">${total}</Text>
            </div>
            <hr className="my-4 border-slate-200 px-4" />{" "}
            <p className=" w-full  text-muted-foreground">
              Questions? Contact us at inquiries@trendanomaly.com
            </p>
          </div>
        </Container>
      </Tailwind>
    </Body>
  </Html>
);

export default NewCustomOrderCustomer;

const main = {
  backgroundColor: "#ffffff",
};

const container = {
  paddingLeft: "12px",
  paddingRight: "12px",
  margin: "0 auto",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const link = {
  color: "#2754C5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  textDecoration: "underline",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0",
};

const footer = {
  color: "#898989",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "12px",
  marginBottom: "24px",
};

const code = {
  display: "inline-block",
  padding: "16px 4.5%",
  width: "90.5%",
  backgroundColor: "#f4f4f4",
  borderRadius: "5px",
  border: "1px solid #eee",
  color: "#333",
};
