// --------------------- Backend Server.js ------------------------
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection (use promise pool)
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "iPhone4me",
  database: "restaurant_db"
}).promise();

db.getConnection()
  .then(() => console.log("✅ MySQL Connected..."))
  .catch((err) => {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  });

// Get menu item by ID
app.get("/menu/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT item_id, item_name, price FROM menu_items WHERE item_id = ?",
      [req.params.id]
    );
    if (result.length === 0) return res.status(404).json({ message: "Item not found" });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search menu items by name
app.get("/menu/search/:term", async (req, res) => {
  try {
    const searchTerm = `%${req.params.term}%`;
    const [result] = await db.query(
      "SELECT item_id, item_name, price FROM menu_items WHERE item_name LIKE ? LIMIT 10",
      [searchTerm]
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login API (⚠️ plaintext for now)
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [results] = await db.query(
      "SELECT * FROM users WHERE username = ? AND password_hash = ?",
      [username, password]
    );
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const user = results[0];
    res.json({
      message: "Login successful",
      user: {
        id: user.user_id,
        username: user.username,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Insert sales + items
app.post("/sales", async (req, res) => {
  try {
    const { total_amount, cash_amount, upi_amount, card_amount, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items provided" });
    }

    // Insert sale record
    const [saleResult] = await db.query(
      "INSERT INTO sales (total_amount, cash_amount, upi_amount, card_amount) VALUES (?, ?, ?, ?)",
      [total_amount, cash_amount, upi_amount, card_amount]
    );

    const saleId = saleResult.insertId;

    // Insert sale items
    for (const item of items) {
      // console.log("Inserting item:", item); // 👈 log item being inserted
      // console.log("With saleId:", saleId); // 👈 log saleId
      // console.log("Item details:", {
      //   item_id: item.item_id,
      //   sale_id: saleId,
      //   menu_id: item.item_id,
      //   quantity: item.qty,
      //   price: item.price || 0,
      //   total: item.rowTotal || 0
      // });
      await db.query(
        "INSERT INTO sale_items (item_id,sale_id,quantity,price,total,TRANS_TIME) VALUES (?, ?, ?, ?, ?, ?)",
        [
          item.item_id,
          saleId,
          item.qty,
          item.price || 0,     // 👈 avoid undefined
          item.rowTotal || 0,   // 👈 avoid undefined
          new Date()            // 👈 current timestamp
        ]
      );
    }

    res.json({ message: "Sale saved successfully", sale_id: saleId });
  } catch (error) {
    console.error("❌ Error saving sale:", error);  // 👈 log exact error
    res.status(500).json({ error: "Failed to save sale", details: error.message });
  }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
