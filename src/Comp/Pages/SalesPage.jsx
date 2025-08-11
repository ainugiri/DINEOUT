import React, { useState, useEffect, useRef } from "react";

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
const handleSubmit = async () => {
  if (overallTotal <= 0) {
    alert("No items to save!");
    return;
  }

  // Prepare sale data
  const saleData = {
    total_amount: overallTotal,
    cash_amount: cash,
    upi_amount: upi,
    card_amount: card,
    items: cart.map(item => ({
      product_id: item.item_id,
      product_name: item.item_name,
      quantity: item.qty,
      price: item.price,
      total: item.rowTotal
    }))
  };

  try {
    const res = await fetch("http://localhost:5000/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(saleData)
    });

    if (!res.ok) throw new Error("Failed to save sale");

    alert("Sale saved successfully!");
    handlePrint(); // Print after saving
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

  const handlePrint = () => {
    const printContents = receiptRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=400,height=600");
    const currentDate = new Date().toLocaleString();
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: monospace; font-size: 14px; padding: 10px; }
            h2 { text-align: center; margin-bottom: 2px; }
            .date { text-align: center; font-size: 12px; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { text-align: left; padding: 4px; }
            tr.border-bottom td { border-bottom: 1px dashed #000; }
            .total { font-weight: bold; border-top: 2px solid #000; padding-top: 5px; }
            .footer { text-align: center; margin-top: 10px; font-size: 12px; }
          </style>
        </head>
        <body>
          <h2>Dine Out Biriyani</h2>
          <div class="date">${currentDate}</div>
          ${printContents}
          <div class="footer">
            Thank You for letting us serve you.<br/>
            Please Visit Again.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    setCart([]); 
    setCash(0);
    setUpi(0);
    setCard(0);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center", color: "#d35400" }}>Dine Out Biriyani</h1>

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
                    <td style={{ padding: "8px", textAlign:"left"}}>{item.qty}</td>
                    <td style={{ padding: "8px", textAlign:"left"}}>{item.price}</td>
                    <td style={{ padding: "8px", textAlign:"left"}}>{item.rowTotal.toFixed(2)}</td>
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
            onClick={handlePrint}
            style={{ background: "#2980b9", color: "#fff", border: "none", padding: "10px 15px", borderRadius: "6px", cursor: "pointer", marginTop: "10px" }}
          >
            🖨 Print Bill
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