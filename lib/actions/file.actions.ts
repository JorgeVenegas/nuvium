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
import { ServerResponseType } from "@/types";
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
}: UploadFileParams): Promise<ServerResponseType> => {
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
    return parseStringify({
      message: "File uploaded successfully",
      responseStatus: "success",
      data: uploadedDocument,
    });
  } catch (error) {
    return parseStringify({
      message: "Failed to upload file. Error found: " + error,
      responseStatus: "error",
    });
  }
};

interface CreateQueriesParams {
  currentUser: Models.Document;
}

const createQueries = ({ currentUser }: CreateQueriesParams) => {
  const queries = [
    Query.or([
      Query.equal("owner", currentUser.$id),
      Query.contains("users", currentUser.email),
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

    return parseStringify({
      message: "File retrieved successfully",
      responseStatus: "success",
      data: files,
    });
  } catch (error) {
    return parseStringify({
      message: "Failed to rename file. Error found: " + error,
      responseStatus: "error",
    });
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
}: RenameFileParams): Promise<ServerResponseType> => {
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
    return parseStringify({
      message: "File renamed successfully",
      responseStatus: "success",
      data: updatedFile,
    });
  } catch (error) {
    return parseStringify({
      message: "Failed to rename file. Error found: " + error,
      responseStatus: "error",
    });
  }
};

interface setFileUsersProps {
  action: "add" | "remove";
  file: Models.Document;
  emails: string[];
  path: string;
}

export const updateFileUsers = async ({
  action = "add",
  file,
  emails,
  path,
}: setFileUsersProps): Promise<ServerResponseType> => {
  let newEmails: string[] = [];

  if (action === "add") {
    if (emails.length === 0) {
      return parseStringify({
        message: "Please enter a valid email addresses",
        responseStatus: "error",
      });
    }

    newEmails = [...new Set([...file.users, ...emails])];
  } else if (action === "remove") {
    newEmails = file.users.filter((email: string) => emails[0] !== email);
  }

  const { databases } = await createAdminClient();

  try {
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      file.$id,
      { users: newEmails }
    );

    revalidatePath(path);

    return parseStringify({
      message: "File sharing preferences updated successfully.",
      responseStatus: "success",
      data: updatedFile,
    });
  } catch (error) {
    return parseStringify({
      message:
        "Failed to update file sharing preferences. Error found: " + error,
      responseStatus: "error",
    });
  }
};

interface DeleteFileParams {
  file: Models.Document;
  path: string;
}

export const deleteFile = async ({
  file,
  path,
}: DeleteFileParams): Promise<ServerResponseType> => {
  const { databases, storage } = await createAdminClient();
  try {
    const deletedFile = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      file.$id
    );

    if (deletedFile) {
      await storage.deleteFile(appwriteConfig.bucketId, file.bucketFileId);
    }

    revalidatePath(path);
    return parseStringify({
      message: "File deleted successfully",
      responseStatus: "success",
    });
  } catch (error) {
    return parseStringify({
      message: "Failed to delete file. Error found: " + error,
      responseStatus: "error",
    });
  }
};
