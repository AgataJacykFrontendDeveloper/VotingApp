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
      <div>
        <Outlet /> {/* Call to render a child component */}
      </div>
      <Footer />
    </>
  );
}

export default Layout;
