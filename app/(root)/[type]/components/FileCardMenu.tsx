"use client";

import ActionDropdown from "@/app/(root)/[type]/components/ActionDropdown";
import DialogContentSelector from "@/app/(root)/[type]/components/DialogContentSelector";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { renameFile } from "@/lib/actions/file.actions";
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

  const path = usePathname();

  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);
    let success = false;

    const actions = {
      rename: () =>
        renameFile({ file, newName: name, extension: file.extension, path }),
    };

    success = await actions[action.value as keyof typeof actions]();

    if (success) closeModal();

    setIsLoading(false);
  };

  const onActionSelect = (actionItem: ActionType) => {
    setAction(actionItem);
    if (["rename", "share", "delete", "details"].includes(actionItem.value))
      setIsModalOpen(true);
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
            <DialogContentSelector
              action={action}
              file={file}
              name={name}
              setName={setName}
            />
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
