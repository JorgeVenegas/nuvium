import { MainSpaceChart } from "@/app/(root)/components/MainSpaceChart";
import { getFiles, getTotalSpacedUsed } from "@/lib/actions/file.actions";

export default async function Home() {
  const [files, storageDetails] = await Promise.all([
    getFiles({}),
    getTotalSpacedUsed(),
  ]);
  return (
    <div>
      <MainSpaceChart storageDetails={storageDetails.data} />
    </div>
  );
}
