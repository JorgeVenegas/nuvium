import FileCard from "@/app/(root)/[type]/components/FileCard";
import { getFiles } from "@/lib/actions/file.actions";
import { FileType } from "@/types";
import { Models } from "node-appwrite";

interface FileTypePageProps {
  params: Promise<{ type: FileType }>;
}

const Page = async ({ params }: FileTypePageProps) => {
  const type = ((await params).type as string) || "";

  const { data: files } = await getFiles();
  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>
        <div className="total-size-section">
          <p className="body-1">
            Total: <span className="h5">0 MB</span>
          </p>
          <div className="sort-container">
            <p className="body-1 hidden text-light-200 sm:block">Sort by:</p>
            Sort
          </div>
        </div>
      </section>

      {files.total > 0 ? (
        <section className="file-list">
          {files.documents.map((file: Models.Document) => (
            <FileCard key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p>No uploaded files.</p>
      )}
    </div>
  );
};

export default Page;
