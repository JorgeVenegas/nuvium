"use client";
import { Input } from "@/components/ui/input";
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
  name,
  setName,
}: DialogContentSelectorProps) => {
  const { value } = action;

  return (
    <>
      {value === "rename" && (
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}
      {value === "details" && <p></p>}
      {value === "share" && <p></p>}
      {value === "delete" && <p></p>}
    </>
  );
};

export default DialogContentSelector;
