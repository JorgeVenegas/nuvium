import { Models } from "node-appwrite";

declare type FileType = "document" | "image" | "video" | "audio" | "other";

declare interface ActionType {
  label: string;
  icon: string;
  value: string;
}

declare interface FileMenuDialogContentProps {
  file: Models.Document;
  onClose?: () => void;
}

declare interface ServerResponseType {
  message: string;
  responseStatus: "success" | "error";
  data?: any;
}
