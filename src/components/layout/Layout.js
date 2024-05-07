import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      {/* Header */}
      <div>
        <Outlet /> {/* Call to render a child component */}
      </div>
      {/* Footer */}
    </>
  );
}

export default Layout;
