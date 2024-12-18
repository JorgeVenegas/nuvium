import DropDownMenuItemWrapper from "@/app/(root)/[type]/components/DropDownMenuItemWrapper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { actionsDropdownItems } from "@/constants";
import { ActionType } from "@/types";
import Image from "next/image";
import { Models } from "node-appwrite";
import React from "react";

interface ActionDropdownProps {
  file: Models.Document;
  onActionSelect: (action: ActionType) => void;
}

const ActionDropdown = ({ file, onActionSelect }: ActionDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="shad-no-focus">
        <Image src="/assets/icons/dots.svg" alt="dots" width={34} height={34} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="max-w-[200px] truncate">
          {file.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actionsDropdownItems.map((actionItem) => (
          <DropdownMenuItem
            key={actionItem.value}
            className="shad-dropdown-item"
            onClick={() => onActionSelect(actionItem)}
          >
            <DropDownMenuItemWrapper file={file} actionItem={actionItem}>
              <Image
                src={actionItem.icon}
                alt={actionItem.label}
                width={30}
                height={30}
              />
              {actionItem.label}
            </DropDownMenuItemWrapper>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionDropdown;
