import { db } from "@/lib/db";
import EditorProvider from "@/providers/editor/editor-provider";
import { redirect } from "next/navigation";
import React from "react";
import FunnelEditorNavigator from "./_components/funnel-editor-navigator";
import FunnelEditorSidebar from "./_components/funnel-editor-sidebar";

type Props = {
  params: {
    funnelId: string;
    subaccountId: string;
    funnelPageId: string;
  };
};

const FunnelPageId = async ({ params }: Props) => {
  const funnelPageDetails = await db.funnelPage.findFirst({
    where: {
      id: params.funnelPageId,
    },
  });

  if (!funnelPageDetails) {
    return redirect(
      `/subaccount/${params.subaccountId}/funnels/${params.funnelId}`
    );
  }

  return (
    <div className="fixed top-[9vh] bottom-0 left-0 right-0 bg-background overflow-hidden z-[100]">
      <EditorProvider
        subaccountId={params.subaccountId}
        funnelId={params.funnelId}
        pageDetails={funnelPageDetails}
      >
        <FunnelEditorNavigator
          funnelId={params.funnelId}
          funnelPageDetails={funnelPageDetails}
          subaccountId={params.subaccountId}
        />
        <FunnelEditorSidebar subaccountId={params.subaccountId} />
      </EditorProvider>
    </div>
  );
};

export default FunnelPageId;
