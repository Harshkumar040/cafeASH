import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import axios from "axios";

export default function Cart() {
  const { user, cart, setCart } = useContext(AppContext);
  const [orderValue, setOrderValue] = useState(0);
  const [error, setError] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const styles = {
    page: {
      padding: "2rem",
      backgroundColor: "#f8f3ee", // Warm off-white background
      minHeight: "100vh"
    },
    container: {
      maxWidth: "800px",
      margin: "0 auto"
    },
    title: {
      color: "#4e2a11ff", // Primary mocha color
      fontFamily: '"Georgia", serif',
      fontSize: "1.8rem",
      marginBottom: "2rem",
      textAlign: "center"
    },
    cartItem: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderRadius: "8px",
      padding: "1.5rem",
      boxShadow: "0 2px 10px rgba(78, 42, 17, 0.1)", // Mocha shadow
      marginBottom: "1.5rem",
      display: "flex",
      alignItems: "center",
      gap: "2rem",
      border: "1px solid #e7d5c9" // Light mocha border
    },
    itemImage: {
      width: "100px",
      height: "100px",
      objectFit: "cover",
      borderRadius: "6px",
      border: "1px solid #e7d5c9"
    },
    itemDetails: {
      flex: 1
    },
    itemName: {
      color: "#4e2a11ff", // Primary mocha color
      fontSize: "1.2rem",
      marginBottom: "0.5rem",
      fontWeight: "600"
    },
    itemPrice: {
      color: "#6b4e3a", // Secondary mocha
      marginBottom: "0.5rem"
    },
    itemTotal: {
      color: "#4e2a11ff",
      fontWeight: "bold"
    },
    quantityControls: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      margin: "0.5rem 0"
    },
    quantityButton: {
      width: "30px",
      height: "30px",
      backgroundColor: "#4e2a11ff", // Primary mocha
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontWeight: "bold"
    },
    orderSummary: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderRadius: "8px",
      padding: "1.5rem",
      boxShadow: "0 2px 10px rgba(78, 42, 17, 0.1)",
      marginTop: "2rem",
      border: "1px solid #e7d5c9"
    },
    totalAmount: {
      fontSize: "1.3rem",
      fontWeight: "bold",
      color: "#4e2a11ff", // Primary mocha
      textAlign: "right",
      margin: "1rem 0"
    },
    actionButton: {
      padding: "0.8rem 1.5rem",
      backgroundColor: "#4e2a11ff", // Primary mocha
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontSize: "1rem",
      width: "100%",
      fontWeight: "500"
    },
    loginButton: {
      backgroundColor: "transparent",
      color: "#4e2a11ff", // Primary mocha
      border: "1px solid #4e2a11ff"
    },
    message: {
      padding: "1rem",
      borderRadius: "6px",
      textAlign: "center",
      marginBottom: "1rem"
    },
    error: {
      backgroundColor: "#f5e6e6",
      color: "#b71c1c",
      border: "1px solid #ef9a9a"
    },
    success: {
      backgroundColor: "#e8f5e9",
      color: "#2e7d32",
      border: "1px solid #a5d6a7"
    },
    emptyCart: {
      textAlign: "center",
      color: "#6b4e3a",
      padding: "2rem"
    }
  };

  const increment = (id, qty) => {
    const updatedCart = cart.map((product) =>
      product._id === id ? { ...product, qty: qty + 1 } : product
    );
    setCart(updatedCart);
  };

  const decrement = (id, qty) => {
    if (qty <= 1) {
      const updatedCart = cart.filter((product) => product._id !== id);
      setCart(updatedCart);
    } else {
      const updatedCart = cart.map((product) =>
        product._id === id ? { ...product, qty: qty - 1 } : product
      );
      setCart(updatedCart);
    }
  };

  useEffect(() => {
    setOrderValue(
      cart.reduce((sum, item) => {
        return sum + item.qty * item.price;
      }, 0)
    );
  }, [cart]);

  const placeOrder = async () => {
    setIsPlacingOrder(true);
    setError("");
    try {
      const url = `${API_URL}/api/orders`;
      const newOrder = {
        userId: user._id,
        email: user.email,
        orderValue,
        items: cart,
      };
      await axios.post(url, newOrder);
      setCart([]);
      navigate("/order");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>My Cart</h2>
        
        {error && (
          <div style={{ ...styles.message, ...styles.error }}>
            {error}
          </div>
        )}

        {cart.length === 0 ? (
          <div style={styles.emptyCart}>
            <p>Your cart is empty</p>
            <button 
              style={{ ...styles.actionButton, marginTop: "1rem" }}
              onClick={() => navigate("/")}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#3a1f0d"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#4e2a11ff"}
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item._id} style={styles.cartItem}>
                <img 
                  src={item.imgUrl} 
                  alt={item.productName}
                  style={styles.itemImage}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/100?text=No+Image";
                  }}
                />
                <div style={styles.itemDetails}>
                  <h3 style={styles.itemName}>{item.productName}</h3>
                  <p style={styles.itemPrice}>₹{item.price.toFixed(2)} each</p>
                  <div style={styles.quantityControls}>
                    <button
                      style={styles.quantityButton}
                      onClick={() => decrement(item._id, item.qty)}
                      onMouseEnter={(e) => e.target.style.backgroundColor = "#3a1f0d"}
                      onMouseLeave={(e) => e.target.style.backgroundColor = "#4e2a11ff"}
                    >
                      -
                    </button>
                    <span style={{ color: "#4e2a11ff" }}>{item.qty}</span>
                    <button
                      style={styles.quantityButton}
                      onClick={() => increment(item._id, item.qty)}
                      onMouseEnter={(e) => e.target.style.backgroundColor = "#3a1f0d"}
                      onMouseLeave={(e) => e.target.style.backgroundColor = "#4e2a11ff"}
                    >
                      +
                    </button>
                  </div>
                  <p style={styles.itemTotal}>Total: ₹{(item.price * item.qty).toFixed(2)}</p>
                </div>
              </div>
            ))}

            <div style={styles.orderSummary}>
              <h3 style={styles.totalAmount}>Order Total: ₹{orderValue.toFixed(2)}</h3>
              
              {user?.token ? (
                <button
                  style={styles.actionButton}
                  onClick={placeOrder}
                  disabled={isPlacingOrder}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#3a1f0d"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "#4e2a11ff"}
                >
                  {isPlacingOrder ? "Placing Order..." : "Place Order"}
                </button>
              ) : (
                <button
                  style={{ ...styles.actionButton, ...styles.loginButton }}
                  onClick={() => navigate("/login")}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#f8f3ee";
                    e.target.style.color = "#3a1f0d";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#4e2a11ff";
                  }}
                >
                  Login to Place Order
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}