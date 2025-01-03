import { getFile } from "@/lib/actions/file.actions";
import { PageParams } from "@/types";
import React, { FC } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar, File, HardDrive, User } from "lucide-react";
import { convertFileSize, formatDateTime, getFileType } from "@/lib/utils";
import Image from "next/image";
import FileCardMenu from "@/app/(root)/[type]/components/FileCardMenu";

const Page = async ({ params }: PageParams) => {
  const fileId = (await params).fileId;

  const { data: file } = await getFile({ fileId });

  const PropertySection: FC<{
    label: string;
    value: string;
    icon: React.ReactNode;
  }> = ({ label, value, icon }) => (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-2">
        <span className="p-3 bg-brand/20 rounded-full">{icon}</span>
        <span className="subtitle-2 text-light-200">{value}</span>
      </div>
    </div>
  );
  return (
    <div className="flex w-full flex-col items-start gap-5">
      <Card className="w-full shadow-drop-3">
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex justify-between">
            <h3 className="h3 text-light-100">{file.name}</h3>
            <FileCardMenu file={file} />
          </div>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 max-w-3xl">
            <PropertySection
              label="Type"
              value={getFileType(file.name).type}
              icon={<File className="size-5 text-brand" />}
            />
            <PropertySection
              label="Size"
              value={convertFileSize(file.size)}
              icon={<HardDrive className="size-5 text-brand" />}
            />
            <PropertySection
              label="Owner"
              value={file.owner.fullName}
              icon={<User className="size-5 text-brand" />}
            />
            <PropertySection
              label="Last updated"
              value={formatDateTime(file.$updatedAt)}
              icon={<Calendar className="size-5 text-brand" />}
            />
          </div>
        </CardContent>
      </Card>
      <div className="flex w-full justify-center rounded-[20px] bg-white p-4 shadow-drop-3">
        <Image
          src={file.url}
          alt={file.name}
          width={1000}
          height={1000}
          className="h-full rounded-[20px]"
        />
      </div>
    </div>
  );
};

export default Page;
