import Image from "next/image";
import React from "react";

type Props = {};

const CheckoutPlaceholder = (props: Props) => {
  const handleDragStart = (e: React.DragEvent, type: string) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };

  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, "paymentForm")}
      className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center"
    >
      <Image
        src="/stripelogo.png"
        alt="Checkout"
        width={40}
        height={40}
        className="object-cover"
      />
    </div>
  );
};

export default CheckoutPlaceholder;
