"use client";

import ActionDropdown from "@/app/(root)/[type]/components/ActionDropdown";
import {
  FileDetais,
  RenameFile,
  ShareInput,
} from "@/app/(root)/[type]/components/DialogContentContentComponents";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { renameFile, updateFileUsers } from "@/lib/actions/file.actions";
import { ActionType } from "@/types";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Models } from "node-appwrite";
import { useState } from "react";

interface FileCardMenuprops {
  file: Models.Document;
}

const FileCardMenu = ({ file }: FileCardMenuprops) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(file.name);
  const [emails, setEmails] = useState<string[]>([]);
  const { toast } = useToast();

  const path = usePathname();

  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);
    const actions = {
      rename: async () =>
        renameFile({
          file,
          newName: name,
          extension: file.extension,
          path,
        }),
      share: async () => {
        const validEmails = handleEmailValidation();
        return updateFileUsers({
          action: "add",
          file,
          emails: validEmails,
          path,
        });
      },
    };

    const { message, responseStatus } =
      await actions[action.value as keyof typeof actions]();

    if (responseStatus === "success") {
      toast({
        description: (
          <p className="body-2 text-white">
            <span className="font-semibold">{message}</span>
          </p>
        ),
        className: "success-toast",
      });
      if (["rename", "delete"].includes(action.value)) closeModal();
    }

    setIsLoading(false);
  };

  const onActionSelect = (actionItem: ActionType) => {
    setAction(actionItem);
    if (["rename", "share", "delete", "details"].includes(actionItem.value))
      setIsModalOpen(true);
  };

  const handleEmailValidation = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = emails.filter((email) => {
      const isValid = emailRegex.test(email);
      if (!isValid)
        toast({
          description: (
            <p className="body-2 text-white">
              <span className="font-semibold">{email}</span> is not a valid
              email.
            </p>
          ),
          className: "error-toast",
        });
      return isValid;
    });
    return validEmails;
  };

  const handleUnshareFile = async (email: string) => {
    const { message, responseStatus } = await updateFileUsers({
      action: "remove",
      file,
      emails: [email],
      path,
    });

    if (responseStatus === "success") {
      toast({
        description: (
          <p className="body-2 text-white">
            <span className="font-semibold">{message}</span>
          </p>
        ),
        className: "success-toast",
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAction(null);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <ActionDropdown file={file} onActionSelect={onActionSelect} />
      {action && (
        <DialogContent className="shad-dialog button">
          <DialogHeader className="flex flex-col gap-3">
            <DialogTitle>{action.label}</DialogTitle>
            {action.value === "rename" && (
              <RenameFile name={name} setName={setName} />
            )}
            {action.value === "details" && <FileDetais file={file} />}
            {action.value === "share" && (
              <ShareInput
                file={file}
                onInputChange={setEmails}
                onRemoveUser={handleUnshareFile}
              />
            )}
            {action.value === "delete" && <p></p>}
          </DialogHeader>
          {["rename", "delete", "share"].includes(action.value) && (
            <DialogFooter className="flex flex-col gap-3 md:flex-row">
              <Button onClick={closeModal} className="modal-cancel-button">
                Cancel
              </Button>
              <Button onClick={handleAction} className="modal-submit-button">
                <p className="capitalize">{action.value}</p>
                {isLoading && (
                  <Image
                    src="/assets/icons/loader.svg"
                    alt="loader"
                    width={24}
                    height={24}
                    className="animate-spin"
                  />
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
};

export default FileCardMenu;
