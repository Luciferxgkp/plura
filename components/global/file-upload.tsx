import Image from "next/image";
import React from "react";
type Props = {
  apiEndpoint: "agencyLogo" | "avatar" | "subaccountLogo";
  onChange: (url?: string) => void;
  value?: string;
};

import { FileIcon, X } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { UploadDropzone } from "@/lib/uploadthings";
const FileUpload = ({ apiEndpoint, onChange, value }: Props) => {
  const type = value?.split(".").pop();

  if (value) {
    return (
      <div className="flex flex-col justify-center items-center">
        {type !== "pdf" ? (
          <div className="relative w-40 h-40">
            <Image
              src={value}
              alt="uploaded image"
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
            <FileIcon />
            <Link
              href={value}
              target="_blank"
              rel="noreferrer noopener"
              className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
            >
              View PDF
            </Link>
          </div>
        )}
        <Button variant={"ghost"} onClick={() => onChange("")}>
          <X className="w-4 h-4" />
          Remove Logo
        </Button>
      </div>
    );
  }
  return (
    <div className="w-full bg-muted/30">
      <UploadDropzone
        endpoint={apiEndpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(err) => {
          console.error(err);
        }}
      />
    </div>
  );
};

export default FileUpload;