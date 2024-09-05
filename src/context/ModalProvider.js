import { createContext, useState, useContext, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import Modal from "../components/overlays/Modal";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalContent, setModalContent] = useState(null);
  const currentLocation = useRef(null);
  let location = useLocation().pathname;

  const openModal = (content) => {
    setModalContent(content);
    currentLocation.current = location;
  };

  const closeModal = () => {
    setModalContent(null);
    currentLocation.current = null;
  };

  useEffect(() => {
    if (currentLocation.current && currentLocation.current !== location) {
      closeModal();
    }
  }, [location]);

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
