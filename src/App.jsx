import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Foods from "./pages/Foods";
import Family from "./pages/Family";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rota pública */}
        <Route path="/" element={<Login />} />

        {/* Tela de cadastro */}
        <Route path="/register" element={<Register />} />

        {/* Rotas privadas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/alimentos"
          element={
            <PrivateRoute>
              <Foods />
            </PrivateRoute>
          }
        />

        <Route
          path="/familia"
          element={
            <PrivateRoute>
              <Family />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}