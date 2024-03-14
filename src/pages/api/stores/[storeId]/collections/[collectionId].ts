import { type NextApiRequest, type NextApiResponse } from "next";
import collectionByIdHandler from "~/modules/collections/api/getCollection.handler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return collectionByIdHandler(req, res);
};

export default handler;
