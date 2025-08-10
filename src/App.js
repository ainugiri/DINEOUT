import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Comp/Login";
import Dashboard from "./Comp/Dashboard";
import SalesPage from "./Comp/Pages/SalesPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sales" element={<SalesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
