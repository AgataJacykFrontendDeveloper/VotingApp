import { createContext, useState, useContext } from "react";
import { createPortal } from "react-dom";
import Alert from "../components/overlays/Alert";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = (message, type = "warning", timeout = 2000) => {
    const id = Date.now();

    setAlerts((prevAlerts) => {
      // Allow only 4 alerts to be shown at once
      if (prevAlerts.length >= 4) {
        prevAlerts = prevAlerts.slice(1);
      }
      return [...prevAlerts, { id, message, type }];
    });

    setTimeout(() => {
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
    }, timeout);
  };

  return (
    <AlertContext.Provider value={{ addAlert }}>
      {children}
      {createPortal(
        <div className="position-fixed end-0  bottom-0 mr-4 mb-4 z-3 d-flex flex-column gap-3">
          {alerts.map((alert) => (
            <Alert key={alert.id} msg={alert.message} type={alert.type} />
          ))}
        </div>,
        document.body
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);

export default AlertContext;
