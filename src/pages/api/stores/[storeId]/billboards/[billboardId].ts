import { type NextApiRequest, type NextApiResponse } from "next";
import { billboardHandler } from "~/modules/billboards/api/billboard-handler";

const billboardByIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  return billboardHandler(req, res);
};

export default billboardByIdHandler;
