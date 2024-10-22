import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AuthContext from "../../context/AuthProvider";
import { Spinner } from "react-bootstrap";
import { useContext } from "react";

function Layout() {
  const auth = useContext(AuthContext);
  // Wait for Auth to set correct Header
  if (auth.isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Ładowanie...</span>
        </Spinner>
      </div>
    );
  }
  return (
    <>
      <Header />
      <div className="d-flex flex-column flex-grow-1 flex-shrink-0">
        {auth.user && auth.user.isBlocked ? (
          <div className="w-100 d-flex align-items-center my-auto flex-column">
            <p className="fs-3 text-danger fw-medium text-center">
              Twoje konto zostało zablokowane, <br />
              <span className="fs-4">skontaktuj się z administratorem</span>
            </p>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
      <Footer />
    </>
  );
}

export default Layout;
