import "./Header.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import logo from "../../images/HeaderLogo.png";

const Header = () => {
  const auth = useContext(AuthContext);
  return (
    <>
      {auth.user === null ? (
        <>
          <nav className="navbar navbar-expand-lg" data-bs-theme="dark">
            <div className="container-fluid ">
              <a className="navbar-brand" href="/">
                <img src={logo} id="HeaderLogo" alt="Voting App Logo" />
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarTogglerDemo02"
                aria-controls="navbarTogglerDemo02"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse"
                id="navbarTogglerDemo02"
              >
                <ul className="navbar-nav mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      to="/"
                    >
                      Strona główna
                    </Link>
                  </li>
                  <li className="nav-item">
                    {" "}
                    <Link className="nav-link" to="/vote-weekly">
                      Głosowanie tygodnia
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/vote-monthly">
                      Głosowanie miesiąca
                    </Link>
                  </li>{" "}
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      <button className="btn-cyan">Logowanie</button>
                    </Link>
                  </li>{" "}
                </ul>
              </div>
            </div>
          </nav>
        </>
      ) : (
        <>
          {" "}
          <nav className="navbar navbar-expand-lg" data-bs-theme="dark">
            <div className="container-fluid ">
              <a className="navbar-brand" href="/">
                <img src={logo} id="HeaderLogo" alt="Voting App Logo" />
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarTogglerDemo02"
                aria-controls="navbarTogglerDemo02"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse"
                id="navbarTogglerDemo02"
              >
                <ul className="navbar-nav mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      to="/"
                    >
                      Strona główna
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/vote-weekly">
                      Głosowanie tygodnia
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/vote-monthly">
                      Głosowanie miesiąca
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/settings">
                      Panel użytkownika
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/" onClick={auth.signOut}>
                      <button className="btn-cyan">Wyloguj</button>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  );
};

export default Header;
