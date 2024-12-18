import { cn, getFileIcon } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface ThumbnailProps {
  type: string;
  extension: string;
  url?: string;
  className?: string;
  imageClassName?: string;
}

const Thumbnail = ({
  type,
  extension,
  url = "",
  className,
  imageClassName,
}: ThumbnailProps) => {
  const isImage = type === "image" && extension !== "svg";

  return (
    <figure className={cn("thumbnail", className)}>
      <Image
        src={isImage ? url : getFileIcon(extension, type)}
        alt="Thumbnail"
        width={100}
        height={100}
        className={cn(
          "size-8 object contain",
          imageClassName,
          isImage && "thumbnail-image"
        )}
      ></Image>
    </figure>
  );
};

export default Thumbnail;
