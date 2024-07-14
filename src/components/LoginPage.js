import "./LoginPage.css";
import { SocialAuth } from "./auth/SocialAuth";
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

const LoginPage = () => {
  const auth = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // Sign in user with email and password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await auth.signIn(email, password);
    } catch (error) {
      // Display error message
      setError(error.message);
    }
  };

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        await auth.getOAuthResult();
      } catch (error) {
        // Display error message for OAuth login
        setError(error.message);
      }
    };
    handleRedirectResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="auth-container container d-flex justify-content-center">
      <div className="auth-panel">
        <h1 className="auth-panel-title">Zaloguj się</h1>
        <SocialAuth />
        <form
          onSubmit={handleSubmit}
          className="auth-form d-flex flex-column gap-3"
        >
          <div className="auth form-group">
            <label htmlFor="email">e-mail</label>
            <input
              type="email"
              name="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            ></input>
          </div>
          <div className="auth form-group">
            <label htmlFor="password">hasło</label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            ></input>
          </div>
          <div className="auth form-footer">
            <Link to="/forgot-password">Nie pamiętasz hasła?</Link>
            {error && <span className="error-message">{error}</span>}
          </div>
          <div className="d-flex justify-content-center mt-3">
            <button
              type="submit"
              className="mx-5 btn-cyan"
              disabled={auth.isLoading}
            >
              Zaloguj się
            </button>
          </div>
        </form>
        <Link to="/register">
          Nie masz jeszcze konta?&nbsp;
          <span className="register-link-subtext">Zarejestruj się</span>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
