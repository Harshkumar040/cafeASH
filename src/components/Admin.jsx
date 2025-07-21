import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

export default function Admin() {
  const location = useLocation();

  // AshCafé styling
  const styles = {
    page: {
      padding: "2rem",
      backgroundColor: "#f5f5f4",
      minHeight: "100vh"
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto"
    },
    nav: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(8px)",
      borderRadius: "8px",
      padding: "1rem 2rem",
      boxShadow: "0 2px 10px rgba(146, 64, 14, 0.1)",
      marginBottom: "2rem",
      display: "flex",
      gap: "2rem"
    },
    navLink: {
      color: "#57534e",
      textDecoration: "none",
      fontWeight: "500",
      fontSize: "1.1rem",
      padding: "0.5rem 0",
      position: "relative",
      transition: "all 0.2s ease"
    },
    activeNavLink: {
      color: "#4e2a11ff",
      fontWeight: "600"
    },
    navLinkUnderline: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      height: "2px",
      backgroundColor: "#92400e",
      transform: "scaleX(0)",
      transition: "transform 0.2s ease"
    },
    activeNavLinkUnderline: {
      transform: "scaleX(1)"
    },
    content: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(8px)",
      borderRadius: "8px",
      padding: "2rem",
      boxShadow: "0 2px 10px rgba(146, 64, 14, 0.1)"
    }
  };

  const isActive = (path) => {
    return location.pathname === path || 
           location.pathname.startsWith(`${path}/`);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <nav style={styles.nav}>
          <Link 
            to="/admin" 
            style={isActive("/admin") ? 
              {...styles.navLink, ...styles.activeNavLink} : 
              styles.navLink
            }
          >
            Users
            <span 
              style={isActive("/admin") ? 
                {...styles.navLinkUnderline, ...styles.activeNavLinkUnderline} : 
                styles.navLinkUnderline
              }
            />
          </Link>
          <Link 
            to="/admin/products" 
            style={isActive("/admin/products") ? 
              {...styles.navLink, ...styles.activeNavLink} : 
              styles.navLink
            }
          >
            Products
            <span 
              style={isActive("/admin/products") ? 
                {...styles.navLinkUnderline, ...styles.activeNavLinkUnderline} : 
                styles.navLinkUnderline
              }
            />
          </Link>
          <Link 
            to="/admin/orders" 
            style={isActive("/admin/orders") ? 
              {...styles.navLink, ...styles.activeNavLink} : 
              styles.navLink
            }
          >
            Orders
            <span 
              style={isActive("/admin/orders") ? 
                {...styles.navLinkUnderline, ...styles.activeNavLinkUnderline} : 
                styles.navLinkUnderline
              }
            />
          </Link>
        </nav>

        <div style={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}