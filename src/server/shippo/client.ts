import { env } from "~/env.mjs";

import shippo from "shippo";

export const shippoClient = shippo(env.SHIPPO_API_KEY);

// const shippo = require("shippo")(env.SHIPPO_API_KEY);
