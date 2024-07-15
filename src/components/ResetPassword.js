import AuthContext from "../context/AuthProvider";
import { useContext, useState } from "react";
import "./LoginPage.css";
import { useLocation } from "react-router-dom";

const useQuery = () => {
  const location = useLocation();
  return new URLSearchParams(location.search);
};

const ResetPassword = () => {
  const auth = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const query = useQuery();
  const codeFromMail = query.get("oobCode");
  const onSubmit = async (e) => {
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
        <h1 className="auth-panel-title">Zresetuj hasło</h1>
        <form
          onSubmit={onSubmit}
          className="auth-form d-flex flex-column gap-3"
        >
          <div className="auth form-group">
            <label htmlFor="password">hasło</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <div className="auth form-group">
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
};

export default ResetPassword;
