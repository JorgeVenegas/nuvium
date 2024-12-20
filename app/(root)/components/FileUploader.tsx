"use client";

import FileUploaderLoader from "@/app/(root)/components/FileUploaderLoader";
import { useUser } from "@/app/(root)/components/UserProvider";
import { Button } from "@/components/ui/button";
import { MAX_FILE_SIZE_LIMIT } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/actions/file.actions";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Dropzone from "react-dropzone";

const FileUploader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const { accountId, $id } = useUser();
  const { toast } = useToast();
  const path = usePathname();

  const onDrop = async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);

    const uploadPromises = acceptedFiles.map(async (file) => {
      if (file.size > MAX_FILE_SIZE_LIMIT) {
        setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));

        return toast({
          description: (
            <p className="body-2 text-white">
              <span className="font-semibold">
                {file.name.length > 30
                  ? `${file.name.substring(0, 30)}...`
                  : file.name}
              </span>{" "}
              is too large to upload. Max file size limit is 50MB.
            </p>
          ),
          className: "error-toast",
        });
      }
      const { data: uploadedFile } = await uploadFile({
        file,
        accountId,
        ownerId: $id,
        path,
      });
      if (uploadedFile) {
        setFiles((files) =>
          files.filter((file) => file.name !== uploadedFile.name)
        );
      }
    });
    await Promise.all(uploadPromises);
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
                src={"/assets/icons/upload.svg"}
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
