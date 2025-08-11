import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Comp/Login";
import Dashboard from "./Comp/Dashboard";
import SalesPage from "./Comp/Pages/SalesPage";
import OrderMgmt from "./Comp/Pages/OrderMgmt";


function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/orders" element={<OrderMgmt />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
