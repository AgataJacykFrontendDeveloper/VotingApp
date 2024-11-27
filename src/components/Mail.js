import AuthContext from "../context/AuthProvider";
import { useContext, useState } from "react";
import "./LoginPage.css";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const useQuery = () => {
  const location = useLocation();
  return new URLSearchParams(location.search);
};

const Mail = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const auth = useContext(AuthContext);
  const query = useQuery();
  const mailMode = query.get("mode");
  const codeFromMail = query.get("oobCode");
  switch (mailMode) {
    case "resetPassword":
      const onPasswordReset = async (e) => {
        e.preventDefault();
        setError(null);
        try {
          if (password !== confirmPassword) {
            throw new Error("Hasła muszą być takie same");
          }
          if (codeFromMail === null) {
            throw new Error("Ta strona może być użyta tylko z linku z maila");
          }
          const reset = await auth.resetPassword(codeFromMail, password);
          setSuccess(reset.message);
        } catch (error) {
          setError(error.message);
        }
      };
      return (
        <div className="auth-container container d-flex justify-content-center">
          <div className="auth-panel">
            <h2 className="auth-panel-title fs-1">Zresetuj hasło</h2>
            <form
              onSubmit={onPasswordReset}
              className="auth-form d-flex flex-column gap-3"
            >
              <div className="auth form-group-a0sPEaj">
                <label htmlFor="password">hasło</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              <div className="auth form-group-a0sPEaj">
                <label htmlFor="confirmPassword">potwórz hasło</label>
                <input
                  type="password"
                  value={confirmPassword}
                  autoComplete="off"
                  onChange={(event) => {
                    setconfirmPassword(event.target.value);
                  }}
                  required
                />
              </div>
              <div className="auth form-footer">
                {error && <span className="error-message">{error}</span>}
                {success && <span className="success-message">{success}</span>}
              </div>
              <div className="d-flex justify-content-center mt-3">
                <button
                  type="submit"
                  className="mx-5"
                  disabled={auth.isButtonLoading}
                >
                  Zresetuj hasło
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    case "verifyAndChangeEmail":
      /* TODO: Zmiana maila w Firestore */
      const onEmailVerify = async (e) => {
        e.preventDefault();
        setError(null);
        try {
          if (codeFromMail === null) {
            throw new Error("Ta strona może być użyta tylko z linku z maila");
          }
          const verify = await auth.verifyEmail(codeFromMail);
          setSuccess(verify.message);
        } catch (error) {
          setError(error.message);
        }
      };
      return (
        <div className="auth-container container d-flex justify-content-center">
          <div className="auth-panel">
            <h2 className="auth-panel-title fs-1">Zmiana maila</h2>
            <form className="auth-form d-flex flex-column gap-3">
              <div className="auth form-group-a0sPEaj">
                <button onClick={onEmailVerify}>Potwierdź zmianę maila</button>
              </div>
              <div className="auth form-footer">
                {error && <span className="error-message">{error}</span>}
                {success && <span className="success-message">{success}</span>}
              </div>
              <div className="d-flex justify-content-center mt-3">
                <Link to="/">
                  <button className="btn-cyan">Powrót do strony głównej</button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      );
    default:
      return (
        <div className="auth-container container d-flex justify-content-center">
          <div className="auth-panel">
            <h2 className="auth-panel-title fs-1">System mailowy</h2>
            <div className="auth-form d-flex flex-column gap-3">
              <div className="auth form-group-a0sPEaj">
                <span className="error-message">
                  Drogi użytkowniku, tutaj można wejść tylko przy wykorzystaniu
                  linku z maila.
                </span>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <Link to="/">
                  <button className="btn-cyan">Powrót do strony głównej</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
  }
};

export default Mail;
