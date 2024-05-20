import "./Header.css";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <div className="nav">
      <input type="checkbox" id="nav-check" />
      <div className="nav-header"></div>
      <div className="nav-btn">
        <label for="nav-check">
          <span></span>
          <span></span>
          <span></span>
        </label>
      </div>
      <div className="nav-links">
        <Link to="/">Strona główna</Link>
        <Link to="/">Głosowanie tygodnia</Link>
        <Link to="/">Głosowanie miesiąca</Link>

        <Link to="/login">
          <button>Logowanie</button>{" "}
        </Link>
      </div>
    </div>
  );
};

export default Header;
