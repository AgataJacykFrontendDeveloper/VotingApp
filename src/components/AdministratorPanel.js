import { useState, useEffect, useContext } from "react";
import AlertContext from "../context/AlertProvider";
import AdminCreatePoll from "./AdminCreatePoll";
import { getUserList, getPollList } from "./AdministratorPanelFunctions";

import "../dist/css/vendors.bundle.css";
import "../dist/css/app.bundle.css";
import "../dist/css/skins/skin-master.css";
import "./AdministratorPanel.css";

const AdministratorPanel = () => {
  const { addAlert } = useContext(AlertContext);
  const [activeTab, setActiveTab] = useState("oddaneGlosy");
  const [isNavHidden, setNavHidden] = useState(false);
  const [isNavMinified, setNavMinified] = useState(false);
  const [isNavFixed, setNavFixed] = useState(false);
  const [isMobileNavOn, setMobileNavOn] = useState(false);
  const [userList, setUserList] = useState([]);
  const [records, setRecords] = useState({
    WeeklyRecord: null,
    MonthlyRecord: null,
  });

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const toggleClass = (toggleFunction, currentState) => {
    toggleFunction(!currentState);
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await getUserList();
        setUserList(users);
      } catch (error) {
        console.log("Błąd: ", error);
      }
    };
    const loadPolls = async () => {
      try {
        const fetchedRecords = await getPollList();
        setRecords(fetchedRecords);
      } catch (error) {
        console.log("Błąd: ", error);
      }
    };

    loadUsers();
    loadPolls();
  }, []);

  return (
    <div
      className={`mod-bg-1 mod-nav-link ${
        isNavHidden ? "nav-function-hidden" : ""
      } ${isNavMinified ? "nav-function-minify" : ""} ${
        isNavFixed ? "nav-function-fixed" : ""
      } ${isMobileNavOn ? "mobile-nav-on" : ""}`}
    >
      <div className="page-wrapper small-dev-bcg">
        <div className="page-inner">
          <aside className="page-sidebar page-sidebar-bcg">
            <nav id="js-primary-nav" className="primary-nav" role="navigation">
              <ul id="js-nav-menu" className="nav-menu">
                <li
                  className={activeTab === "oddaneGlosy" ? "active open" : ""}
                >
                  <a
                    href="#"
                    title="Oddane głosy"
                    onClick={() => handleTabClick("oddaneGlosy")}
                  >
                    <i className="fal fa-info-circle"></i>
                    <span className="nav-link-text">Oddane głosy</span>
                  </a>
                </li>
                <li className={activeTab === "aktywneGlosowania" ? "" : ""}>
                  <a
                    href="#"
                    title="Aktywne głosowania"
                    onClick={() => handleTabClick("aktywneGlosowania")}
                  >
                    <i className="fal fa-window"></i>
                    <span className="nav-link-text">Aktywne głosowania</span>
                  </a>
                </li>
                <li
                  className={activeTab === "uzytkownicy" ? "active open" : ""}
                >
                  <a
                    href="#"
                    title="Użytkownicy"
                    onClick={() => handleTabClick("uzytkownicy")}
                  >
                    <i className="fal fa-book"></i>
                    <span className="nav-link-text">Użytkownicy</span>
                  </a>
                </li>
                <li className={activeTab === "ustawienia" ? "active open" : ""}>
                  <a
                    href="#"
                    title="Ustawienia"
                    onClick={() => handleTabClick("ustawienia")}
                  >
                    <i className="fal fa-cog"></i>
                    <span className="nav-link-text">Ustawienia</span>
                  </a>
                </li>
                <li
                  className={
                    activeTab === "nowaListaUtworow" ? "active open" : ""
                  }
                >
                  <a
                    href="#"
                    title="Nowa lista utworów"
                    onClick={() => handleTabClick("nowaListaUtworow")}
                  >
                    <i className="fal fa-edit"></i>
                    <span className="nav-link-text">Nowa lista utworów</span>
                  </a>
                </li>
              </ul>
              <div className="filter-message js-filter-message bg-success-600"></div>
            </nav>
          </aside>

          <div className="page-content-wrapper bg-transparent  ">
            <header className="page-header bg-transparent " role="banner">
              <div className="hidden-md-down dropdown-icon-menu position-relative">
                <a
                  href="#"
                  className="header-btn btn js-waves-off"
                  onClick={() => toggleClass(setNavHidden, isNavHidden)}
                  title="Hide Navigation"
                >
                  <i className="ni ni-menu"></i>
                </a>
                <ul>
                  <li>
                    <a
                      href="#"
                      className="btn js-waves-off"
                      onClick={() => toggleClass(setNavMinified, isNavMinified)}
                      title="Minify Navigation"
                    >
                      <i className="ni ni-minify-nav"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="btn js-waves-off"
                      onClick={() => toggleClass(setNavFixed, isNavFixed)}
                      title="Lock Navigation"
                    >
                      <i className="ni ni-lock-nav"></i>
                    </a>
                  </li>
                </ul>
              </div>

              <div className="hidden-lg-up">
                <a
                  href="#"
                  className="header-btn btn press-scale-down"
                  onClick={() => toggleClass(setMobileNavOn, isMobileNavOn)}
                >
                  <i className="ni ni-menu"></i>
                </a>
              </div>
            </header>

            <main
              id="js-page-content"
              role="main"
              className="page-content page-bcg"
            >
              <div className="fs-lg fw-300 p-5 border-faded mb-g main-content-admin">
                {activeTab === "oddaneGlosy" && (
                  <div>
                    <h2>Oddane głosy</h2>
                    <p>xxx</p>
                  </div>
                )}
                {activeTab === "aktywneGlosowania" && (
                  <div>
                    <h2>Aktywne głosowania</h2>
                    {/* TODO: Funkcjonalność do zarządzania + Jakie piosenki występują w głosowaniu */}
                    <div>
                      <h5>Głosowanie Tygodnia:</h5>
                      {records.WeeklyRecord ? (
                        <div>
                          <p>ID: {records.WeeklyRecord.id}</p>
                          <p>Tytuł: {records.WeeklyRecord.title}</p>
                          <p>
                            Start:{" "}
                            {records.WeeklyRecord.start_at
                              .toDate()
                              .toLocaleString()}
                          </p>
                          <p>
                            Koniec:{" "}
                            {records.WeeklyRecord.end_at
                              .toDate()
                              .toLocaleString()}
                          </p>
                        </div>
                      ) : (
                        <p>Ładowanie głosowania tygodnia...</p>
                      )}
                    </div>
                    <div>
                      <h5>Głosowanie Miesiąca:</h5>
                      {records.MonthlyRecord ? (
                        <div>
                          <p>ID: {records.MonthlyRecord.id}</p>
                          <p>Tytuł: {records.MonthlyRecord.title}</p>
                          <p>
                            Start:{" "}
                            {records.MonthlyRecord.start_at
                              .toDate()
                              .toLocaleString()}
                          </p>
                          <p>
                            Koniec:{" "}
                            {records.MonthlyRecord.end_at
                              .toDate()
                              .toLocaleString()}
                          </p>
                        </div>
                      ) : (
                        <p>Ładowanie głosowania miesiąca...</p>
                      )}
                    </div>
                  </div>
                )}
                {activeTab === "uzytkownicy" && (
                  <div className="overflow-auto">
                    <h2>Użytkownicy</h2>
                    <ul className="list-group users-list">
                      {userList.map((user) => (
                        <li
                          key={user.id}
                          className="list-group-item border-2 border-success user-item"
                        >
                          <span>{user.id}</span>
                          {/* TODO: Blokowanie użytkowników i wyświetlanie maila zamiast ID + Dodawanie maila użytkownika do firestore przy rejestracji */}
                          <span className="block-user">Blokuj</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {activeTab === "ustawienia" && (
                  <div>
                    <h2>Zmiana hasła</h2>
                    <div>
                      <label for="inputPassword5" className="form-label">
                        Stare hasło
                      </label>
                      <input
                        type="password"
                        id="inputPassword5"
                        className="form-control"
                        aria-describedby="passwordHelpBlock"
                      />

                      <label for="inputPassword5" className="form-label">
                        Nowe hasło
                      </label>
                      <input
                        type="password"
                        id="inputPassword5"
                        className="form-control"
                        aria-describedby="passwordHelpBlock"
                      />

                      <label for="inputPassword5" className="form-label">
                        Powtórz nowe hasło
                      </label>
                      <input
                        type="password"
                        id="inputPassword5"
                        className="form-control"
                        aria-describedby="passwordHelpBlock"
                      />
                    </div>
                  </div>
                )}
                {activeTab === "nowaListaUtworow" && AdminCreatePoll(addAlert)}
              </div>
            </main>

            <div
              className="page-content-overlay"
              onClick={() => toggleClass(setMobileNavOn, isMobileNavOn)}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdministratorPanel;
