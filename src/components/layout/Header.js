import "./Header.css";
const Header = () => {
  return (
    <div class="nav">
      <input type="checkbox" id="nav-check" />
      <div class="nav-header"></div>
      <div class="nav-btn">
        <label for="nav-check">
          <span></span>
          <span></span>
          <span></span>
        </label>
      </div>
      <div class="nav-links">
        <a>Strona główna</a>
        <a>Głosowanie tygodnia</a>
        <a>Głosowanie miesiąca</a>
        <div id="indicator"></div>
        <button>Logowanie</button>
      </div>
    </div>
  );
};

export default Header;
