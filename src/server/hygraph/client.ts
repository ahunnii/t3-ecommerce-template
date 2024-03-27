import { GraphQLClient } from "graphql-request";
import { env } from "~/env.mjs";

export const hygraphClient = new GraphQLClient(env.HYGRAPH_CONTENT_API_URL, {
  headers: {
    Authorization: `Bearer ${env.HYGRAPH_API_KEY}`,
  },
});

export const hygraphClientPublic = new GraphQLClient(env.HYGRAPH_API_URL);
