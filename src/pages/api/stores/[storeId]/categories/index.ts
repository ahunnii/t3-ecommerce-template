import { type NextApiRequest, type NextApiResponse } from "next";
import categoriesHandler from "~/modules/categories/api/getCategories.handler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return categoriesHandler(req, res);
};

export default handler;
