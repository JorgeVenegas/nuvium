import { MainSpaceChart } from "@/app/(root)/components/MainSpaceChart";
import RecentPosts from "@/app/(root)/components/RecentPosts";
import { getFiles, getTotalSpacedUsed } from "@/lib/actions/file.actions";
import { convertFileSize, getUsageSummary } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [files, storageDetails] = await Promise.all([
    getFiles({ limit: 10 }),
    getTotalSpacedUsed(),
  ]);

  const usageSummary = getUsageSummary(storageDetails.data);
  return (
    <div className="flex md:flex-row flex-col gap-10 xl:gap-10 max-w-7xl mx-auto items-stretch">
      <div className="flex flex-col gap-10 xl:gap-14 flex-1">
        <MainSpaceChart storageDetails={storageDetails.data} />
        <ul className="grid md:grid-cols-1 gap-10 xl:gap-14 xl:grid-cols-2 grid-cols-2">
          {usageSummary.map((type) => (
            <Link
              href={type.url}
              key={type.title}
              className="relative bg-white rounded-3xl shadow-drop-4 p-6 flex items-center gap-4 hover:scale-105 transition-all"
            >
              <Image
                src={type.icon}
                alt={`${type.title} icon`}
                width={150}
                height={150}
                className="absolute -left-2.5 -top-5 z-10"
              />
              <div className="flex flex-col text-end justify-center items-end w-full z-50">
                <h2 className="sm:h2 h3 text-light-100">{type.title}</h2>
                <h4 className="sm:subtitle-1 sutitle-2 text-light-200">
                  {type.files} files • {convertFileSize(type.size)}
                </h4>
              </div>
            </Link>
          ))}
        </ul>
      </div>
      <div className="flex-1 ">
        <RecentPosts files={files.data} />
      </div>
    </div>
  );
}
