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
import { FileType, ServerResponseType, StorageSpaceDetails } from "@/types";
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
  types: FileType[];
  query: string;
  sort: string;
}

const createQueries = ({
  currentUser,
  types,
  query,
  sort,
}: CreateQueriesParams) => {
  const queries = [
    Query.or([
      Query.equal("owner", currentUser.$id),
      Query.contains("users", currentUser.email),
    ]),
  ];

  if (types.length > 0) queries.push(Query.equal("type", types));
  if (query) queries.push(Query.contains("name", query));
  if (sort) {
    const [sortBy, orderBy] = sort.split("-");
    queries.push(
      orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy)
    );
  }
  return queries;
};

interface GetFilesParams {
  types?: FileType[];
  query?: string;
  sort?: string;
}

export const getFiles = async ({
  types = [],
  query = "",
  sort = "$createdAt-desc",
}: GetFilesParams) => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("User not found");
    const queries = createQueries({ currentUser, types, query, sort });

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries
    );

    return parseStringify({
      message: "Files retrieved successfully",
      responseStatus: "success",
      data: files,
    });
  } catch (error) {
    return parseStringify({
      message: "Failed to retrieve files. Error found: " + error,
      responseStatus: "error",
    });
  }
};

interface GetFileParams {
  fileId: string;
}

export const getFile = async ({ fileId }: GetFileParams) => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("User not found");

    const file = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    );

    return parseStringify({
      message: "File retrieved successfully",
      responseStatus: "success",
      data: file,
    });
  } catch (error) {
    return parseStringify({
      message: "Failed to retrieve file. Error found: " + error,
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

export const getTotalSpacedUsed = async () => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("User not found");

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      [Query.equal("owner", currentUser.$id)]
    );

    const storageSpaceByType = files.documents.reduce(
      (acc: Record<FileType, number>, file) => {
        if ("type" in file && "size" in file) {
          const fileType = file.type as FileType;
          if (acc[fileType] !== undefined && acc[fileType] !== null)
            acc[fileType] += file.size as number;
        }
        return acc;
      },
      {
        document: 0,
        image: 0,
        video: 0,
        audio: 0,
        other: 0,
      }
    );

    const storageSpaceUsed = Object.values(storageSpaceByType).reduce(
      (total, typeTotal) => (total += typeTotal),
      0
    );

    const totalSpace = 2 * 1024 * 1024 * 1024;

    const storageSpaceDetails: StorageSpaceDetails = {
      total: totalSpace,
      available: totalSpace - storageSpaceUsed,
      used: storageSpaceUsed,
      usedPercentage: ((storageSpaceUsed / totalSpace) * 100).toPrecision(2),
      byType: storageSpaceByType,
    };

    return parseStringify({
      message: "Total space used retrieved successfully",
      responseStatus: "success",
      data: storageSpaceDetails,
    });
  } catch (error) {
    return parseStringify({
      message: "Failed to retrieve total space used. Error found: " + error,
      responseStatus: "error",
    });
  }
};
