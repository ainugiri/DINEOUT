const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "iPhone4me",
  database: "restaurant_db"
});

db.connect((err) => {
  if (err) throw err;
    //   else success message
    console.log("✅ MySQL Connected...");
});

app.get("/menu/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT item_id, item_name, price FROM menu_items WHERE item_id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.length === 0) return res.status(404).json({ message: "Item not found" });
      res.json(result[0]);
    }
  );
});

// Search menu items by name
app.get("/menu/search/:term", (req, res) => {
  const searchTerm = `%${req.params.term}%`;
  db.query(
    "SELECT item_id, item_name, price FROM menu_items WHERE item_name LIKE ? LIMIT 10",
    [searchTerm],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
});

// Login API
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM users WHERE username = ? AND password_hash = ?";
  db.query(query, [username, password], (err, results) => {
    if (err) throw err;

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
  });
});

// sales insert
app.post("/sales", async (req, res) => {
  const { total_amount, cash_amount, upi_amount, card_amount, items } = req.body;

  try {
    // Insert into sales table
    const [saleResult] = await db.query(
      "INSERT INTO sales (total_amount, cash_amount, upi_amount, card_amount) VALUES (?, ?, ?, ?)",
      [total_amount, cash_amount, upi_amount, card_amount]
    );

    const saleId = saleResult.insertId;

    // Insert each item
    for (const item of items) {
      await db.query(
        "INSERT INTO sale_items (sale_id, product_id, product_name, quantity, price, total) VALUES (?, ?, ?, ?, ?, ?)",
        [saleId, item.product_id, item.product_name, item.quantity, item.price, item.total]
      );
    }

    res.json({ success: true, sale_id: saleId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});


app.listen(5000, () => console.log("🚀 Server running on port 5000"));
