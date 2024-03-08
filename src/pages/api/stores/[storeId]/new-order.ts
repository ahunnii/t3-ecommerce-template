import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { type NextApiRequest, type NextApiResponse } from "next";
import { storeTheme } from "~/data/config.custom";
import type { ContactFormValues } from "~/modules/contact/types";

import { emailService } from "~/services/email";
import InquiryEmailTemplate from "~/services/email/email-templates/inquiry.core";
import NewOrderEmailTemplate from "~/services/email/email-templates/new-order.core";

const sendInquiryHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    switch (req.method) {
      case "POST":
        const payload: { link: string } = req.body;

        try {
          const emailData = {
            link: payload.link,
          };

          const createCustomRequest = await emailService.sendEmail<
            typeof emailData
          >({
            to: storeTheme.brand.email,
            from: "Trend Anomaly <no-reply@trendanomaly.com>",
            subject: "New Order from Trend Anomaly",
            template: NewOrderEmailTemplate,
            data: emailData,
          });
          return res.status(200).json(createCustomRequest);
        } catch (cause) {
          if (cause instanceof TRPCError) {
            const httpCode = getHTTPStatusCodeFromError(cause);
            return res.status(httpCode).json(cause);
          }

          console.error(cause);
          res.status(500).json({ message: "Internal server error" });
        }

      default:
        res.setHeader("Allow", "POST");
        return res.status(405).end("Method Not Allowed");
    }
  } catch (cause) {
    if (cause instanceof TRPCError) {
      const httpCode = getHTTPStatusCodeFromError(cause);
      return res.status(httpCode).json(cause);
    }

    console.error(cause);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default sendInquiryHandler;
