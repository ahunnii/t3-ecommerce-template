import { type NextApiRequest, type NextApiResponse } from "next";
import categoryByIdHandler from "~/modules/categories/api/getCategory.handler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return categoryByIdHandler(req, res);
};

export default handler;
