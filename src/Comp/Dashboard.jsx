import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [hoverIndex, setHoverIndex] = useState(null);

const menuItems = [
    { title: "SALES", color: "#ff6f61", hover: "#20b2aa", path: "/sales" },
    { title: "REPORTS", color: "#6a5acd", hover: "#3cb371", path: "/Pages/reports" },
    { title: "SETTINGS", color: "#ffa500", hover: "#9370db", path: "/Pages/settings" },
    { title: "EMPLOYEE MGMT", color: "#20b2aa", hover: "#ff6f61", path: "/Pages/employee" },
    { title: "STOCK", color: "#ff4500", hover: "#ff6f61", path: "/Pages/stock" },
    { title: "ORDERS", color: "#3cb371", hover: "#6a5acd", path: "/Pages/orders" },
    { title: "CUSTOMERS", color: "#9370db", hover: "#20b2aa", path: "/Pages/customers" }
];

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={{ margin: 0 }}>🍽 Dine Out Cafeteria</h1>
        <h2 style={{ margin: 0 }}>Your one-stop solution for Biriyani Hunters</h2>
      </header>

      <div style={styles.grid}>
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
            style={{
              ...styles.tile,
              backgroundColor: hoverIndex === index ? item.hover : item.color
            }}
          >
            <h3>{item.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f8f8f8",
    minHeight: "100vh",
    padding: "20px"
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#333"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "20px"
  },
  tile: {
    color: "#fff",
    padding: "30px",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "1.2em",
    fontWeight: "bold",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
};
