import React, { useState } from 'react';
import './OrderMgmt.css';

function OrderMgmt() {
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedChair, setSelectedChair] = useState(null);
  const [orders, setOrders] = useState({});

  const tables = [
    { id: 1, name: 'Table 1', chairs: ['A', 'B', 'C', 'D'] },
    { id: 2, name: 'Table 2', chairs: ['A', 'B', 'C', 'D'] },
    { id: 3, name: 'Table 3', chairs: ['A', 'B', 'C', 'D'] },
    { id: 4, name: 'Table 4', chairs: ['A', 'B', 'C', 'D'] },
    { id: 5, name: 'Table 5', chairs: ['A', 'B', 'C', 'D'] },
  ];

  const handleTableSelect = (tableId) => {
    setSelectedTable(tableId);
    setSelectedChair(null);
  };

  const handleChairSelect = (chair) => {
    setSelectedChair(chair);
  };

  const getTableStatus = (tableId) => {
    const tableOrders = orders[tableId];
    if (!tableOrders) return 'available';
    if (Object.keys(tableOrders).length === 4) return 'full';
    return 'partial';
  };

  const getChairStatus = (tableId, chair) => {
    return orders[tableId] && orders[tableId][chair] ? 'occupied' : 'available';
  };

  return (
    <div className="order-management">
      <div className="header">
        <h1>🍽️ Order Management</h1>
        <p>Select a table and chair to manage customer orders</p>
      </div>
      
      <div className="restaurant-layout">
        <div className="tables-grid">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`table-card ${selectedTable === table.id ? 'selected' : ''} ${getTableStatus(table.id)}`}
              onClick={() => handleTableSelect(table.id)}
            >
              <div className="table-header">
                <h3>{table.name}</h3>
                <span className={`status-badge ${getTableStatus(table.id)}`}>
                  {getTableStatus(table.id)}
                </span>
              </div>
              
              <div className="chairs-container">
                {table.chairs.map((chair) => (
                  <div
                    key={chair}
                    className={`chair ${getChairStatus(table.id, chair)} ${
                      selectedTable === table.id && selectedChair === chair ? 'selected' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectedTable === table.id) {
                        handleChairSelect(chair);
                      }
                    }}
                  >
                    <span className="chair-label">Chair {chair}</span>
                    {getChairStatus(table.id, chair) === 'occupied' && (
                      <span className="occupied-icon">👤</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {selectedTable && (
          <div className="order-details">
            <h3>Table {selectedTable} Orders</h3>
            {selectedChair ? (
              <div className="chair-details">
                <h4>Chair {selectedChair}</h4>
                <div className="order-actions">
                  <button className="btn-primary">Take Order</button>
                  <button className="btn-secondary">View Menu</button>
                  <button className="btn-success">Send to Kitchen</button>
                  <button className="btn-warning">Generate Bill</button>
                </div>
              </div>
            ) : (
              <p>Select a chair to manage orders</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderMgmt;