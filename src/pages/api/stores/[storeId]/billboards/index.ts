import { type NextApiRequest, type NextApiResponse } from "next";
import billboardsHandler from "~/modules/billboards/api/billboards-handler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return billboardsHandler(req, res);
};

export default handler;
