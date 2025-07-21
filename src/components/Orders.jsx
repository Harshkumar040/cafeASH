import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../App";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useContext(AppContext);
  const API_URL = import.meta.env.VITE_API_URL;

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
    filterContainer: {
      display: "flex",
      gap: "1rem",
      marginBottom: "2rem",
      alignItems: "center"
    },
    select: {
      padding: "0.7rem 1rem",
      borderRadius: "6px",
      border: "1px solid #d6d3d1",
      backgroundColor: "white",
      fontSize: "1rem",
      color: "#57534e",
      minWidth: "200px"
    },
    orderCard: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderRadius: "8px",
      padding: "1.5rem",
      boxShadow: "0 2px 10px rgba(146, 64, 14, 0.1)",
      marginBottom: "1.5rem"
    },
    orderHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1rem",
      flexWrap: "wrap",
      gap: "1rem"
    },
    orderId: {
      fontWeight: "bold",
      color: "#57534e",
      fontSize: "1.1rem"
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
      color: "#92400e"
    },
    statusCompleted: {
      backgroundColor: "#dcfce7",
      color: "#166534"
    },
    statusCancelled: {
      backgroundColor: "#fee2e2",
      color: "#b91c1c"
    },
    customerInfo: {
      marginBottom: "1rem",
      color: "#57534e"
    },
    itemsList: {
      margin: "1rem 0",
      paddingLeft: "1.5rem"
    },
    item: {
      marginBottom: "0.5rem",
      display: "flex",
      justifyContent: "space-between"
    },
    actionButtons: {
      display: "flex",
      gap: "0.5rem",
      marginTop: "1rem"
    },
    button: {
      padding: "0.5rem 1rem",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontSize: "0.9rem"
    },
    primaryButton: {
      backgroundColor: "#4e2a11ff",
      color: "white",
      "&:hover": {
        backgroundColor: "#4e2a11ff"
      }
    },
    dangerButton: {
      backgroundColor: "#dc2626",
      color: "white",
      "&:hover": {
        backgroundColor: "#b91c1c"
      }
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "1rem",
      marginTop: "2rem"
    },
    paginationButton: {
      padding: "0.5rem 1rem",
      backgroundColor: "#4e2a11ff",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      "&:disabled": {
        opacity: 0.5,
        cursor: "not-allowed"
      }
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
    emptyState: {
      textAlign: "center",
      padding: "3rem",
      color: "#57534e"
    }
  };

  const fetchOrders = async () => {
    try {
      setError("");
      const url = `${API_URL}/api/orders/?page=${page}&limit=${limit}&status=${status}`;
      const result = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setOrders(result.data.orders);
      setTotalPages(Math.ceil(result.data.total / limit));
    } catch (err) {
      setError("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status, page, limit]);

  const updateOrder = async (newStatus, id) => {
    try {
      setIsUpdating(true);
      const url = `${API_URL}/api/orders/${id}`;
      await axios.patch(url, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      fetchOrders();
    } catch (err) {
      setError("Failed to update order");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusStyle = (orderStatus) => {
    switch (orderStatus.toLowerCase()) {
      case 'completed':
        return { ...styles.status, ...styles.statusCompleted };
      case 'cancelled':
        return { ...styles.status, ...styles.statusCancelled };
      case 'pending':
      default:
        return { ...styles.status, ...styles.statusPending };
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>Order Management</h2>
        
        {error && (
          <div style={{ ...styles.message, ...styles.error }}>
            {error}
          </div>
        )}

        <div style={styles.filterContainer}>
          <select 
            style={styles.select}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1); // Reset to first page when filter changes
            }}
          >
            <option value="">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select
            style={styles.select}
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1); // Reset to first page when limit changes
            }}
          >
            <option value="3">3 per page</option>
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
          </select>
        </div>

        {orders.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No orders found</p>
          </div>
        ) : (
          <>
            {orders.map((order) => (
              <div key={order._id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <div style={styles.orderId}>Order #{order._id.slice(-6).toUpperCase()}</div>
                  <div style={styles.orderValue}>${order.orderValue.toFixed(2)}</div>
                  <div style={getStatusStyle(order.status)}>{order.status}</div>
                </div>

                <div style={styles.customerInfo}>
                  <div>Customer: {order.email}</div>
                  <div>Date: {new Date(order.createdAt).toLocaleString()}</div>
                </div>

                <div style={styles.itemsList}>
                  {order.items.map((item, index) => (
                    <div key={index} style={styles.item}>
                      <span>{item.productName} (x{item.qty})</span>
                      <span>${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {order.status === "Pending" && (
                  <div style={styles.actionButtons}>
                    <button
                      style={{ ...styles.button, ...styles.primaryButton }}
                      onClick={() => updateOrder("completed", order._id)}
                      disabled={isUpdating}
                    >
                      Mark as Completed
                    </button>
                    <button
                      style={{ ...styles.button, ...styles.dangerButton }}
                      onClick={() => updateOrder("cancelled", order._id)}
                      disabled={isUpdating}
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            ))}

            <div style={styles.pagination}>
              <button
                style={styles.paginationButton}
                onClick={() => setPage(page - 1)}
                disabled={page === 1 || isUpdating}
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                style={styles.paginationButton}
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages || isUpdating}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}