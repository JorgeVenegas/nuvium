import { getFile } from "@/lib/actions/file.actions";
import { PageParams } from "@/types";
import React, { FC } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
        {icon}
        <span className="font-semibold subtitle-2">{label}</span>
      </div>
      <span className="subtitle-3 text-light-100">{value}</span>
    </div>
  );
  return (
    <div className="w-full flex flex-col gap-5 items-start">
      <Card className="w-full shadow-drop-3">
        <CardContent className="flex flex-col p-6 gap-4">
          <div className="flex justify-between">
            <h3 className="h3">{file.name}</h3>
            <FileCardMenu file={file} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <PropertySection
              label="Type"
              value={getFileType(file.name).type}
              icon={<File className="w-5 h-5 text-brand" />}
            />
            <PropertySection
              label="Size"
              value={convertFileSize(file.size)}
              icon={<HardDrive className="w-5 h-5 text-brand" />}
            />
            <PropertySection
              label="Owner"
              value={file.owner.fullName}
              icon={<User className="w-5 h-5 text-brand" />}
            />
            <PropertySection
              label="Last updated"
              value={formatDateTime(file.$updatedAt)}
              icon={<Calendar className="w-5 h-5 text-brand" />}
            />
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center bg-white p-4 rounded-[20px] shadow-drop-3 w-full">
        <Image
          src={file.url}
          alt={file.name}
          width={1000}
          height={1000}
          className="rounded-[20px] h-full"
        />
      </div>
    </div>
  );
};

export default Page;
