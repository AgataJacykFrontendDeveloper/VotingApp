import "./UserPanel.css";
import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthProvider";
import { Navigate } from "react-router-dom";

const UserPanel = () => {
  const [activeButton, setActiveButton] = useState(null);
  const auth = useContext(AuthContext);

  /* Tymczasowo zakładka ustawiona na "Informacje podstawowe " */
  const ustawZakladke = () => {
    setActiveButton("user-info");
  };
  useEffect(() => {
    ustawZakladke();
  }, []);

  if (auth.user === null) {
    /* TODO: Komunikat o tym, że użytkownik musi być zalogowany */
    return <Navigate to="/" replace />;
  } else {
    return (
      <div className="container">
        <div className="left-menu">
          <button
            className={`votes ${activeButton === "votes" ? "active" : ""}`}
            onClick={() => setActiveButton("votes")}
          >
            Oddane głosy
          </button>

          <button
            className={`user-info ${
              activeButton === "user-info" ? "active" : ""
            }`}
            onClick={() => setActiveButton("user-info")}
          >
            Informacje podstawowe
          </button>

          <button
            className={`settings ${
              activeButton === "settings" ? "active" : ""
            }`}
            onClick={() => setActiveButton("settings")}
          >
            Dodatkowe ustawienia
          </button>
        </div>
        <div className="right-menu">
          {activeButton === "votes" && (
            <div className="votes-content">Głosy</div>
          )}
          {activeButton === "user-info" && (
            <div className="user-content">
              <p className="user-name">Użytkownik</p>
              <p className="user-data user-data-name">
                E-mail
                <input className="input-name" type="text" />
              </p>
              <p className="user-data user-data-password">
                Hasło
                <input className="input-password" type="text" />
              </p>
              <input className="check-box-1" type="checkbox" />
              <span>Zapis do newslettera</span>

              <p className="delete-account">&#x2716; usuń konto</p>
            </div>
          )}

          {activeButton === "settings" && (
            <div className="additional-settings-content">
              Dodatkowe ustawienia
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default UserPanel;
