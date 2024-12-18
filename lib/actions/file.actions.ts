"use server";

import { getCurrentUser } from "@/lib/actions/user.actions";
import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import {
  constructFileUrl,
  getFileType,
  handleError,
  parseStringify,
} from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { ID, Models, Query } from "node-appwrite";

interface UploadFileParams {
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
}: UploadFileParams) => {
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

interface CreateQueriesParams {
  currentUser: Models.Document;
}

const createQueries = ({ currentUser }: CreateQueriesParams) => {
  const queries = [
    Query.or([
      Query.equal("owner", currentUser.$id),
      Query.contains("users", currentUser.$id),
    ]),
  ];

  return queries;
};

export const getFiles = async () => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("User not found");
    const queries = createQueries({ currentUser });

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries
    );

    console.log(files);
    return parseStringify({ files });
  } catch (error) {
    handleError(error, "Failed to get files");
  }
};

interface RenameFileParams {
  file: Models.Document;
  newName: string;
  extension: string;
  path: string;
}

export const renameFile = async ({
  file,
  newName,
  extension,
  path,
}: RenameFileParams) => {
  const { databases } = await createAdminClient();
  const newNameWithExtension = `${newName}.${extension}`;
  try {
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      file.$id,
      {
        name: newNameWithExtension,
      }
    );

    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};
