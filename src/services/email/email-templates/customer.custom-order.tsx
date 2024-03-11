import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Tailwind,
  Text,
} from "@react-email/components";

import * as React from "react";

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

// const baseUrl = env.NEXT_PUBLIC_URL ;
const baseUrl = env.NEXT_PUBLIC_URL;

export const NewCustomOrderCustomer = ({
  customerName = "Test",
  name = "Test",
  product = "Custom Hat",
  price = "30.00",
  total = "30.00",
  productLink = "https://test.com",
  invoiceId = "easfdsfadsfdasf",
  notes = "Thank you for your purchase Thank you for your purchase Thank you for your purchase Thank you for your purchase",
}: RoutingMagicLinkProps) => (
  <Html>
    <Head />
    <Preview>New invoice from {name}</Preview>

    <Tailwind>
      <Body className="bg-white p-8">
        <Container className="border border-solid border-[#eaeaea] p-8 ">
          <Img
            src={`${baseUrl}/custom/logo.png`}
            width="80"
            height="80"
            alt=" Logo"
            className="ml-8 mt-8"
          />
          <div className="p-8">
            <Heading className="text-left text-lg font-medium text-[#666666]">
              Invoice from {name}
            </Heading>
            <Text className="text-left text-4xl font-semibold">$30.00</Text>
            <Text className="text-left text-lg font-medium text-[#666666]">
              Due {new Date().toDateString()}
            </Text>
            <hr className="my-4 border-slate-200 px-4" />{" "}
            <div className="pb-4">
              <p className="my-2 text-left text-lg font-medium text-[hsl(215.4,16.3%,46.9%)]">
                To: {customerName}
              </p>
              <p className="my-2 text-left text-lg font-medium text-[hsl(215.4,16.3%,46.9%)]">
                From: <span>{name}</span>
              </p>
              {/* Notes */}
              <p className="my-2 text-left text-lg font-medium text-[hsl(215.4,16.3%,46.9%)]">
                Notes: {notes}
              </p>
            </div>
            <Button
              className="w-full rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
              href={productLink}
            >
              Pay invoice now
            </Button>
          </div>
        </Container>

        <Container className=" mt-4 border border-solid border-[#eaeaea] ">
          <div className="p-8">
            <Text className="text-left font-medium text-[hsl(215.4,16.3%,46.9%)]">
              Invoice #{invoiceId}
            </Text>
            <Row className="w-full">
              <Column>
                <p className="text-left font-semibold">{product}</p>
                <p className="text-left text-[hsl(215.4,16.3%,46.9%)]">
                  Qty: 1
                </p>
              </Column>
              <Column>
                <Text className="float-right my-auto text-left text-xl font-bold">
                  ${price}
                </Text>
              </Column>
            </Row>
            <hr className="border-[rgb(26 232 240)] my-4 px-4" />
            <Row className="w-full">
              <Column>
                <Text className="text-left font-semibold">Subtotal Due</Text>
              </Column>
              <Column>
                <Text className="float-right text-left text-xl font-bold">
                  ${total}
                </Text>{" "}
              </Column>
            </Row>
            <hr className="border-[rgb(26 232 240)]px-4 my-4" />{" "}
            <p className="w-full text-[hsl(215.4,16.3%,46.9%)]">
              Questions? Contact us at inquiries@trendanomaly.com
            </p>
          </div>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default NewCustomOrderCustomer;
