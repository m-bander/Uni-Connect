import { useState, type ReactNode } from "react";
import { ModalContext } from "./context/modalContext";

type ModalProviderProps = {
  children: ReactNode;
};

const ModalProvider = ({ children }: ModalProviderProps) => {
  const [displayedModal, setDisplayedModal] = useState<ReactNode>(null);
  console.log(displayedModal);

  return (
    <ModalContext.Provider
      value={{
        setOpen: (modal: ReactNode) => {
          setDisplayedModal(modal);
        },
        setClose: () => {
          setDisplayedModal(null);
        },
        isOpen: !!displayedModal,
      }}
    >
      {children}
      {displayedModal}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
