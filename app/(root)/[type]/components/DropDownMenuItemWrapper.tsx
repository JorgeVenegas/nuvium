import { constructDownloadUrl } from "@/lib/utils";
import { ActionType } from "@/types";
import Link from "next/link";
import { Models } from "node-appwrite";
import React from "react";

const DropDownMenuItemWrapper = ({
  file,
  actionItem,
  children,
}: {
  file: Models.Document;
  actionItem: ActionType;
  children: React.ReactNode;
}) => (
  <>
    {actionItem.value === "download" ? (
      <Link
        href={constructDownloadUrl(file.bucketFileId)}
        download={file.name}
        className="flex items-center gap-2"
      >
        {children}
      </Link>
    ) : (
      <div className="flex items-center gap-2">{children}</div>
    )}
  </>
);

export default DropDownMenuItemWrapper;
