import type { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";

const f = createUploadthing();

const auth = (req: NextApiRequest, res: NextApiResponse) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // // Set permissions and file types for this FileRoute
    // .middleware(async ({ req, res }) => {
    //   console.log(req, res);
    //   const session: Session = await fetch("/api/auth/session", {
    //     method: "GET",
    //   }).then((res) => res.json());

    //   if (!session?.user || session?.user?.role !== "ADMIN") {
    //     throw new Error("Unauthorized");
    //   }
    //   // This code runs on your server before upload
    //   const user = session.user;

    //   // If you throw, the user will not be able to upload
    //   if (!user) throw new Error("Unauthorized");

    //   // Whatever is returned here is accessible in onUploadComplete as `metadata`
    //   return { userId: user.id };
    // })
    // eslint-disable-next-line @typescript-eslint/require-await
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      //   console.log("Upload complete for userId:", metadata?.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { fileUrl: file.url, metadata };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
