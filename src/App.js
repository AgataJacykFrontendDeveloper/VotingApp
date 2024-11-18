import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedLayout from "./components/layout/ProtectedLayout";
import CookiesLayout from "./components/layout/CookiesLayout";
import { AuthProvider } from "./context/AuthProvider";
import { AlertProvider } from "./context/AlertProvider";
import { ModalProvider } from "./context/ModalProvider";
import HomePage from "./components/HomePage";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import UserPanel from "./components/UserPanel";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import VotePage from "./components/VotePage";
import SongPage from "./components/SongPage";
import AdministratorPanel from "./components/AdministratorPanel";
import PageNotFound from "./components/404";
import Cookies from "./components/CookiesSite";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AlertProvider>
          <ModalProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password" element={<ResetPassword />} />
                <Route
                  path="vote/weekly"
                  element={<VotePage type="weekly" />}
                />
                <Route
                  path="vote/monthly"
                  element={<VotePage type="monthly" />}
                />
                <Route
                  path="vote/:pollId/songs/:songId"
                  element={<SongPage />}
                />
                <Route path="*" element={<PageNotFound />} />
              </Route>
              <Route element={<ProtectedLayout />}>
                <Route path="settings" element={<UserPanel />} />
                <Route path="admin" element={<AdministratorPanel />} />
              </Route>
              <Route element={<CookiesLayout />}>
                <Route path="cookies" element={<Cookies />} />
              </Route>
            </Routes>
          </ModalProvider>
        </AlertProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
