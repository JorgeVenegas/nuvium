"use client";

import FormattedDateTime from "@/app/(root)/components/FormattedDateTime";
import Thumbnail from "@/app/(root)/components/Thumbnail";
import { Input } from "@/components/ui/input";
import { getFiles } from "@/lib/actions/file.actions";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Models } from "node-appwrite";
import React, { useEffect, useState } from "react";

const Search = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState("");
  const [viewSearchResults, setViewSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Models.Document[]>([]);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const fetchFiles = async () => {
      if (query.length === 0) {
        setSearchResults([]);
        setViewSearchResults(false);
        return router.push(path.replace(searchParams.toString(), ""));
      }
      const { data: files } = await getFiles({ query });
      setViewSearchResults(true);
      setSearchResults(files.documents);
      console.log("query", query);
      console.log("files", files);
    };

    fetchFiles();
  }, [query]);

  useEffect(() => {
    if (!searchQuery) setQuery("");
  }, [searchQuery]);

  const handleClickItem = () => {
    
  }
  return (
    <div className="relative w-full">
      <div className="flex h-[52px] flex-1 items-center gap-3 rounded-full shadow-drop-3 px-4">
        <Image
          src={"/assets/icons/search.svg"}
          alt="Search"
          width={24}
          height={24}
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="body-2 shad-no-focus border-none shadow-none placeholder:body-1 w-full p-0 placeholder:text-light-200"
        />

        {viewSearchResults && (
          <ul className="absolute left-0 top-16 z-50 w-full rounded-[20px] gap-2 bg-white p-2 flex flex-col">
            {searchResults.length > 0 ? (
              searchResults.map((file) => (
                <li
                  key={file.$id}
                  className="flex items-center cursor-pointer hover:bg-muted rounded-[10px] p-3 px-5 gap-4"
                >
                  <Thumbnail
                    type={file.type}
                    extension={file.extension}
                    url={file.url}
                    className="!size-8 !min-w-8"
                  />
                  <p className="flex-1 line-clamp-1 subtitle-2 text-light-100">{file.name}</p>
                  <FormattedDateTime date={file.$createdAt} className="caption whitespace-nowrap text-light-200"/>
                </li>
              ))
            ) : (
              <p className="body-2 text-center text-light-200 p-2">No matching results</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
