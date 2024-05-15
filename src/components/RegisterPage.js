import AuthContext from "../context/AuthProvider";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import "./LoginPage.css";
import { SocialAuth } from "./auth/SocialAuth";

const RegisterPage = () => {
  const user = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        throw new Error("Hasła muszą być takie same");
      }
      const userCredential = await user.signupUser(
        email,
        password
      );
      console.log("Poprawnie zarejestrowano użytkownika:", userCredential.user);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="auth-container container d-flex justify-content-center">
      <div className="auth-panel">
        <h1 className="auth-panel-h1">Zarejestruj się</h1>
        {/* Przyciski Google, FB, Twitter */}
        <SocialAuth />

        <form onSubmit={onSubmit} className="auth-form d-flex flex-column gap-3">
          <div className="auth form-group">
            <label htmlFor="email">e-mail</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
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
          <div>
            <input type="checkbox"/>
            <label htmlFor="newsletter">Zapisz się do newslettera</label>
          </div>
          <div>
            <input required type="checkbox"/>
            <label htmlFor="terms">Akceptuj warunki użytkowania</label>
          </div>
          <div className="d-flex justify-content-center mt-3">
            <button type="submit" className="btn v2 mx-5">Załóż konto</button>
          </div>
        </form>
        <Link to="/login">
          <p>« Powrót do logowania</p>
        </Link>
      </div>
    </div>
  );

      };

export default RegisterPage;