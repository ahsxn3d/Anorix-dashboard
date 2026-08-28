import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

/**
 * ANORENT Studio UploadThing File Router
 * Defines permission models and file upload endpoints.
 */
export const ourFileRouter = {
  // 1. Project Thumbnail Image Uploader (max 4MB, standard web images)
  projectThumbnail: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      return { uploadTimestamp: Date.now() };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const fileUrl = (file as any).ufsUrl || file.url;
      console.log("[UploadThing] Project Thumbnail upload complete:", fileUrl);
      return { fileUrl, uploadedBy: "superadmin" };
    }),

  // 2. Project Cover Photo / High-Res Showcase (max 8MB)
  projectCover: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      return { uploadTimestamp: Date.now() };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const fileUrl = (file as any).ufsUrl || file.url;
      console.log("[UploadThing] Project Cover upload complete:", fileUrl);
      return { fileUrl, uploadedBy: "superadmin" };
    }),

  // 3. User & Admin Profile Avatar (max 2MB)
  avatarImage: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      return { uploadTimestamp: Date.now() };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const fileUrl = (file as any).ufsUrl || file.url;
      console.log("[UploadThing] Avatar upload complete:", fileUrl);
      return { fileUrl, uploadedBy: "superadmin" };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
