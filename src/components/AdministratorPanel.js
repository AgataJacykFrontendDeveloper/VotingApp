import React, { useState } from "react";
import "../dist/css/vendors.bundle.css";
import "../dist/css/app.bundle.css";
import "../dist/css/skins/skin-master.css";

const AdministratorPanel = () => {
  const [activeTab, setActiveTab] = useState("oddaneGlosy");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <>
      <div className="mod-bg-1 mod-nav-link">
        <div className="page-wrapper">
          <div className="page-inner">
            <aside className="page-sidebar">
              <nav id="js-primary-nav" className="primary-nav" role="navigation">
                <ul id="js-nav-menu" className="nav-menu">
                  <li className={activeTab === "oddaneGlosy" ? "active open" : ""}>
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
                      <i className="fal fa-cog"></i>
                      <span className="nav-link-text">Aktywne głosowania</span>
                    </a>
                  </li>
                  <li className={activeTab === "uzytkownicy" ? "active open" : ""}>
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
                      <i className="fal fa-book"></i>
                      <span className="nav-link-text">Ustawienia</span>
                    </a>
                  </li>
                  <li className={activeTab === "nowaListaUtworow" ? "active open" : ""}>
                    <a
                      href="#"
                      title="Nowa lista utworów"
                      onClick={() => handleTabClick("nowaListaUtworow")}
                    >
                      <i className="fal fa-book"></i>
                      <span className="nav-link-text">Nowa lista utworów</span>
                    </a>
                  </li>
                </ul>
                <div className="filter-message js-filter-message bg-success-600"></div>
              </nav>
            </aside>

            <div className="page-content-wrapper">
              <header className="page-header" role="banner">
                <div className="hidden-md-down dropdown-icon-menu position-relative">
                  <a
                    href="#"
                    className="header-btn btn js-waves-off"
                    data-action="toggle"
                    data-class="nav-function-hidden"
                    title="Hide Navigation"
                  >
                    <i className="ni ni-menu"></i>
                  </a>
                  <ul>
                    <li>
                      <a
                        href="#"
                        className="btn js-waves-off"
                        data-action="toggle"
                        data-class="nav-function-minify"
                        title="Minify Navigation"
                      >
                        <i className="ni ni-minify-nav"></i>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="btn js-waves-off"
                        data-action="toggle"
                        data-class="nav-function-fixed"
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
                    data-action="toggle"
                    data-class="mobile-nav-on"
                  >
                    <i className="ni ni-menu"></i>
                  </a>
                </div>

                <div className="ml-auto d-flex">
                  <div>
                    <a
                      href="#"
                      data-toggle="dropdown"
                      title="drlantern@gotbootstrap.com"
                      className="header-icon d-flex align-items-center justify-content-center ml-2"
                    >
                      Wyloguj
                    </a>
                  </div>
                </div>
              </header>

              <main id="js-page-content" role="main" className="page-content">
                <div className="subheader">
                  <h1 className="subheader-title">
                    {activeTab === "oddaneGlosy" && "Oddane głosy"}
                    {activeTab === "aktywneGlosowania" && "Aktywne głosowania"}
                    {activeTab === "uzytkownicy" && "Użytkownicy"}
                    {activeTab === "ustawienia" && "Ustawienia"}
                    {activeTab === "nowaListaUtworow" && "Nowa lista utworów"}
                  </h1>
                </div>
                <div className="fs-lg fw-300 p-5 bg-white border-faded rounded mb-g">
                  {activeTab === "oddaneGlosy" && (
                    <div>
                      <h2>Oddane głosy</h2>
                      <p>xxx</p>
                    </div>
                  )}
                  {activeTab === "aktywneGlosowania" && (
                    <div>
                      <h2>Aktywne głosowania</h2>
                      <p>xxx</p>
                    </div>
                  )}
                  {activeTab === "uzytkownicy" && (
                    <div>
                      <h2>Użytkownicy</h2>
                      <p>xxx</p>
                    </div>
                  )}
                  {activeTab === "ustawienia" && (
                    <div>
                      <h2>Ustawienia</h2>
                      <p>xxx</p>
                    </div>
                  )}
                  {activeTab === "nowaListaUtworow" && (
                    <div>
                      <h2>Nowa lista utworów</h2>
                      <p>xxx</p>
                    </div>
                  )}
                </div>
              </main>

              <div
                className="page-content-overlay"
                data-action="toggle"
                data-class="mobile-nav-on"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdministratorPanel;
