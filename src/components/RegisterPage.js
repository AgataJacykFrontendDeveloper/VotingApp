import AuthContext from "../context/AuthProvider";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";

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
    <div>
      <p>Zarejestruj się</p>
      <hr/>
      {/* Przyciski Google, FB, Twitter */}
      <form onSubmit={onSubmit}>
        <p>e-mail</p>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <p>hasło</p>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <p>powtórz hasło</p>
        <input
          type="password"
          value={confirmPassword}
          autoComplete="off"
          onChange={(event) => {
            setconfirmPassword(event.target.value);
          }}
          required
        />
        <p>
          <input type="checkbox"/>
          Zapisz się do newslettera
        </p>
        <p>
          <input required type="checkbox"/>
          Akceptuj warunki użytkowania
        </p>
        <button type="submit">Załóż konto</button>
      </form>
      <Link to="/login">
        <p>« Powrót do logowania</p>
      </Link>
    </div>
  );

};

export default RegisterPage;