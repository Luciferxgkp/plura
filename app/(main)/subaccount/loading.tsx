import Loading from "@/components/global/loading";
import React from "react";

type Props = {};

const LoadingAgencyPage = (props: Props) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Loading />
    </div>
  );
};

export default LoadingAgencyPage;
