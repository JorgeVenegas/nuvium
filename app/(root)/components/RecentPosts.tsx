import FileCardMenu from "@/app/(root)/[type]/components/FileCardMenu";
import FormattedDateTime from "@/app/(root)/components/FormattedDateTime";
import Thumbnail from "@/app/(root)/components/Thumbnail";
import Link from "next/link";
import { Models } from "node-appwrite";
import React from "react";

interface RecentPostsProps {
  files: Models.DocumentList<Models.Document>;
}

const RecentPosts = ({ files }: RecentPostsProps) => {
  return (
    <div className="bg-white rounded-3xl shadow-drop-4 p-4 h-full">
      <h2 className="h2 m-4 text-light-100">Recently Uploaded Files</h2>
      <ul className="flex flex-col gap-2">
        {files.documents.map((file) => (
          <Link
            href={`/view/${file.$id}`}
            key={file.$id}
            className="flex items-center gap-4 p-4 rounded-full hover:bg-muted transition-all"
          >
            <Thumbnail
              type={file.type}
              extension={file.extension}
              url={file.url}
            />
            <div className="flex-1">
              <span className="subtitle-1 line-clamp-1">{file.name}</span>
              <FormattedDateTime
                date={file.$createdAt}
                className="body-2 text-light-200"
              />
            </div>
            <FileCardMenu file={file} />
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default RecentPosts;
