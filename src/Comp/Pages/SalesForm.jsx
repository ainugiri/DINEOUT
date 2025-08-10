import React, { useState } from "react";

const emptyItem = { itemNo: "", quantity: "", price: "", total: 0 };

function SalesForm() {
    const [items, setItems] = useState([ { ...emptyItem } ]);
    const [payments, setPayments] = useState({ cash: "", upi: "", card: "" });

    // Handle item change
    const handleItemChange = (idx, field, value) => {
        const updated = items.map((item, i) =>
            i === idx
                ? {
                        ...item,
                        [field]: value,
                        total:
                            field === "quantity" || field === "price"
                                ? (field === "quantity"
                                        ? value
                                        : item.quantity) *
                                    (field === "price" ? value : item.price || 0)
                                : item.total,
                    }
                : item
        );
        setItems(updated);
    };

    // Add new item row
    const addItem = () => setItems([...items, { ...emptyItem }]);

    // Remove item row
    const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));

    // Calculate overall total
    const overallTotal = items.reduce((sum, item) => sum + Number(item.total || 0), 0);

    // Handle payment change
    const handlePaymentChange = (field, value) => {
        setPayments({ ...payments, [field]: value });
    };

    // Print handler
    const handlePrint = () => window.print();

    return (
        <div style={{ maxWidth: 700, margin: "auto", padding: 24 }}>
            <h2>Sales Entry Form</h2>
            <table border="1" cellPadding={8} style={{ width: "100%", marginBottom: 16 }}>
                <thead>
                    <tr>
                        <th>Item No</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Row Total</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, idx) => (
                        <tr key={idx}>
                            <td>
                                <input
                                    type="text"
                                    value={item.itemNo}
                                    onChange={e => handleItemChange(idx, "itemNo", e.target.value)}
                                    style={{ width: 80 }}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={e => handleItemChange(idx, "quantity", e.target.value)}
                                    style={{ width: 60 }}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    value={item.price}
                                    onChange={e => handleItemChange(idx, "price", e.target.value)}
                                    style={{ width: 80 }}
                                />
                            </td>
                            <td>{item.total || 0}</td>
                            <td>
                                {items.length > 1 && (
                                    <button type="button" onClick={() => removeItem(idx)}>
                                        Remove
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button type="button" onClick={addItem}>
                Add Item
            </button>
            <div style={{ marginTop: 24 }}>
                <strong>Overall Total: ₹{overallTotal}</strong>
            </div>
            <div style={{ marginTop: 24 }}>
                <h3>Payment Details</h3>
                <label>
                    Cash: ₹
                    <input
                        type="number"
                        min="0"
                        value={payments.cash}
                        onChange={e => handlePaymentChange("cash", e.target.value)}
                        style={{ width: 100, marginRight: 16 }}
                    />
                </label>
                <label>
                    UPI: ₹
                    <input
                        type="number"
                        min="0"
                        value={payments.upi}
                        onChange={e => handlePaymentChange("upi", e.target.value)}
                        style={{ width: 100, marginRight: 16 }}
                    />
                </label>
                <label>
                    Card: ₹
                    <input
                        type="number"
                        min="0"
                        value={payments.card}
                        onChange={e => handlePaymentChange("card", e.target.value)}
                        style={{ width: 100 }}
                    />
                </label>
            </div>
            <div style={{ marginTop: 32 }}>
                <button type="button" onClick={handlePrint}>
                    Print
                </button>
            </div>
        </div>
    );
}

export default SalesForm;