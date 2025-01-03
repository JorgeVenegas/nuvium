import FileCard from "@/app/(root)/[type]/components/FileCard";
import { getFiles } from "@/lib/actions/file.actions";
import { getFileTypesParams } from "@/lib/utils";
import { FileType, PageParams } from "@/types";
import { Models } from "node-appwrite";
import Sort from "./components/Sort";

const Page = async ({ searchParams, params }: PageParams) => {
  const type = (await params).type || "";
  const query = ((await searchParams)?.query as string) || "";
  const sort = ((await searchParams)?.sort as string) || undefined;

  const types = getFileTypesParams(type) as FileType[];

  const { data: files } = await getFiles({ types, query, sort });
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
            <Sort />
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
