import { Redis } from "@upstash/redis";
import { env } from "~/env.mjs";

if (env.REDIS_URL === undefined || env.REDIS_TOKEN === undefined) {
  throw new Error("redis is not defined");
}

export const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN,
});
