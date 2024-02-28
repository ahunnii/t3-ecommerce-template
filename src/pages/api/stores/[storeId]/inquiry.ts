import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { type NextApiRequest, type NextApiResponse } from "next";
import { storeTheme } from "~/data/config.custom";
import { ContactFormValues } from "~/modules/contact/types";

import type { CustomRequestFormValues } from "~/modules/custom-orders/types";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { emailService } from "~/services/email_new";
import InquiryEmailTemplate from "~/services/email_new/email-templates/inquiry.core";

const sendInquiryHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // Create context and caller
  const ctx = await createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);

  try {
    switch (req.method) {
      case "POST":
        const payload: ContactFormValues = req.body;

        try {
          const emailData = {
            userName: payload.name,
            userEmail: payload.email,
            question: payload.body,
          };

          const createCustomRequest = await emailService.sendEmail<
            typeof emailData
          >({
            to: storeTheme.brand.email,
            from: "Trend Anomaly <no-reply@trendanomaly.com>",
            subject: "New Inquiry from Trend Anomaly",
            template: InquiryEmailTemplate,
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
