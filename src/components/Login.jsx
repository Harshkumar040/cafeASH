import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../App";

export default function Login() {
  const { user, setUser } = useContext(AppContext);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      const url = `${API_URL}/api/users/login`;
      const result = await axios.post(url, user);
      setUser(result.data);
      setError("success|Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setError(`error|${err.response?.data?.message || "Invalid email or password"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Matching AshCafé design system
  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#f5f5f4" // Light stone background
    },
    container: {
      maxWidth: "480px",
      width: "90%",
      margin: "4rem auto",
      padding: "2.5rem",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(8px)",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(146, 64, 14, 0.1)",
      border: "1px solid rgba(146, 64, 14, 0.1)"
    },
    title: {
      color: "#4e2a11ff  ", // Amber-800
      fontFamily: '"Georgia", serif',
      fontSize: "1.8rem",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "2rem",
      letterSpacing: "0.5px"
    },
    input: {
      width: "100%",
      padding: "0.8rem 1rem",
      marginBottom: "1.2rem",
      border: "1px solid #d6d3d1", // Stone-300
      borderRadius: "6px",
      fontSize: "1rem",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      transition: "all 0.2s ease"
    },
    inputFocus: {
      borderColor: "#92400e",
      boxShadow: "0 0 0 3px rgba(146, 64, 14, 0.1)"
    },
    button: {
      width: "100%",
      padding: "0.9rem",
      backgroundColor: "#4e2a11ff  ", // Amber-800
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "1rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      marginTop: "0.5rem"
    },
    buttonHover: {
      backgroundColor: "#44250fff" // Amber-900
    },
    link: {
      color: "#4e2a11ff ",
      textDecoration: "none",
      display: "block",
      textAlign: "center",
      marginTop: "1.5rem",
      fontSize: "0.95rem",
      transition: "all 0.2s ease"
    },
    linkHover: {
      color: "#78350f",
      textDecoration: "underline"
    },
    message: {
      textAlign: "center",
      margin: "1.2rem 0",
      minHeight: "1.5rem",
      fontSize: "0.95rem",
      padding: "0.5rem"
    },
    error: {
      color: "#dc2626", // Red-600
      backgroundColor: "#fee2e2" // Red-50
    },
    success: {
      color: "#16a34a", // Green-600
      backgroundColor: "#dcfce7" // Green-50
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>Welcome to AshCafé</h2>
        
        {error && (
          <div style={{
            ...styles.message,
            ...(error.startsWith("success") ? styles.success : styles.error)
          }}>
            {error.split("|")[1]}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            style={styles.input}
            placeholder="Email Address"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
            onFocus={(e) => Object.assign(e.currentTarget.style, styles.inputFocus)}
            onBlur={(e) => e.currentTarget.style.borderColor = "#d6d3d1"}
          />

          <input
            type="password"
            style={styles.input}
            placeholder="Password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
            onFocus={(e) => Object.assign(e.currentTarget.style, styles.inputFocus)}
            onBlur={(e) => e.currentTarget.style.borderColor = "#d6d3d1"}
          />

          <button
            type="submit"
            style={styles.button}
            disabled={isSubmitting}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
          >
            {isSubmitting ? "Signing In..." : "Login"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link 
            to="/register" 
            style={styles.link}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.linkHover)}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = styles.link.color;
              e.currentTarget.style.textDecoration = "none";
            }}
          >
            Don't have an account? Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}