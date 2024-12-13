"use client";
import FileUploaderLoader from "@/app/(root)/components/FileUploaderLoader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";
import Dropzone from "react-dropzone";

const FileUploader = () => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = (acceptedFile: File[]) => {
    setFiles(acceptedFile);
    console.log("Updated files");
  };

  const handleRemoveFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };
  return (
    <Dropzone onDrop={onDrop}>
      {({ getRootProps, getInputProps }) => (
        <section>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <Button type="button" className="uploader-button">
              <Image
                src={"assets/icons/upload.svg"}
                alt="Upload File"
                width={24}
                height={24}
              />
              <p>Upload</p>
            </Button>
            <FileUploaderLoader files={files} onRemoveFile={handleRemoveFile} />
          </div>
        </section>
      )}
    </Dropzone>
  );
};

export default FileUploader;
