import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { redis } from "~/server/redis/client";

import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { type NextApiRequest, type NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

const ratelimit = new Ratelimit({
  redis: redis,
  analytics: true,
  limiter: Ratelimit.slidingWindow(2, "5s"),
});
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.headers["x-forwarded-for"]);
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
