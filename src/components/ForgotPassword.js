import AuthContext from "../context/AuthProvider";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import "./LoginPage.css";

const ForgotPassword = () => {
  const auth = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const tryToResetPassword = await auth.forgotPassword(email);
      setSuccess(tryToResetPassword.message);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container container d-flex justify-content-center">
      <div className="auth-panel">
        <h2 className="auth-panel-title fs-1">Zresetuj hasło</h2>
        <form
          onSubmit={onSubmit}
          className="auth-form d-flex flex-column gap-3"
        >
          <div className="auth form-group-a0sPEaj">
            <label htmlFor="email">e-mail</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="auth form-footer">
            {error && <span className="error-message">{error}</span>}
            {/* Jeżeli w konsoli Firebase jest włączony email enumeration protection to zawsze zwracany jest taki sam request więc odpowiedź zawsze będzie taka sama */}
            {success && <span className="success-message">{success}</span>}
          </div>
          <div className="d-flex justify-content-center mt-3">
            <button
              type="submit"
              className="mx-5 btn-cyan"
              disabled={auth.isButtonLoading}
            >
              Zresetuj hasło
            </button>
          </div>
        </form>
        <Link to="/login">« Powrót do logowania</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
