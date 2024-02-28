import { type NextApiRequest, type NextApiResponse } from "next";
import createCustomOrderHandler from "~/modules/custom-orders/api/create-custom-order.handler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return createCustomOrderHandler(req, res);
};

export default handler;
