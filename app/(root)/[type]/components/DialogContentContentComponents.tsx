import FormattedDateTime from "@/app/(root)/components/FormattedDateTime";
import Thumbnail from "@/app/(root)/components/Thumbnail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { convertFileSize, formatDateTime, getFileType } from "@/lib/utils";
import Image from "next/image";
import { Models } from "node-appwrite";
import { Dispatch, SetStateAction } from "react";

const ImageThumbnail = ({ file }: { file: Models.Document }) => (
  <div className="file-details-thumbnail">
    <Thumbnail type={file.type} extension={file.extension} url={file.url} />
    <div className="flex flex-col items-start">
      <p className="subtitle-2 mb-1">{file.name}</p>
      <FormattedDateTime className="caption" date={file.$createdAt} />
    </div>
  </div>
);

const PropertyRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex text-left">
    <p className="file-details-label">{label}</p>
    <p className="file-details-value">{value}</p>
  </div>
);

export const RenameFile = ({
  name,
  setName,
}: {
  name: string;
  setName: (name: string) => void;
}) => {
  return (
    <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
  );
};

export const FileDetais = ({ file }: { file: Models.Document }) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <PropertyRow label="Type" value={getFileType(file.name).type} />
      <PropertyRow label="Size" value={convertFileSize(file.size)} />
      <PropertyRow label="Owner" value={file.owner.fullName} />
      <PropertyRow
        label="Last updated"
        value={formatDateTime(file.$updatedAt)}
      />
    </>
  );
};

export const ShareInput = ({
  file,
  onInputChange,
  onRemoveUser,
}: {
  file: Models.Document;
  onInputChange: Dispatch<SetStateAction<string[]>>;
  onRemoveUser: (email: string) => void;
}) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className="share-wrapper">
        <p className="subtitle-2 text-light-100">Share files with others</p>
        <Input
          type="text"
          placeholder="Enter email address"
          onChange={(e) => {
            onInputChange(e.target.value.trim().split(","));
          }}
          className="share-input-field"
        />
        <div className="pt-4">
          <div className="flex justify-between">
            <p className="subtitle-2 text-light-100">Shared with</p>
            <p className="subtitle-2 text-light-200">
              {file.users.length} users
            </p>
          </div>

          <ul className="pt-2">
            {file.users.map((email: string) => (
              <li
                key={email}
                className="flex items-center justify-between gap-2"
              >
                <p className="caption">{email}</p>
                <Button
                  className="share-remove-user"
                  onClick={() => onRemoveUser(email)}
                >
                  <Image
                    src="assets/icons/remove.svg"
                    width={16}
                    height={16}
                    alt="close"
                  />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export const DeleteFile = () => {
  return <div>DeleteFile</div>;
};
