import FunnelEditor from "@/app/(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor";
import { getDomainContent } from "@/lib/queries";
import EditorProvider from "@/providers/editor/editor-provider";
import { notFound } from "next/navigation";

const Index = async ({
  params: { domain, path },
}: {
  params: { domain: string; path: string };
}) => {
  const domainData = await getDomainContent(domain.slice(0, -1));

  if (!domainData) return notFound();
  const pageData = domainData.FunnelPages.find(
    (page) => page.pathName === path
  );

  if (!pageData) return notFound();

  return (
    <EditorProvider
      subaccountId={domainData.subAccountId}
      pageDetails={pageData}
      funnelId={domainData.id}
    >
      <FunnelEditor funnelPageId={pageData.id} liveMode={true} />
    </EditorProvider>
  );
};

export default Index;
