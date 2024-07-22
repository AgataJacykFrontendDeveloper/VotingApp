import React from "react";

import "../dist/css/vendors.bundle.css";
import "../dist/css/app.bundle.css";
import "../dist/css/skins/skin-master.css";


const AdministratorPanel = () => {
  return (
    <>
      <body class="mod-bg-1 mod-nav-link ">
        <div class="page-wrapper">
          <div class="page-inner">
            <aside class="page-sidebar">
              <nav id="js-primary-nav" class="primary-nav" role="navigation">
                <ul id="js-nav-menu" class="nav-menu">
                  <li class="active open">
                    <a
                      href="#"
                      title="Application Intel"
                      data-filter-tags="application intel"
                    >
                      <i class="fal fa-info-circle"></i>
                      <span
                        class="nav-link-text"
                        data-i18n="nav.application_intel"
                      >
                        Oddane głosy
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      title="Theme Settings"
                      data-filter-tags="theme settings"
                    >
                      <i class="fal fa-cog"></i>
                      <span
                        class="nav-link-text"
                        data-i18n="nav.theme_settings"
                      >
                        Aktywne głosowania
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      title="Documentation"
                      data-filter-tags="documentation"
                    >
                      <i class="fal fa-book"></i>
                      <span class="nav-link-text" data-i18n="nav.documentation">
                        Użytkownicy
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      title="Documentation"
                      data-filter-tags="documentation"
                    >
                      <i class="fal fa-book"></i>
                      <span class="nav-link-text" data-i18n="nav.documentation">
                        Ustawienia
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      title="Documentation"
                      data-filter-tags="documentation"
                    >
                      <i class="fal fa-book"></i>
                      <span class="nav-link-text" data-i18n="nav.documentation">
                        Nowa lista utworów
                      </span>
                    </a>
                  </li>
                </ul>
                <div class="filter-message js-filter-message bg-success-600"></div>
              </nav>
            </aside>

            <div class="page-content-wrapper">
              <header class="page-header" role="banner">
                <div class="hidden-md-down dropdown-icon-menu position-relative">
                  <a
                    href="#"
                    class="header-btn btn js-waves-off"
                    data-action="toggle"
                    data-class="nav-function-hidden"
                    title="Hide Navigation"
                  >
                    <i class="ni ni-menu"></i>
                  </a>
                  <ul>
                    <li>
                      <a
                        href="#"
                        class="btn js-waves-off"
                        data-action="toggle"
                        data-class="nav-function-minify"
                        title="Minify Navigation"
                      >
                        <i class="ni ni-minify-nav"></i>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="btn js-waves-off"
                        data-action="toggle"
                        data-class="nav-function-fixed"
                        title="Lock Navigation"
                      >
                        <i class="ni ni-lock-nav"></i>
                      </a>
                    </li>
                  </ul>
                </div>

                <div class="hidden-lg-up">
                  <a
                    href="#"
                    class="header-btn btn press-scale-down"
                    data-action="toggle"
                    data-class="mobile-nav-on"
                  >
                    <i class="ni ni-menu"></i>
                  </a>
                </div>

                <div class="ml-auto d-flex">
                  <div>
                    <a
                      href="#"
                      data-toggle="dropdown"
                      title="drlantern@gotbootstrap.com"
                      class="header-icon d-flex align-items-center justify-content-center ml-2"
                    >
                      Wyloguj
                    </a>
                  </div>
                </div>
              </header>

              <main id="js-page-content" role="main" class="page-content">
                <div class="subheader">
                  <h1 class="subheader-title">Oddane głosy</h1>
                </div>
                <div class="fs-lg fw-300 p-5 bg-white border-faded rounded mb-g">
                  <h2>Privacy</h2>
                  <p class="mb-g">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Sunt quis iste aperiam laborum? Laborum aspernatur
                    voluptatum quaerat voluptate quod tempore tenetur rerum
                    explicabo dolor culpa tempora obcaecati, exercitationem quia
                    perferendis.
                  </p>
                  <h3>Cookies and other similar technologies</h3>
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Aut ab voluptates ipsam aliquam unde illo porro quia
                    repellat tempore ratione? Magni, inventore quod! Sunt unde,
                    numquam eaque quod iste alias?
                  </p>
                </div>
              </main>

              <div
                class="page-content-overlay"
                data-action="toggle"
                data-class="mobile-nav-on"
              ></div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default AdministratorPanel;
