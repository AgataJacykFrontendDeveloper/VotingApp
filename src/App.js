import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<>Home</>} />

          {/* Must be always last route */}
          <Route path="*" element={<>404 page not found</>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
