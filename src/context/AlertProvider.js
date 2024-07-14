import { createContext, useState } from "react";
import Alert from "../components/alert/Alert";

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
      <div
        className="container h-auto position-absolute start-0 end-0 mx-auto d-flex flex-column"
        style={{ bottom: "10%" }}
      >
        {alerts.map((alert) => (
          <Alert key={alert.id} msg={alert.message} type={alert.type} />
        ))}
      </div>
    </AlertContext.Provider>
  );
};

export default AlertContext;
