import Easypost from "@easypost/api";
import { env } from "~/env.mjs";

export const easyPost = new Easypost(env.EASYPOST_API_KEY);
