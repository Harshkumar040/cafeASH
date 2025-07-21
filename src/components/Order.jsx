import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../App";

export default function Order() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { user } = useContext(AppContext);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // AshCafé styling
  const styles = {
    page: {
      padding: "2rem",
      backgroundColor: "#f5f5f4",
      minHeight: "100vh"
    },
    container: {
      maxWidth: "1000px",
      margin: "0 auto"
    },
    title: {
      color: "#4e2a11ff",
      fontFamily: '"Georgia", serif',
      fontSize: "1.8rem",
      marginBottom: "2rem",
      textAlign: "center"
    },
    orderCard: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderRadius: "8px",
      padding: "1.5rem",
      boxShadow: "0 2px 10px rgba(146, 64, 14, 0.1)",
      marginBottom: "2rem"
    },
    orderHeader: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "1rem",
      paddingBottom: "0.5rem",
      borderBottom: "1px solid #d6d3d1"
    },
    orderId: {
      fontWeight: "bold",
      color: "#57534e"
    },
    orderValue: {
      color: "#4e2a11ff",
      fontWeight: "bold"
    },
    status: {
      padding: "0.3rem 0.8rem",
      borderRadius: "12px",
      fontSize: "0.9rem",
      fontWeight: "500"
    },
    statusPending: {
      backgroundColor: "#fef3c7",
      color: "#4e2a11ff"
    },
    statusCompleted: {
      backgroundColor: "#dcfce7",
      color: "#166534"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "1rem"
    },
    tableHeader: {
      backgroundColor: "#4e2a11ff",
      color: "white",
      padding: "0.8rem",
      textAlign: "left"
    },
    tableCell: {
      padding: "0.8rem",
      borderBottom: "1px solid #d6d3d1"
    },
    productCell: {
      display: "flex",
      alignItems: "center",
      gap: "1rem"
    },
    productImage: {
      width: "60px",
      height: "60px",
      objectFit: "cover",
      borderRadius: "4px"
    },
    message: {
      padding: "1rem",
      borderRadius: "6px",
      textAlign: "center",
      marginBottom: "1rem"
    },
    error: {
      backgroundColor: "#fee2e2",
      color: "#dc2626"
    },
    loading: {
      backgroundColor: "#e0f2fe",
      color: "#0369a1"
    },
    emptyState: {
      textAlign: "center",
      padding: "3rem",
      color: "#57534e"
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = `${API_URL}/api/orders/${user.email}`;
      const result = await axios.get(url);
      setOrders(result.data);
      setError("");
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchOrders();
    }
  }, [user]);

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { ...styles.status, ...styles.statusCompleted };
      case 'pending':
      default:
        return { ...styles.status, ...styles.statusPending };
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>My Orders</h2>
        
        {(error || loading) && (
          <div style={{
            ...styles.message,
            ...(error ? styles.error : styles.loading)
          }}>
            {error || "Loading your orders..."}
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div style={styles.emptyState}>
            <p>You haven't placed any orders yet</p>
          </div>
        )}

        {orders.map((order) => (
          <div key={order._id} style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <div style={styles.orderId}>Order #{order._id.slice(-6).toUpperCase()}</div>
              <div style={styles.orderValue}>${order.orderValue.toFixed(2)}</div>
              <div style={getStatusStyle(order.status)}>{order.status}</div>
            </div>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Product</th>
                  <th style={styles.tableHeader}>Price</th>
                  <th style={styles.tableHeader}>Quantity</th>
                  <th style={styles.tableHeader}>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item._id}>
                    <td style={styles.tableCell}>
                      <div style={styles.productCell}>
                        {item.imgUrl && (
                          <img 
                            src={item.imgUrl} 
                            alt={item.productName}
                            style={styles.productImage}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/60?text=No+Image";
                            }}
                          />
                        )}
                        <span>{item.productName}</span>
                      </div>
                    </td>
                    <td style={styles.tableCell}>${item.price.toFixed(2)}</td>
                    <td style={styles.tableCell}>{item.qty}</td>
                    <td style={styles.tableCell}>${(item.qty * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}