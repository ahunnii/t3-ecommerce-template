import { gql } from "graphql-request";

const updateAbout = gql`
  mutation updateAbout($content: String) {
    updateAbout(data: { content: $content }, where: { slug: "about" }) {
      id
      content
    }
    publishAbout(where: { slug: "about" }) {
      content
    }
  }
`;
