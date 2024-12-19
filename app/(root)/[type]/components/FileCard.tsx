import FileCardMenu from "@/app/(root)/[type]/components/FileCardMenu";
import FormattedDateTime from "@/app/(root)/components/FormattedDateTime";
import Thumbnail from "@/app/(root)/components/Thumbnail";
import { Badge } from "@/components/ui/badge";
import { convertFileSize } from "@/lib/utils";
import Link from "next/link";
import { Models } from "node-appwrite";
import React from "react";

interface fileCardProps {
  file: Models.Document;
}

const FileCard = ({ file }: fileCardProps) => {
  return (
    <Link href={file.url} target="_blank" className="file-card">
      <div className="flex items-start justify-between">
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={file.url}
          className="!size-20"
          imageClassName="!size-11"
        />

        <FileCardMenu file={file} />
      </div>
      <div className="file-card-details">
        <div className="flex justify-between">
          <p className="subtitle-2 line-clamp-1">{file.name}</p>
          <Badge className="whitespace-nowrap">
            {convertFileSize(file.size)}
          </Badge>
        </div>
        <FormattedDateTime
          date={file.$createdAt}
          className="body-2 text-light-100"
        />
        <p className="caption line-clamp-1 text-light-200">
          By: {file.owner.fullName}
        </p>
      </div>
    </Link>
  );
};

export default FileCard;
