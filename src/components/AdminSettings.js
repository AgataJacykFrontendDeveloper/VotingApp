import AuthContext from "../context/AuthProvider";
import { useContext, useState } from "react";

const AdminSettings = () => {
  const auth = useContext(AuthContext);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [actualPassword, setActualPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
          <p className="form-label">
            Obecne hasło
            <input
              className="form-control"
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
    <div>
      <h2>Zmiana hasła</h2>
      <h5>
        <i>Uwaga!</i>
      </h5>
      <h6>Tak wrażliwa operacja wymaga reautentykacji.</h6>
      {passwordUserRender()}
      <p className="form-label">
        Nowe hasło
        <input
          className="form-control"
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
        />
      </p>
      <p className="form-label">
        Powtórz nowe hasło
        <input
          className="form-control"
          type="password"
          value={confirmNewPassword}
          onChange={(event) => setConfirmNewPassword(event.target.value)}
        />
      </p>
      <button
        type="button"
        onClick={() =>
          changePasswd(newPassword, confirmNewPassword, actualPassword)
        }
        className="btn-cyan"
      >
        Zapisz
      </button>
      {error && <span className="error-message">{error}</span>}
      {success && <span className="success-message">{success}</span>}
    </div>
  );
};

export default AdminSettings;
