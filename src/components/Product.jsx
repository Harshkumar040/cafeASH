import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../App";

export default function Product() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [products, setProducts] = useState([]);
  const [feedback, setFeedback] = useState(""); // e.g. "success|Added"
  const [loading, setLoading] = useState(true);
  const { cart, setCart } = useContext(AppContext);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  useEffect(() => {
    if (feedback) {
      const timeout = setTimeout(() => setFeedback(""), 3000);
      return () => clearTimeout(timeout);
    }
  }, [feedback]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/products?page=${page}&limit=12`);
      const newProducts = res.data.products || [];

      if (page === 1) {
        setProducts(newProducts);
      } else {
        setProducts((prev) => [...prev, ...newProducts]);
      }

      setHasMore(newProducts.length > 0);
      setFeedback("");
    } catch (err) {
      setFeedback("error|Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const exists = cart.find((item) => item._id === product._id);
    if (!exists) {
      setCart([...cart, { ...product, qty: 1 }]);
      setFeedback("success|Added to cart");
    } else {
      setFeedback("error|Product already in cart");
    }
  };

  const getMessage = () => {
    if (!feedback) return "";
    return feedback.includes("|") ? feedback.split("|")[1] : feedback;
  };

  const getMessageStyle = () => {
    const base = {
      padding: "1rem",
      marginBottom: "2rem",
      textAlign: "center",
      borderRadius: "6px",
      fontWeight: "500",
    };
    if (feedback.startsWith("error")) {
      return { ...base, backgroundColor: "#fee2e2", color: "#b91c1c" };
    }
    if (feedback.startsWith("success")) {
      return { ...base, backgroundColor: "#dcfce7", color: "#15803d" };
    }
    return base;
  };

  const styles = {
    page: {
      padding: "1rem",
      paddingTop: "2rem",
      paddingBottom: "5rem", // ✅ extra padding to prevent overlap
      backgroundColor: "#f5f5f4",
      minHeight: "100vh",
      width: "100%",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      width: "100%",
    },
    title: {
      color: "#4e2a11ff",
      fontFamily: '"Georgia", serif',
      fontSize: "2rem",
      marginBottom: "2rem",
      textAlign: "center",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "2rem",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: "8px",
      padding: "1.5rem",
      boxShadow: "0 2px 10px rgba(146, 64, 14, 0.1)",
      display: "flex",
      flexDirection: "column",
    },
    imageBox: {
      height: "200px",
      borderRadius: "6px",
      overflow: "hidden",
      marginBottom: "1rem",
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.3s",
    },
    name: {
      textAlign: "center",
      fontSize: "1.2rem",
      color: "#4e2a11ff",
      marginBottom: "0.5rem",
    },
    desc: {
      textAlign: "center",
      color: "#57534e",
      lineHeight: "1.5",
      flexGrow: 1,
      marginBottom: "1rem",
    },
    price: {
      textAlign: "center",
      color: "#4e2a11ff",
      fontSize: "1.3rem",
      fontWeight: "bold",
      marginBottom: "1rem",
    },
    button: {
      backgroundColor: "#4e2a11ff",
      color: "white",
      padding: "0.7rem",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    loadMore: {
      display: "block",
      margin: "3rem auto 0",
      padding: "0.8rem 2rem",
      backgroundColor: "#4e2a11ff",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>Our Menu</h2>

        {feedback && <div style={getMessageStyle()}>{getMessage()}</div>}

        <div style={styles.grid}>
          {products.map((product) => (
            <div
              key={product._id}
              style={styles.card}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector("img");
                if (img) img.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector("img");
                if (img) img.style.transform = "scale(1)";
              }}
            >
              <div style={styles.imageBox}>
                <img
                  src={product.imgUrl || "https://via.placeholder.com/280x200?text=No+Image"}
                  alt={product.productName}
                  style={styles.image}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/280x200?text=No+Image";
                  }}
                />
              </div>
              <h3 style={styles.name}>{product.productName}</h3>
              <p style={styles.desc}>{product.description}</p>
              <div style={styles.price}>₹{parseFloat(product.price).toFixed(2)}</div>
              <button
                style={styles.button}
                onClick={() => addToCart(product)}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#78350f")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#92400e")}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {hasMore && !loading && (
          <button style={styles.loadMore} onClick={() => setPage((prev) => prev + 1)}>
            Load More
          </button>
        )}
      </div>
    </div>
  );
}
