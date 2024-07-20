"use client";
import { getFunnel, getSubaccountDetails } from "@/lib/queries";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Trash } from "lucide-react";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe/stripe-client";
import Loading from "@/components/global/loading";

type Props = { element: EditorElement };

const Checkout = ({ element }: Props) => {
  const { dispatch, state, subaccountId, funnelId, pageDetails } = useEditor();
  const router = useRouter();
  const [clientSecret, setClientSecret] = React.useState("");
  const [livePrices, setLivePrices] = React.useState([]);
  const [subAccountConnectAccId, setSubAccountConnectAccId] =
    React.useState("");

  const styles = element.styles;

  const options = useMemo(
    () => ({
      clientSecret,
    }),
    [clientSecret]
  );

  useEffect(() => {
    if (!subaccountId) return;

    const fetchData = async () => {
      const response = await getSubaccountDetails(subaccountId);
      if (!response) return;
      if (response.connectAccountId)
        setSubAccountConnectAccId(response.connectAccountId);
    };

    fetchData();
  }, [subaccountId]);

  useEffect(() => {
    if (!funnelId) return;
    const fetchData = async () => {
      const response = await getFunnel(funnelId);
      setLivePrices(JSON.parse(response?.liveProducts || "[]"));
    };
    fetchData();
  }, [funnelId]);

  useEffect(() => {
    if (livePrices.length && subaccountId && subAccountConnectAccId) {
      const getClientSecret = async () => {
        try {
          const body = JSON.stringify({
            setSubAccountConnectAccId,
            prices: livePrices,
            subaccountId,
          });

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}api/stripe/create-checkout-session`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body,
            }
          );

          const reponseJson = await response.json();

          if (!reponseJson) throw new Error("No response from server");

          if (reponseJson.error) throw new Error(reponseJson.error);

          if (reponseJson.clientSecret) {
            setClientSecret(reponseJson.clientSecret);
          }
        } catch (err) {
          toast({
            open: true,
            className: "z-[100000]",
            variant: "destructive",
            title: "Opps!",
            // @ts-ignore
            description: err.message,
          });
        }
      };

      getClientSecret();
    }
  }, [livePrices, subAccountConnectAccId, subaccountId]);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    type: string
  ) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  const goToNextPage = async () => {
    if (!state.editor.liveMode) return;
    const funnelPages = await getFunnel(funnelId);
    if (!funnelPages || !pageDetails) return;
    if (funnelPages.FunnelPages.length > pageDetails.order + 1) {
      const nextPage = funnelPages.FunnelPages.find(
        (page) => page.order === pageDetails.order + 1
      );
      if (!nextPage) return;
      router.replace(
        `${process.env.NEXT_PUBLIC_SCHEME}${funnelPages.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${nextPage.pathName}`
      );
    }
  };

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  return (
    <div
      style={styles}
      draggable
      onDragStart={(e) => handleDragStart(e, "contactForm")}
      onClick={handleOnClickBody}
      className={cn(
        "p-[2px] w-full m-[5px] relative text-[16px] transition-all flex items-center justify-center",
        {
          "!border-blue-500": state.editor.selectedElement.id === element.id,

          "!border-solid": state.editor.selectedElement.id === element.id,
          "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
        }
      )}
    >
      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg ">
            {state.editor.selectedElement.name}
          </Badge>
        )}
      <div className="border-none transition-all w-full">
        <div className="flex flex-col gap-4 w-full">
          {options.clientSecret && subAccountConnectAccId && (
            <div className="text-white">
              <EmbeddedCheckoutProvider
                stripe={getStripe(subAccountConnectAccId)}
                options={options}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          )}

          {!options.clientSecret && (
            <div className="flex items-center justify-center w-full h-40">
              <Loading />
            </div>
          )}
        </div>
      </div>
      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
            <Trash
              className="cursor-pointer"
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  );
};

export default Checkout;
