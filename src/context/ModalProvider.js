import { createContext, useState, useContext } from "react";
import { createPortal } from "react-dom";
import Modal from "../components/overlays/Modal";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalContent, setModalContent] = useState(null);

  const openModal = (content) => {
    setModalContent(content);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {createPortal(
        modalContent && (
          <Modal
            heading={modalContent.heading}
            text={modalContent.text}
            close={closeModal}
            buttons={modalContent.buttons}
          />
        ),
        document.body
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
