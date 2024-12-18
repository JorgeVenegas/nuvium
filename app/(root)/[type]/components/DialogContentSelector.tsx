"use client";
import {
  FileDetais,
  RenameFile,
} from "@/app/(root)/[type]/components/DialogContentContentComponents";
import { ActionType } from "@/types";
import { Models } from "node-appwrite";

interface DialogContentSelectorProps {
  action: ActionType;
  file: Models.Document;
  name: string;
  setName: (name: string) => void;
}

const DialogContentSelector = ({
  action,
  file,
  name,
  setName,
}: DialogContentSelectorProps) => {
  const { value } = action;

  return (
    <>
      {value === "rename" && <RenameFile name={name} setName={setName} />}
      {value === "details" && <FileDetais file={file} />}
      {value === "share" && <p></p>}
      {value === "delete" && <p></p>}
    </>
  );
};

export default DialogContentSelector;
