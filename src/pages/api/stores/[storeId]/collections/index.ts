import { type NextApiRequest, type NextApiResponse } from "next";
import { collectionsHandler } from "~/modules/collections/api/getCollections.handler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return collectionsHandler(req, res);
};

export default handler;
