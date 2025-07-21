import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import App, { AppContext } from "../App";

export default function Header() {
  const { user, cart } = useContext(AppContext);

  const styles = {
    header: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      backgroundColor: "#4e2a11ff", // Changed to brown
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      transition: "all 0.3s ease",
      boxShadow: "0 1px 6px rgba(0, 0, 0, 0.06)",
    },
    container: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "1rem 1.5rem",
    },
    nav: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
    },
    logo: {
      fontSize: "1.75rem",
      fontFamily: "Georgia, serif",
      fontWeight: "bold",
      color: "white", // Changed to white
      textDecoration: "none",
      transition: "color 0.2s ease",
    },
    navLinks: {
      display: "flex",
      alignItems: "center",
      gap: "1.25rem",
      flexWrap: "wrap",
    },
    link: {
      fontWeight: 500,
      color: "white", // Changed to white
      textDecoration: "none",
      transition: "all 0.2s ease",
      paddingBottom: "0.2rem",
      borderBottom: "2px solid transparent",
      fontSize: "1rem",
    },
    hoverLink: {
      color: "#f3f4f6", // Lighter white for hover
      borderBottom: "2px solid white", // White underline on hover
    },
    badge: {
      backgroundColor: "white", // Changed to white
      color: "#92400e", // Brown text for badge
      fontSize: "0.75rem",
      fontWeight: "bold",
      borderRadius: "9999px",
      padding: "0.15rem 0.5rem",
      marginLeft: "0.35rem",
    },
  };

  const handleHover = (e, hover = true) => {
    if (hover) {
      Object.assign(e.currentTarget.style, styles.hoverLink);
    } else {
      e.currentTarget.style.color = "white";
      e.currentTarget.style.borderBottom = "2px solid transparent";
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <nav style={styles.nav}>
          {/* Logo */}
          <Link
            to="/"
            style={styles.logo}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f3f4f6")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
          >
            AshCafé
          </Link>

          {/* Navigation Links */}
          <div style={styles.navLinks}>
            {[
              { to: "/", text: "Home" },
              {
                to: "/cart",
                text: "My Cart",
                badge: cart?.length > 0 ? cart.length : null,
              },
              { to: "/order", text: "My Order" },
            ].map(({ to, text, badge }) => (
              <Link
                key={to}
                to={to}
                style={styles.link}
                onMouseEnter={(e) => handleHover(e, true)}
                onMouseLeave={(e) => handleHover(e, false)}
              >
                {text}
                {badge && <span style={styles.badge}>{badge}</span>}
              </Link>
            ))}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                style={styles.link}
                onMouseEnter={(e) => handleHover(e, true)}
                onMouseLeave={(e) => handleHover(e, false)}
              >
                Admin
              </Link>
            )}

            <Link
              to={user?.token ? "/profile" : "/login"}
              style={styles.link}
              onMouseEnter={(e) => handleHover(e, true)}
              onMouseLeave={(e) => handleHover(e, false)}
            >
              {user?.token ? "Profile" : "Login"}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}