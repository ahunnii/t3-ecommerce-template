import { gql } from "graphql-request";

export const updatePage = gql`
  mutation updatePage($content: String, $slug: String, $title: String) {
    updatePage(
      data: { content: $content, title: $title }
      where: { slug: $slug }
    ) {
      id
      title
      content
      slug
      updatedAt
    }
    publishPage(where: { slug: $slug }) {
      id
      title
      content
      slug
      updatedAt
    }
  }
`;

export const getPage = gql`
  query getPage($slug: String) {
    page(where: { slug: $slug }) {
      id
      title
      content
      slug
      updatedAt
    }
  }
`;

export const getPages = gql`
  query getPages {
    pages {
      id
      content
      title
      slug
      updatedAt
    }
  }
`;
