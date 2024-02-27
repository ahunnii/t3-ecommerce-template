import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string().min(1) : z.string().url()
    ),
    // Add `.min(1) on ID and SECRET if you want to make sure they're not empty

    NEXT_PUBLIC_ENCRYPTION_KEY: z.string().min(32),
    NEXT_PUBLIC_STORE_ID: z.string(),
    EASYPOST_API_KEY: z.string(),
    SHIPPO_API_KEY: z.string(),
    NEXT_PUBLIC_SITE_DIRECTORY: z.string(),
    NEXT_PUBLIC_STORE_NAME: z.string(),

    SHOP_EMAIL: z.string().email(),
    NEXT_PUBLIC_API_URL: z.string().url(),

    NEXT_PUBLIC_URL: z.string().url(),
    NEXT_PUBLIC_STORE_TYPE: z.enum(["core", "custom"]),
    NEXT_PUBLIC_WORDPRESS_API_ENDPOINT: z.string().url().optional(),

    // Payment Processing
    STRIPE_WEBHOOK_SECRET: z.string(),
    NEXT_PUBLIC_STRIPE_PK: z.string(),
    STRIPE_SK: z.string(),
    NEXT_PUBLIC_STRIPE_PAYMENT_INTENT_URL: z.string().url().optional(),

    PAYPAL_CLIENT_ID: z.string(),
    PAYPAL_CLIENT_SECRET: z.string(),
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: z.string(),

    // Email
    RESEND_API_KEY: z.string(),
    NEXT_PUBLIC_EMAIL_SERVICE: z.string().optional(),

    //Toasts
    NEXT_PUBLIC_TOAST_SERVICE: z.string().optional(),

    //Authentication
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),
    // AUTH0_CLIENT_ID: z.string(),
    // AUTH0_CLIENT_SECRET: z.string(),
    // AUTH0_ISSUER: z.string(),
    //End Authentication

    // Uploads
    NEXT_PUBLIC_CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z.string().optional(),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
    UPLOADTHING_SECRET: z.string(),
    NEXT_PUBLIC_UPLOADTHING_APP_ID: z.string().optional(),

    //End Uploads

    // Logging
    NEXT_PUBLIC_AXIOM_TOKEN: z.string().optional(),
    NEXT_PUBLIC_AXIOM_DATASET: z.string().optional(),
    REDIS_URL: z.string().url().optional(),
    REDIS_TOKEN: z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
    NEXT_PUBLIC_ENCRYPTION_KEY: z.string().min(32),
    NEXT_PUBLIC_STORE_ID: z.string(),
    NEXT_PUBLIC_SITE_DIRECTORY: z.string(),
    NEXT_PUBLIC_STORE_NAME: z.string(),
    NEXT_PUBLIC_API_URL: z.string().url(),

    NEXT_PUBLIC_URL: z.string().url(),
    NEXT_PUBLIC_STORE_TYPE: z.enum(["core", "custom"]),
    NEXT_PUBLIC_WORDPRESS_API_ENDPOINT: z.string().url().optional(),

    // Payment Processing
    NEXT_PUBLIC_STRIPE_PAYMENT_INTENT_URL: z.string().url().optional(),
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: z.string(),

    // Email
    NEXT_PUBLIC_EMAIL_SERVICE: z.string().optional(),

    //Toasts
    NEXT_PUBLIC_TOAST_SERVICE: z.string().optional(),

    // Uploads
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z.string().optional(),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
    NEXT_PUBLIC_UPLOADTHING_APP_ID: z.string().optional(),
    NEXT_PUBLIC_CLOUDINARY_API_KEY: z.string().optional(),

    // Logging
    NEXT_PUBLIC_AXIOM_TOKEN: z.string().optional(),
    NEXT_PUBLIC_AXIOM_DATASET: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,

    NEXT_PUBLIC_ENCRYPTION_KEY: process.env.NEXT_PUBLIC_ENCRYPTION_KEY,
    NEXT_PUBLIC_STORE_ID: process.env.NEXT_PUBLIC_STORE_ID,
    EASYPOST_API_KEY: process.env.EASYPOST_API_KEY,
    SHIPPO_API_KEY: process.env.SHIPPO_API_KEY,
    NEXT_PUBLIC_SITE_DIRECTORY: process.env.NEXT_PUBLIC_SITE_DIRECTORY,
    NEXT_PUBLIC_STORE_NAME: process.env.NEXT_PUBLIC_STORE_NAME,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    SHOP_EMAIL: process.env.SHOP_EMAIL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,

    NEXT_PUBLIC_STORE_TYPE: process.env.NEXT_PUBLIC_STORE_TYPE,
    NEXT_PUBLIC_WORDPRESS_API_ENDPOINT:
      process.env.NEXT_PUBLIC_WORDPRESS_API_ENDPOINT,

    // Payment Processing
    NEXT_PUBLIC_STRIPE_PAYMENT_INTENT_URL:
      process.env.NEXT_PUBLIC_STRIPE_PAYMENT_INTENT_URL,
    NEXT_PUBLIC_STRIPE_PK: process.env.NEXT_PUBLIC_STRIPE_PK,
    STRIPE_SK: process.env.STRIPE_SK,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,

    // Email
    NEXT_PUBLIC_EMAIL_SERVICE: process.env.NEXT_PUBLIC_EMAIL_SERVICE,

    //Toasts
    NEXT_PUBLIC_TOAST_SERVICE: process.env.NEXT_PUBLIC_TOAST_SERVICE,

    //Authentication
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    // AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    // AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    // AUTH0_ISSUER: process.env.AUTH0_ISSUER,
    //End Authentication

    // Uploads
    NEXT_PUBLIC_CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET:
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_UPLOADTHING_APP_ID: process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,

    // Logging
    NEXT_PUBLIC_AXIOM_TOKEN: process.env.NEXT_PUBLIC_AXIOM_TOKEN,
    NEXT_PUBLIC_AXIOM_DATASET: process.env.NEXT_PUBLIC_AXIOM_DATASET,
    REDIS_URL: process.env.REDIS_URL,
    REDIS_TOKEN: process.env.REDIS_TOKEN,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
