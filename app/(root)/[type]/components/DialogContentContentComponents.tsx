import FormattedDateTime from "@/app/(root)/components/FormattedDateTime";
import Thumbnail from "@/app/(root)/components/Thumbnail";
import { Input } from "@/components/ui/input";
import { convertFileSize, formatDateTime, getFileType } from "@/lib/utils";
import { Models } from "node-appwrite";

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

export const ShareInput = () => {
  return <div>ShareInput</div>;
};

export const DeleteFile = () => {
  return <div>DeleteFile</div>;
};
