import AuthContext from "../context/AuthProvider";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import "./LoginPage.css";
import { SocialAuth } from "./auth/SocialAuth";

const RegisterPage = () => {
  const auth = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [error, setError] = useState(null);
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (password !== confirmPassword) {
        throw new Error("Hasła muszą być takie same");
      }
      await auth.signupUser(email, password, newsletter);
    } catch (error) {
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
        <h2 className="auth-panel-title fs-1">Zarejestruj się</h2>
        {/* Przyciski Google, FB, Twitter */}
        <SocialAuth />

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
          <div className="d-flex flex-column gap-2 ms-3">
            <div className="d-flex align-items-center gap-2">
              <input
                className="rounded-checkbox"
                type="checkbox"
                checked={newsletter}
                onChange={() => setNewsletter(!newsletter)}
              />
              <label htmlFor="newsletter">Zapisz się do newslettera</label>
            </div>
            <div className="d-flex align-items-center gap-2">
              <input className="rounded-checkbox" required type="checkbox" />
              <label htmlFor="terms">Akceptuj warunki użytkowania</label>
            </div>
          </div>
          <div className="auth form-footer">
            {error && <span className="error-message">{error}</span>}
          </div>
          <div className="d-flex justify-content-center mt-3">
            <button
              type="submit"
              className="mx-5 btn-cyan"
              disabled={auth.isButtonLoading}
            >
              Załóż konto
            </button>
          </div>
        </form>
        <Link to="/login">« Powrót do logowania</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
