import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import * as React from "react";

import { env } from "~/env.mjs";

interface RoutingMagicLinkProps {
  trackingLink?: string;
  orderLink?: string;
  orderId?: string;
}

// const baseUrl = env.NEXT_PUBLIC_URL ;
const baseUrl = env.NEXT_PUBLIC_URL;

export const TrackingInfoCustomerTemplate = ({
  orderLink = "https://test.com",
  trackingLink = "https://test.com",
  orderId = "easfdsfadsfdasf",
}: RoutingMagicLinkProps) => (
  <Html>
    <Head />
    <Preview>A shipment from order {orderId} is on the way</Preview>

    <Tailwind>
      <Body className="w-full bg-white p-8">
        <Section className="border border-solid border-[#eaeaea] p-8 ">
          <Img
            src={`${baseUrl}/custom/logo.png`}
            width="80"
            height="80"
            alt=" Logo"
            className="ml-8 mt-8"
          />
          <div className="p-8">
            <Row>
              <Column>
                <Heading className="text-left text-2xl font-medium ">
                  Your order is on the way!
                </Heading>
              </Column>
              <Column>
                <Link className="float-right" href={orderLink}>
                  Order #{orderId}
                </Link>
              </Column>
            </Row>

            <Text className="text-left text-base">
              Your order is on the way. Track your shipment to see the delivery
              status.
            </Text>

            <Button
              className="w-full rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
              href={trackingLink}
            >
              Track your order
            </Button>
          </div>
        </Section>

        <Section className=" mt-4 border border-solid border-[#eaeaea] ">
          <div className="p-8">
            <p className="w-full text-[hsl(215.4,16.3%,46.9%)]">
              Questions? Contact us at inquiries@trendanomaly.com
            </p>
          </div>
        </Section>
      </Body>
    </Tailwind>
  </Html>
);

export default TrackingInfoCustomerTemplate;
