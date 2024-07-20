import { EditorElement } from "@/providers/editor/editor-provider";
import React from "react";
import TextComponent from "./text";
import Container from "./container";
import VideoComponent from "./video";
import LinkComponent from "./link";
import TwoColumns from "./two-column";
import ContactFormComponent from "./contact-form";
import Checkout from "./checkout";

type Props = {
  element: EditorElement;
};

const Recursive = ({ element }: Props) => {
  switch (element.type) {
    case "text":
      return <TextComponent element={element} />;
    case "__body":
      return <Container element={element} />;
    case "container":
      return <Container element={element} />;
    case "video":
      return <VideoComponent element={element} />;
    case "link":
      return <LinkComponent element={element} />;
    case "2Col":
      return <TwoColumns element={element} />;
    case "contactForm":
      return <ContactFormComponent element={element} />;
    case "paymentForm":
      return <Checkout element={element} />;
    default:
      return null;
  }
};

export default Recursive;
