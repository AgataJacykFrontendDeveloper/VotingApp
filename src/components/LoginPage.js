import "./LoginPage.css";
import { SocialAuth } from "./auth/SocialAuth";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

const LoginPage = () => {
  const user = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign in user with email and password
  const handleSubmit = async (e) => {
    e.preventDefault();
    let result = await user.signIn(email, password);
    // Display message for result message
  };

  return (
    <div className="auth-container container d-flex justify-content-center">
      <div className="auth-panel">
        <h1 className="auth-panel-h1">Zaloguj się</h1>
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
          <Link to="/forgot-password" className="login-link">
            Nie pamiętasz hasła?
          </Link>
          <div className="d-flex justify-content-center mt-3">
            <button type="submit" className="btn v2 mx-5">
              Zaloguj się
            </button>
          </div>
        </form>
        <Link to="/register">
          Nie masz jeszcze konta?{" "}
          <span className="login-subtext">Zarejestruj się</span>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
