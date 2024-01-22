import { env } from "~/env.mjs";

const API_URL = env.NEXT_PUBLIC_WORDPRESS_API_ENDPOINT!;

export async function fetchAPI(
  query = "",
  { variables }: Record<string, unknown> = {}
) {
  const headers = { "Content-Type": "application/json" };

  const res = await fetch(API_URL, {
    headers,
    method: "POST",
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();

  if (json.errors) {
    console.error(json.errors);
    throw new Error("Failed to fetch API");
  }
  return json.data;
}
