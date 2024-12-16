"use client";

import Thumbnail from "@/app/(root)/components/Thumbnail";
import { convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface FileUploaderLoaderProps {
  files: File[];
  onRemoveFile: (fileName: string) => void;
}

const FileUploaderLoader = ({
  files,
  onRemoveFile,
}: FileUploaderLoaderProps) => {
  return (
    <>
      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading</h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);
            return (
              <li
                key={`${file.type}-${index}`}
                className="uploader-preview-item"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />

                  <div className="preview-item-name">
                    {file.name}
                    <Image
                      src="/assets/icons/file-loader.gif"
                      alt="Loading"
                      width={80}
                      height={26}
                    />
                  </div>
                </div>

                <Image
                  src="/assets/icons/remove.svg"
                  alt="Remove"
                  width={24}
                  height={24}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(file.name);
                  }}
                />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default FileUploaderLoader;
