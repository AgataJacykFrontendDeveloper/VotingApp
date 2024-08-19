import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import { Spinner } from "react-bootstrap";

function ProtectedLayout() {
  const auth = useContext(AuthContext);
  if (auth.isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Ładowanie...</span>
        </Spinner>
      </div>
    );
  }
  if (!auth.isLoggedIn) {
    return <Navigate to="/" replace />;
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

export default ProtectedLayout;
