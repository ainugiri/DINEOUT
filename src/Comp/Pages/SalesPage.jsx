// ------------ SalesPage.jsx ------------------------
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function SalesPage() {
  const [id, setId] = useState("");
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState([]);
  const [cash, setCash] = useState(0);
  const [upi, setUpi] = useState(0);
  const [card, setCard] = useState(0);
  const receiptRef = useRef();
    const navigate = useNavigate();
  const [hoverIndex, setHoverIndex] = useState(null);

const menuItems = [
    { title: "DASHBOARD", color: "#ff6f61", hover: "#20b2aa", path: "/dashboard" },
    { title: "REPORTS", color: "#6a5acd", hover: "#3cb371", path: "/Pages/reports" },
    { title: "SETTINGS", color: "#ffa500", hover: "#9370db", path: "/Pages/settings" },
    { title: "EMPLOYEE MGMT", color: "#20b2aa", hover: "#ff6f61", path: "/Pages/employee" },
    { title: "STOCK", color: "#ff4500", hover: "#ff6f61", path: "/Pages/stock" },
    { title: "ORDERS", color: "#3cb371", hover: "#6a5acd", path: "/orders" },
    { title: "CUSTOMERS", color: "#9370db", hover: "#20b2aa", path: "/Pages/customers" }
];



  // Fetch by ID
  useEffect(() => {
    const fetchById = async () => {
      if (!id) return;
      try {
        const res = await fetch(`http://localhost:5000/menu/${id}`);
        if (!res.ok) throw new Error("Item not found");
        const data = await res.json();
        setSelectedItem(data);
        setTerm(data.item_name);
        setQty(1);
      } catch (err) {
        console.error(err);
      }
    };
    fetchById();
  }, [id]);

  // Search by name
  useEffect(() => {
    const fetchResults = async () => {
      if (term.length < 2) {
        setResults([]);
        return;
      }
      try {
        const res = await fetch(`http://localhost:5000/menu/search/${term}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error(err);
      }
    };
    const delay = setTimeout(fetchResults, 300);
    return () => clearTimeout(delay);
  }, [term]);

  const handleSelect = (item) => {
    setSelectedItem(item);
    setTerm(item.item_name);
    setId(item.item_id);
    setQty(1);
    setResults([]);
  };

  const updateCartItem = (index, newQty) => {
    if (newQty <= 0) return;
    const updatedCart = [...cart];
    updatedCart[index].qty = newQty;
    updatedCart[index].rowTotal = updatedCart[index].price * newQty;
    setCart(updatedCart);
  };

  const deleteCartItem = (index) => {
    const updatedCart = cart.filter((_, idx) => idx !== index);
    setCart(updatedCart);
  };

  const handleSubmit = async () => {
    if (overallTotal <= 0) {
      alert("No items to save!");
      return;
    }

    const saleData = {
      total_amount: overallTotal,
      cash_amount: cash,
      upi_amount: upi,
      card_amount: card,
      items: cart.map(item => ({
            item_id: item.item_id,
            item_name: item.item_name,
            qty: item.qty,
            price: item.price,
            rowTotal: item.rowTotal,
          })),
    };

    try {
      const saleRes = await fetch("http://localhost:5000/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      });
      const data = await saleRes.json();
    if (!saleRes.ok) throw new Error(data.error || "Failed to save sale");

      const { sale_id } = data;
      alert(`Sale saved successfully! (ID: ${sale_id})`);
      const bNo = sale_id;
      saleData.sale_id = bNo; // add sale_id to saleData for printing
      handlePrint({ saleData });
      handleClear();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleClear = () => {
    setId("");
    setTerm("");
    setResults([]);
    setSelectedItem(null);
    setQty(1);
    setCart([]);
    setCash(0);
    setUpi(0);
    setCard(0);
  };

  const addToCart = () => {
    if (!selectedItem || qty <= 0) {
      alert("Select item and enter quantity");
      return;
    }
    const rowTotal = selectedItem.price * qty;
    setCart([...cart, { ...selectedItem, qty, rowTotal }]);
    setId("");
    setTerm("");
    setQty(1);
    setSelectedItem(null);
  };

  const overallTotal = cart.reduce((sum, item) => sum + item.rowTotal, 0);
  const paymentTotal = cash + upi + card;
  const isPaymentValid = paymentTotal === overallTotal;

  const handlePrint = (data) => {
  // unwrap the nested saleData
  // console.log(data);
  const bNo = data.saleData ? data.saleData.sale_id : "N/A";
  const saleData = data.saleData || data;
    console.log(saleData);
  const { total_amount, cash_amount, upi_amount, card_amount, items } = saleData;

    const receiptWidth = 40; // total characters per line

  // Helper to center text
  const centerText = (text, width) => {
    if (text.length >= width) return text; // no centering if too long
    const spaces = Math.floor((width - text.length) / 2);
    return " ".repeat(spaces) + text;
  };

  // Column widths for table
  const colWidths = { id: 4, name: 20, qty: 5, price: 6, total: 5 };
  const pad = (text, width, align = "left") => {
    text = text.toString();
    if (text.length > width) return text.slice(0, width);
    if (align === "left") return text.padEnd(width, " ");
    if (align === "right") return text.padStart(width, " ");
    return centerText(text, width);
  };
  let receiptText = "";
  receiptText += centerText ("Dine Out Biriyani \n", receiptWidth);
  receiptText += centerText("Heaven for Biriyani Hunters\n", receiptWidth);
  receiptText += centerText("9840 201 202\n", receiptWidth);
  receiptText += centerText("HIG 64, NH - 1, Maraimalai Nagar\n", receiptWidth);
  receiptText += centerText("Chennai\n", receiptWidth);
  receiptText += centerText("\n", receiptWidth);
  receiptText += `Bill No: ${bNo}    Date: ${new Date().toLocaleString()}\n`;
  receiptText += centerText("\n", receiptWidth);
  receiptText += centerText("\n", receiptWidth);
  receiptText += `${pad("ID", colWidths.id)} ${pad("Name", colWidths.name)} ${pad("Qty", colWidths.qty)} ${pad("Price", colWidths.price)} ${pad("Total", colWidths.total)}\n`;
  receiptText += "-".repeat(colWidths.id + colWidths.name + colWidths.qty + colWidths.price + colWidths.total + 4) + "\n";

  items.forEach((item) => {
    receiptText += `${pad(item.item_id, colWidths.id)} ${pad(item.item_name, colWidths.name)} ${pad(item.qty, colWidths.qty)} ${pad(parseFloat(item.price).toFixed(2), colWidths.price, "right")} ${pad(parseFloat(item.rowTotal).toFixed(2), colWidths.total, "right")}\n`;
  });

  receiptText += "-".repeat(colWidths.id + colWidths.name + colWidths.qty + colWidths.price + colWidths.total + 4) + "\n";
  receiptText += `TOTAL: ₹${total_amount}\n`;
  receiptText += `Cash: ₹${cash_amount}   UPI: ₹${upi_amount}   Card: ₹${card_amount}\n`;
  receiptText += "-".repeat(colWidths.id + colWidths.name + colWidths.qty + colWidths.price + colWidths.total + 4) + "\n";
  receiptText += centerText("\n", receiptWidth);
  receiptText += centerText("\n", receiptWidth);
  receiptText += centerText("Thank You for letting us serve you!\n", receiptWidth);
  receiptText += centerText("Please Visit Again.\n", receiptWidth);

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>Receipt</title>
        <style>
          body { font-family: monospace; font-size: 14px; white-space: pre; }
        </style>
      </head>
      <body>
        <pre>${receiptText}</pre>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();

  // const currentDate = new Date().toLocaleString();
  // let billNo = Math.floor(Math.random() * 100000); // you can get real sale_id if needed

  // // Build receipt text
  // let receiptText = `
  //       Dine Out Biriyani
  //       -------------------------
  //       Bill No: ${billNo}
  //       Date   : ${currentDate}
  //       -------------------------
  //       Sl.No  Item        P   Q   T
  //       -------------------------
  // `;

  // cart.forEach((item, idx) => {
  //   // truncate item name for narrow paper
  //   const itemName = item.item_name.substring(0, 10).padEnd(10, " ");
  //   const price = item.price.toFixed(2).padStart(5, " ");
  //   const qty = String(item.qty).padStart(3, " ");
  //   const total = item.rowTotal.toFixed(2).padStart(6, " ");
  //   receiptText += `${String(idx + 1).padEnd(5, " ")} ${itemName}${price}${qty}${total}\n`;
  // });

  // receiptText += `
  //       -------------------------
  //       Overall Total : ₹${overallTotal.toFixed(2)}
  //       -------------------------
  //       Thank You for letting us serve you
  //       Please Visit Again
  // `;

  // // Open print window
  // const printWindow = window.open("", "_blank", "width=400,height=600");
  // printWindow.document.write(`
  //   <html>
  //     <head>
  //       <title>Receipt</title>
  //       <style>
  //         body { font-family: monospace; font-size: 12px; white-space: pre; }
  //         pre { margin: 0; }
  //       </style>
  //     </head>
  //     <body>
  //       <pre>${receiptText}</pre>
  //     </body>
  //   </html>
  // `);
  // printWindow.document.close();
  // printWindow.focus();
  // printWindow.print();
  // printWindow.close();

  // // reset cart & payments
  // setCart([]);
  // setCash(0);
  // setUpi(0);
  // setCard(0);
};
  
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
    padding: "1px",
    borderRadius: "2px",
    textAlign: "center",
    fontSize: ".5em",
    fontWeight: "bold",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
};


  return (
      <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto", fontFamily: "Arial" }}>
        <h1 style={{ textAlign: "center", color: "#d35400" }}>Dine Out Biriyani</h1>
        
      <div>
      <header style={styles.header}>
        <h1 style={{ margin: 0 }}>🍽️ Dine Out Cafeteria - Biriyani Master </h1>
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
        
      {/* Search Section */}
      <div style={{ display: "flex", gap: "20px", background: "#fff8e7", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
        
        {/* Search by ID */}
        <div>
          <label style={{ fontWeight: "bold" }}>Item ID:</label>
          <input
            type="number"
            placeholder="Enter ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            style={{ padding: "10px", width: "150px", borderRadius: "6px", border: "1px solid #ccc", marginLeft: "10px" }}
          />
        </div>

        {/* Search by Name */}
        <div style={{ position: "relative", flex: 1 }}>
          <label style={{ fontWeight: "bold" }}>Item Name:</label>
          <input
            type="text"
            value={term}
            placeholder="Type name..."
            onChange={(e) => setTerm(e.target.value)}
            style={{ padding: "10px", width: "100%", borderRadius: "6px", border: "1px solid #ccc", marginLeft: "10px" }}
          />
          {results.length > 0 && (
            <div style={{ border: "1px solid #ccc", background: "#fff", position: "absolute", top: "45px", width: "95%", zIndex: 10, borderRadius: "6px", overflow: "hidden" }}>
              {results.map((item) => (
                <div
                  key={item.item_id}
                  onClick={() => handleSelect(item)}
                  style={{ padding: "10px", cursor: "pointer", borderBottom: "1px solid #eee" }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "white")}
                >
                  {item.item_name} — ₹{item.price}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quantity & Add */}
      {selectedItem && (
        <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
          <h3>{selectedItem.item_name} — ₹{selectedItem.price}</h3>
          <label>Quantity:</label>
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(parseInt(e.target.value))}
            style={{ padding: "10px", width: "80px", borderRadius: "6px", border: "1px solid #ccc", marginLeft: "10px" }}
          />
          <span style={{ marginLeft: "20px", fontWeight: "bold" }}>
            Row Total: ₹{(selectedItem.price * qty).toFixed(2)}
          </span>
          <br />
          <button
            onClick={addToCart}
            style={{ background: "#27ae60", color: "#fff", border: "none", padding: "10px 15px", marginTop: "10px", borderRadius: "6px", cursor: "pointer" }}
          >
            ➕ Add to List
          </button>
        </div>
      )}

      {/* Receipt Section */}
      {cart.length > 0 && (
        <div>
          <div ref={receiptRef}>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
              <thead>
                <tr style={{ backgroundColor: "#3498db", color: "#fff" }}>
                  <th style={{ padding: "8px", textAlign:"left" }}>Item</th>
                  <th style={{ padding: "8px", textAlign:"left" }}>Qty</th>
                  <th style={{ padding: "8px", textAlign:"left" }}>Price</th>
                  <th style={{ padding: "8px", textAlign:"left" }}>Total</th>
                  <th style={{ padding: "8px", textAlign:"center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, idx) => (
                  <tr key={idx} 
                    style={{
                      backgroundColor: idx % 2 === 0 ? "#ecf0f1" : "#ffffff",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d1f0ff")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? "#ecf0f1" : "#ffffff")}>
                      <td style={{ padding: "8px", textAlign:"left"}}>{item.item_name}</td>
                      <td style={{ padding: "8px", textAlign:"left"}}>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => updateCartItem(idx, parseInt(e.target.value))}
                          style={{ width: "60px", padding: "5px" }}
                        />
                      </td>
                      <td style={{ padding: "8px", textAlign:"left"}}>{item.price}</td>
                      <td style={{ padding: "8px", textAlign:"left"}}>{item.rowTotal.toFixed(2)}</td>
                      <td style={{ padding: "8px", textAlign:"center" }}>
                        <button
                          onClick={() => deleteCartItem(idx)}
                          style={{
                            background: "#e74c3c",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "5px 10px",
                            cursor: "pointer"
                          }}
                        >
                          ❌
                        </button>
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="total">Overall Total: ₹{overallTotal.toFixed(2)}</div>
            <div>Cash: ₹{cash}</div>
            <div>UPI: ₹{upi}</div>
            <div>Card: ₹{card}</div>
          </div>

          {/* Payment Inputs */}
          <div style={{ marginTop: "10px" }}>
            <label>Cash: </label>
            <input type="number" value={cash} onChange={(e) => setCash(Number(e.target.value))} style={{ marginRight: "10px" }} />
            <label>UPI: </label>
            <input type="number" value={upi} onChange={(e) => setUpi(Number(e.target.value))} style={{ marginRight: "10px" }} />
            <label>Card: </label>
            <input type="number" value={card} onChange={(e) => setCard(Number(e.target.value))} />
          </div>

          {/* Save Sale */}
          <button
            onClick={handleSubmit}
            hidden={!isPaymentValid}
            style={{
              background: "#27ae60",
              color: "#fff",
              border: "none",
              padding: "10px 15px",
              borderRadius: "6px",
              cursor: "pointer",
              marginTop: "10px"
            }}
          >
            💾 Submit & Print
          </button>
          <button
            onClick={handleClear}
            style={{
              background: "#c0392b",
              color: "#fff",
              border: "none",
              padding: "10px 15px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            ❌ Clear
          </button>
        </div>
      )}
    </div>
  );
}