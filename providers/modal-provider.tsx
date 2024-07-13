"use client";

import { TicketDetails } from "@/lib/types";
import { Agency, Contact, User } from "@prisma/client";
import React, { createContext } from "react";

interface ModalProviderProps {
  children: React.ReactNode;
}

export type ModalData = {
  user?: User;
  agency?: Agency;
  ticket?: TicketDetails[0];
};

type ModalContextType = {
  data: ModalData;
  isOpen: boolean;
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => void;
  setClose: () => void;
};

export const ModalContext = createContext<ModalContextType>({
  data: {},
  isOpen: false,
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => {},
  setClose: () => {},
});

const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [modal, setModal] = React.useState<React.ReactNode>(null);
  const [data, setData] = React.useState<ModalData>({});

  const setOpen = async (
    modal: React.ReactNode,
    fetchData?: () => Promise<any>
  ) => {
    if (modal) {
      if (fetchData) {
        setData({ ...data, ...((await fetchData()) || {}) });
      }
      setIsOpen(true);
      setModal(modal);
    }
  };

  const setClose = () => {
    setIsOpen(false);
    setData({});
  };

  return (
    <ModalContext.Provider value={{ data, isOpen, setOpen, setClose }}>
      {children}
      {modal}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = React.useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  return context;
};

export default ModalProvider;
