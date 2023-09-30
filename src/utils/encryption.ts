/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Crypto from "crypto";
import { env } from "~/env.mjs";

export function encrypt(text: string) {
  const iv = Crypto.randomBytes(16); // generate a random initialization vector
  const cipher = Crypto.createCipheriv(
    "aes-256-cbc",
    env.NEXT_PUBLIC_ENCRYPTION_KEY,
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`; // combine the IV and encrypted text
}

export function decrypt(text: string) {
  const [ivHex, encryptedText] = text.split(":");
  const iv = Buffer.from(ivHex!, "hex");
  const decipher = Crypto.createDecipheriv(
    "aes-256-cbc",
    env.NEXT_PUBLIC_ENCRYPTION_KEY,
    iv
  );
  let decrypted = decipher.update(encryptedText!, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
