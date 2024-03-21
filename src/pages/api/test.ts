import { Ratelimit } from "@upstash/ratelimit";

import { redis } from "~/server/redis/client";

import { type NextApiRequest, type NextApiResponse } from "next";

const ratelimit = new Ratelimit({
  redis: redis,
  analytics: true,
  limiter: Ratelimit.slidingWindow(2, "5s"),
});
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const identifier = "api";
  const result = await ratelimit.limit(identifier);
  res.setHeader("X-RateLimit-Limit", result.limit);
  res.setHeader("X-RateLimit-Remaining", result.remaining);

  if (!result.success) {
    res.status(200).json({
      message: "The request has been rate limited.",
      rateLimitState: result,
    });
    return;
  }

  res.status(200).json({ name: "John Doe", rateLimitState: result });
}
