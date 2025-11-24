import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Foods from "./pages/Foods";
import Family from "./pages/Family";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route
              path="/dashboard"
              element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>}
        />
        <Route
              path="/alimentos"
              element={
                  <PrivateRoute>
                    <Foods />
                  </PrivateRoute>}
        />
        <Route
              path="/familia"
              element={
                  <PrivateRoute>
                    <Family />
                  </PrivateRoute>}
        />
      </Routes>
    </Router>
  );
}
