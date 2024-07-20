'use client';
import SubscriptionFormWrapper from "@/components/forms/subscription-form/subscription-form-wrapper";
import CustomModal from "@/components/global/custom-modal";
import { PricesList } from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

type Props = {
  prices: PricesList["data"];
  customerId: string;
  planExists: boolean;
};

const SubscriptionHelper = (props: Props) => {
  const { setOpen } = useModal();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  useEffect(() => {
    if (plan) {
      setOpen(
        <CustomModal
          title="Upgrade Plan"
          subheading="Get started with our premium plan"
        >
          <SubscriptionFormWrapper
            planExists={props.planExists}
            customerId={props.customerId}
          />
        </CustomModal>,

        async () => ({
          plans: {
            defaultPriceId: plan ? plan : null,
            plans: props.prices,
          },
        })
      );
    }
  }, [plan]);
  return <div>SubscriptionHelper</div>;
};

export default SubscriptionHelper;
