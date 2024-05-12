import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./context/AuthProvider";
import HomePage from "./components/HomePage";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout/>}>
            <Route path="/" element={<HomePage/>}/>
            <Route path="register" element={<RegisterPage/>}/>
            <Route path="login" element={<LoginPage/>}/>
            {/* Must be always last route */}
            <Route path="*" element={<>404 page not found</>}/>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
