import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
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
