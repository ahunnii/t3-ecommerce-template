import type { NextApiRequest, NextApiResponse } from "next";

import { emailService } from "~/services/email";

const inquiryHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
  }

  try {
    const { name, email, body } = req.body;
    const data = await emailService.sendEmail({
      type: "contactUs",
      data: {
        name,
        email,
        body,
      },
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};
export default inquiryHandler;
