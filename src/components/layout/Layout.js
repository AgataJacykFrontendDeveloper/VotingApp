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
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default Layout;
