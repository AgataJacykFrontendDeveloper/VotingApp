import "./UserPanel.css";
import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthProvider";
import UserVotes from "./DisplayVote";
import NewsletterCheckbox from "./NewsletterCheckbox";

const UserPanel = () => {
  const [activeButton, setActiveButton] = useState("user-info");
  const [showModal, setShowModal] = useState(false);
  const [activeCollapse, setActiveCollapse] = useState(null);
  const auth = useContext(AuthContext);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [actualPassword, setActualPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const toggleCollapse = (collapseId) => {
    setActiveCollapse(activeCollapse === collapseId ? null : collapseId);
  };
  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      if (showModal) {
        closeModal();
      }
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  /* Tymczasowo zakładka ustawiona na "Informacje podstawowe " */
  const ustawZakladke = () => {
    setActiveButton("user-info");
  };
  useEffect(() => {
    ustawZakladke();
  }, []);

  const resetErrors = () => {
    setError(null);
    setSuccess(null);
  };

  const changeEmail = async (newEmail, actualPassword) => {
    setError(null);
    setSuccess(null);
    try {
      const tryToChangeEmail = await auth.changeMail(newEmail, actualPassword);
      setSuccess(tryToChangeEmail.message);
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteAccount = async (actualPassword) => {
    setError(null);
    setSuccess(null);
    try {
      await auth.removeAccount(actualPassword);
      setSuccess("Konto zostało usunięte.");
    } catch (error) {
      setError(error.message);
    }
  };

  const changePasswd = async (
    newPassword,
    confirmNewPassword,
    actualPassword
  ) => {
    setError(null);
    setSuccess(null);
    try {
      if (newPassword !== confirmNewPassword) {
        throw new Error("Hasła muszą być takie same");
      }
      const tryToChangePassword = await auth.changePassword(
        newPassword,
        actualPassword
      );
      setSuccess(tryToChangePassword.message);
    } catch (error) {
      setError(error.message);
    }
  };

  const passwordUserRender = () => {
    if (auth.idProvidera === "E-Mail + hasło") {
      return (
        <>
          <p className="settings-userpanel">
            Obecne hasło
            <input
              className="userpanel-i"
              type="password"
              value={actualPassword}
              onChange={(event) => setActualPassword(event.target.value)}
            />
          </p>
        </>
      );
    }
  };

  return (
    <div className="container mt-3 mb-3 mt-sm-5 mb-sm-5 custom-container">
      <div className="row cc">
        <div className="col-12 col-md-12 col-lg-5">
          <div className="p-3 d-flex flex-column justify-content-evenly align-items-center first-column">
            <button
              type="button"
              className={`btn-cyan btn-width votes ${
                activeButton === "votes" ? "active" : ""
              }`}
              onClick={() => setActiveButton("votes")}
            >
              Głosy oddane dzisiaj
            </button>
            <button
              type="button"
              className={`btn-cyan btn-width user-info ${
                activeButton === "user-info" ? "active" : ""
              }`}
              onClick={() => setActiveButton("user-info")}
            >
              Informacje podstawowe
            </button>
            <button
              type="button"
              className={`btn-cyan btn-width settings ${
                activeButton === "settings" ? "active" : ""
              }`}
              onClick={() => setActiveButton("settings")}
            >
              Dodatkowe ustawienia
            </button>
          </div>
        </div>

        <div className="col-12 col-md-12 col-lg-7">
          <div className="p-3 second-column">
            {activeButton === "votes" && (
              <div className="votes-content">
                <h1 className="votes-heading fs-2 text-center py-3 text-white">
                  Wszystkie oddane głosy przez Ciebie
                </h1>
                <UserVotes />
              </div>
            )}
            {activeButton === "user-info" && (
              <div className="user-content d-flex flex-column h-100">
                <h1 className="user-name fs-2 text-center py-3 text-white">
                  Użytkownik
                </h1>

                <p className="fw-bold user-data user-data-name">
                  E-mail: {auth.userEmail}
                </p>
                <p className="fw-bold user-data user-data-name">
                  Sposób logowania: {auth.idProvidera}
                </p>
                <div className="newsletter-form mt-auto">
                  <div className="form-check custom-form-check">
                    {/* Dodaj komunikaty o poprawnym zapisie-wypisaniu/modal */}
                    {<NewsletterCheckbox />}
                  </div>
                </div>
                <p
                  className="delete-account mt-5 show-modal"
                  onClick={openModal}
                >
                  usuń konto
                </p>

                {/* Modal*/}
                <div
                  className={`modal fade ${
                    showModal ? "show d-block" : "d-none"
                  }`}
                  tabIndex="-1"
                >
                  <div className="modal-dialog">
                    <div className="modal-content modal-bcg">
                      <div className="modal-header">
                        <h5 className="modal-title fw-bold">
                          Przykro nam, że nas opuszczasz
                        </h5>
                      </div>
                      <div className="modal-body">
                        <p className="modal-text">
                          Ta operacja jest nieodwracalna i stracisz wszystkie
                          swoje zapisane głosowania. Czy na pewno chcesz
                          kontynuować usuwanie konta?
                        </p>
                        <p className="modal-title">Uwaga!</p>
                        <p className="modal-text">
                          Tak wrażliwa operacja wymaga reautentykacji.
                        </p>
                        {passwordUserRender()}
                        {error}
                      </div>
                      <div className="modal-footer btns-footer">
                        <button
                          type="button"
                          className="btn btn-secondary btn-nodelete"
                          onClick={closeModal}
                          data-bs-dismiss="modal"
                        >
                          Nie, zatrzymaj usuwanie
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteAccount(actualPassword)}
                          className="btn btn-primary btn-delete"
                        >
                          Tak, usuń moje konto
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Overlay */}
                {showModal && (
                  <div
                    className="modal-backdrop fade-shadow modal-overlay"
                    onClick={closeModal}
                  ></div>
                )}
              </div>
            )}
            {activeButton === "settings" && (
              <div className="additional-settings-content">
                <h1 className="settings-heading fs-2 text-center py-3 text-white">
                  Dodatkowe ustawienia
                </h1>
                <div className="container mt-3 mb-3 mt-sm-5 mb-sm-5 custom-container">
                  <div className="row">
                    <p className="d-inline-flex gap-1">
                      <button
                        className="btn btn-primary btn-email"
                        onClick={() => {
                          toggleCollapse("collapse1");
                          resetErrors();
                        }}
                        aria-expanded={activeCollapse === "collapse1"}
                        aria-controls="multiCollapseExample1"
                      >
                        Zmiana e-maila
                      </button>
                      <button
                        className="btn btn-primary btn-password"
                        onClick={() => {
                          toggleCollapse("collapse2");
                          resetErrors();
                        }}
                        aria-expanded={activeCollapse === "collapse2"}
                        aria-controls="multiCollapseExample2"
                      >
                        Zmiana hasła
                      </button>
                    </p>
                    <div className="col-12">
                      <div
                        className={`collapse ${
                          activeCollapse === "collapse1" ? "show" : ""
                        }`}
                        id="multiCollapseExample1"
                      >
                        <div className="card card-body">
                          <p className="modal-title">Uwaga!</p>
                          <p className="text-center">
                            Tak wrażliwa operacja wymaga reautentykacji.
                          </p>
                          {passwordUserRender()}
                          <p className="settings-userpanel">
                            Nowy adres e-mail
                            <input
                              className="userpanel-i"
                              type="email"
                              value={newEmail}
                              onChange={(event) =>
                                setNewEmail(event.target.value)
                              }
                            />
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              changeEmail(newEmail, actualPassword)
                            }
                            className="btn btn-primary fw-bold btn-save-userpanel"
                          >
                            Zapisz
                          </button>
                          {error && (
                            <span className="error-message">{error}</span>
                          )}
                          {success && (
                            <span className="success-message">{success}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div
                        className={`collapse ${
                          activeCollapse === "collapse2" ? "show" : ""
                        }`}
                        id="multiCollapseExample2"
                      >
                        <div className="card card-body">
                          <p className="modal-title">Uwaga!</p>
                          <p className="text-center">
                            Tak wrażliwa operacja wymaga reautentykacji.
                          </p>
                          {passwordUserRender()}
                          <p className="settings-userpanel">
                            Nowe hasło
                            <input
                              className="userpanel-i"
                              type="password"
                              value={newPassword}
                              onChange={(event) =>
                                setNewPassword(event.target.value)
                              }
                            />
                          </p>
                          <p className="settings-userpanel">
                            Powtórz nowe hasło
                            <input
                              className="userpanel-i"
                              type="password"
                              value={confirmNewPassword}
                              onChange={(event) =>
                                setConfirmNewPassword(event.target.value)
                              }
                            />
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              changePasswd(
                                newPassword,
                                confirmNewPassword,
                                actualPassword
                              )
                            }
                            className="btn btn-primary fw-bold btn-save-userpanel"
                          >
                            Zapisz
                          </button>
                          {error && (
                            <span className="error-message">{error}</span>
                          )}
                          {success && (
                            <span className="success-message">{success}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/*koniec*/}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserPanel;
