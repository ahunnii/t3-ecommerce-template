import type { NextApiRequest, NextApiResponse } from "next";

import { gql, GraphQLClient } from "graphql-request";

import { getSession } from "next-auth/react";
import { hygraphClient } from "~/server/hygraph/client";

// const UpdateNextAuthUser = gql`
//   mutation UpdateNextAuthUser($userId: ID!, $name: String, $bio: String) {
//     user: updateNextAuthUser(
//       data: { name: $name, bio: $bio }
//       where: { id: $userId }
//     ) {
//       id
//       name
//       email
//       bio
//     }
//   }
// `;

type AboutPageResponse = {
  abouts: {
    id: string;
    content: string;
  }[];
};
const hygraph = new GraphQLClient(
  "https://us-east-1-shared-usea1-02.cdn.hygraph.com/content/clu7v2u9q0euu07w7ppzikbsr/master"
);
const AboutPageHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { storeId } = req.query;

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ message: "Method not allowed" });
  }

  //   if (req.method === "GET") {
  const cmsResponse = await hygraph.request(
    `
        {
            abouts {
                    id
                    content
            }
        }
    `
  );

  console.log(cmsResponse);

  const aboutContent = (cmsResponse as AboutPageResponse)?.abouts?.[0]?.content;
  res.status(200).json(aboutContent);
  //   }

  //   const adminAuthorized = session?.user?.role === "ADMIN";

  //   if(req.method === "POST") {
  //     const session = await getSession({ req });
  //     if (!session || session.user?.role !== "ADMIN") {
  //       return res.status(401).json({ error: "Unauthorized" });
  //     }
  //     const { user } = await hygraphClient.request(UpdateNextAuthUser, {
  //         userId: session.userId,
  //         name,
  //         bio,
  //       });

  //     }

  // Get the about content from the store data

  // Return the about content
};

export default AboutPageHandler;
