import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consentGiven = localStorage.getItem("zgodaCookies");
    if (!consentGiven) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("zgodaCookies", "true");
    setShowBanner(false);
  };

  return (
    showBanner && (
      <>
        <div className="modal-backdrop fade-shadow modal-overlay"></div>
        <div className={`modal fade show d-block`} tabIndex="-1">
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content modal-bcg">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <img
                    className="img-fluid"
                    alt="VotingApp Logo"
                    src={require("../../images/HeaderLogo.png")}
                  />
                  <img
                    className="img-fluid"
                    alt="Ciasteczka"
                    src={require("../../images/cookies.png")}
                  />
                </h5>
              </div>
              <div className="modal-body">
                <p className="modal-text">
                  VotingApp korzysta z Cookies. Korzystając z aplikacji wyrażasz
                  zgodę na przetwarzanie Twoich danych osobowych. Politykę
                  prywatności możesz znaleźć <Link to="/cookies">tutaj</Link>.
                </p>
              </div>
              <div className="modal-footer modal-title btns-footer">
                <button
                  type="button"
                  onClick={handleAccept}
                  className="btn btn-secondary btn-nodelete"
                  data-bs-dismiss="modal"
                >
                  Wyrażam zgodę
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default CookieBanner;
