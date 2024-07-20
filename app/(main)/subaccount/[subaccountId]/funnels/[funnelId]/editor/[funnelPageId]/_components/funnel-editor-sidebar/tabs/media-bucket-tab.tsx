"use client";
import MediaComponent from "@/components/media";
import { getMedia } from "@/lib/queries";
import { GetMediaFiles } from "@/lib/types";
import React, { useEffect } from "react";

type Props = {
  subaccountId: string;
};

const MediaBucketTab = ({ subaccountId }: Props) => {
  const [data, setData] = React.useState<GetMediaFiles>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getMedia(subaccountId);
      setData(response);
    };
    fetchData();
  }, []);
  return (
    <div className="h-[900px] overflow-scroll p-4">
      <MediaComponent data={data} subaccountId={subaccountId} />
    </div>
  );
};

export default MediaBucketTab;
