"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import {
  constructFileUrl,
  getFileType,
  handleError,
  parseStringify,
} from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { ID } from "node-appwrite";

interface UploadFilesParams {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
}

export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFilesParams) => {
  try {
    const { storage, databases } = await createAdminClient();

    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      file
    );

    const { type, extension } = getFileType(file.name);

    const uploadedFileMetadata = {
      name: file.name,
      url: constructFileUrl(bucketFile.$id),
      type,
      bucketFileId: bucketFile.$id,
      accountId,
      owner: ownerId,
      extension,
      size: bucketFile.sizeOriginal,
      users: [],
    };

    const uploadedDocument = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        uploadedFileMetadata
      )
      .catch(async (error) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        handleError(error, "Failed to create file document");
      });

    revalidatePath(path);
    console.log("document is:");
    console.log(uploadedDocument);
    return parseStringify(uploadedDocument);
  } catch (error) {
    handleError(error, "Failed to upload file");
  }
};
