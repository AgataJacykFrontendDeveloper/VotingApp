import "./Header.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthProvider";
const Header = () => {
  const auth = useContext(AuthContext);
  return (
    <>
      {auth.user === null ? (
        <>
          <div className="nav">
            <input type="checkbox" id="nav-check" />
            <div className="nav-header"></div>
            <div className="nav-btn">
              <label htmlFor="nav-check">
                <span></span>
                <span></span>
                <span></span>
              </label>
            </div>
            <div className="nav-links">
              <Link to="/">Strona główna</Link>
              <Link to="/vote-weekly">Głosowanie tygodnia</Link>
              <Link to="/vote-monthly">Głosowanie miesiąca</Link>

              <Link to="/login">
                <button>Logowanie</button>{" "}
              </Link>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="nav">
            <input type="checkbox" id="nav-check" />
            <div className="nav-header"></div>
            <div className="nav-btn">
              <label htmlFor="nav-check">
                <span></span>
                <span></span>
                <span></span>
              </label>
            </div>
            <div className="nav-links">
              <Link to="/">Strona główna</Link>
              <Link to="/">Głosowanie tygodnia</Link>
              <Link to="/">Głosowanie miesiąca</Link>
              <Link to="/settings">Panel użytkownika</Link>
              <Link to="/" onClick={auth.signOut}>
                <button>Wyloguj</button>{" "}
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
