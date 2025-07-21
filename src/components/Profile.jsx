import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState({});
  const { user, setUser } = useContext(AppContext);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const url = `${API_URL}/api/users/${user.id}/profile`;
      const result = await axios.get(url);
      setProfile(result.data);
      setForm({
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        email: result.data.email
      });
    } catch (err) {
      setError("Failed to load profile data");
    }
  };

  useEffect(() => {
    if (user?.id) fetchProfile();
  }, [user]);

  const logout = () => {
    setUser({});
    navigate("/");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      const url = `${API_URL}/api/users/${profile._id}/profile`;
      await axios.patch(url, form);
      setError("success|Profile updated successfully!");
      fetchProfile();
    } catch (err) {
      setError(`error|${err.response?.data?.message || "Update failed"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // AshCafé styling
  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#f5f5f4",
      padding: "2rem"
    },
    container: {
      maxWidth: "600px",
      width: "100%",
      margin: "0 auto",
      padding: "2.5rem",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(8px)",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(146, 64, 14, 0.1)",
      border: "1px solid rgba(146, 64, 14, 0.1)"
    },
    title: {
      color: "#4e2a11ff",
      fontFamily: '"Georgia", serif',
      fontSize: "1.8rem",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "2rem"
    },
    input: {
      width: "100%",
      padding: "0.8rem 1rem",
      marginBottom: "1.2rem",
      border: "1px solid #d6d3d1",
      borderRadius: "6px",
      fontSize: "1rem",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      transition: "all 0.2s ease"
    },
    inputFocus: {
      borderColor: "#4e2a11ff",
      boxShadow: "0 0 0 3px rgba(146, 64, 14, 0.1)"
    },
    button: {
      padding: "0.9rem 1.5rem",
      backgroundColor: "#4e2a11ff",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "1rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      marginRight: "1rem"
    },
    buttonHover: {
      backgroundColor: "#78350f"
    },
    logoutButton: {
      backgroundColor: "transparent",
      color: "#4e2a11ff",
      border: "1px solid #4e2a11ff"
    },
    logoutButtonHover: {
      backgroundColor: "#fee2e2",
      color: "#b91c1c"
    },
    message: {
      textAlign: "center",
      margin: "1.2rem 0",
      minHeight: "1.5rem",
      fontSize: "0.95rem",
      padding: "0.5rem"
    },
    error: {
      color: "#dc2626",
      backgroundColor: "#fee2e2"
    },
    success: {
      color: "#16a34a",
      backgroundColor: "#dcfce7"
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      color: "#57534e",
      fontWeight: "500"
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "1.5rem"
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>My Profile</h2>
        
        {error && (
          <div style={{
            ...styles.message,
            ...(error.startsWith("success") ? styles.success : styles.error)
          }}>
            {error.split("|")[1]}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label style={styles.label}>First Name</label>
            <input
              name="firstName"
              type="text"
              style={styles.input}
              onChange={handleChange}
              value={form.firstName || ""}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => e.target.style.borderColor = "#d6d3d1"}
            />
          </div>

          <div>
            <label style={styles.label}>Last Name</label>
            <input
              name="lastName"
              type="text"
              style={styles.input}
              onChange={handleChange}
              value={form.lastName || ""}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => e.target.style.borderColor = "#d6d3d1"}
            />
          </div>

          <div>
            <label style={styles.label}>Email Address</label>
            <input
              name="email"
              type="email"
              style={styles.input}
              onChange={handleChange}
              value={form.email || ""}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => e.target.style.borderColor = "#d6d3d1"}
            />
          </div>

          <div>
            <label style={styles.label}>Password (leave blank to keep current)</label>
            <input
              name="password"
              type="password"
              style={styles.input}
              onChange={handleChange}
              placeholder="••••••••"
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => e.target.style.borderColor = "#d6d3d1"}
            />
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              style={styles.button}
              disabled={isSubmitting}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
            >
              {isSubmitting ? "Updating..." : "Save Changes"}
            </button>

            <button
              type="button"
              style={{...styles.button, ...styles.logoutButton}}
              onClick={logout}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.logoutButtonHover)}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = styles.logoutButton.color;
              }}
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}