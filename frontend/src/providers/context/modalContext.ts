import { createContext, useContext, type ReactNode } from "react";

type ModalContextType = {
  setOpen: (modal: ReactNode) => void;
  setClose: () => void;
  isOpen: boolean;
};

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used in a ModalProvider component.");
  }

  return context;
};
