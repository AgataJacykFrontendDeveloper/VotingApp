import "./UserPanel.css";
import React, { useState } from "react";

const UserPanel = () => {
  const [activeButton, setActiveButton] = useState(null);

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
          className={`settings ${activeButton === "settings" ? "active" : ""}`}
          onClick={() => setActiveButton("settings")}
        >
          Dodatkowe ustawienia
        </button>
      </div>
      <div className="right-menu">
        {activeButton === "votes" && <div className="votes-content">Głosy</div>}
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
            <input
              class="check-box-1"
              placeholder
              className="x"
              type="checkbox"
            />
            <span>Zapis do newslettera</span>

            <p class="delete-account">&#x2716; usuń konto</p>
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
};

export default UserPanel;
