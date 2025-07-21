import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { AppContext } from "../App";

export default function Users() {
  const [users, setUsers] = useState([]);
  const { user: currentUser } = useContext(AppContext);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const frmRef = useRef();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });
  const [page, setPage] = useState(1);
  const [searchVal, setSearchVal] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);
  const [editId, setEditId] = useState();
  const API_URL = import.meta.env.VITE_API_URL;

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
    title: {
      color: "#4e2a11ff",
      fontFamily: '"Georgia", serif',
      fontSize: "1.8rem",
      marginBottom: "2rem",
      textAlign: "center"
    },
    formCard: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(8px)",
      borderRadius: "8px",
      padding: "2rem",
      boxShadow: "0 2px 10px rgba(146, 64, 14, 0.1)",
      marginBottom: "2rem"
    },
    formGroup: {
      marginBottom: "1.5rem"
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      color: "#57534e",
      fontWeight: "500"
    },
    input: {
      width: "100%",
      padding: "0.8rem",
      border: "1px solid #d6d3d1",
      borderRadius: "6px",
      fontSize: "1rem",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      transition: "all 0.2s ease"
    },
    select: {
      width: "100%",
      padding: "0.8rem",
      border: "1px solid #d6d3d1",
      borderRadius: "6px",
      fontSize: "1rem",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      appearance: "none",
      backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 0.8rem center",
      backgroundSize: "1rem"
    },
    button: {
      padding: "0.8rem 1.5rem",
      backgroundColor: "#4e2a11ff",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "1rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      marginRight: "0.5rem"
    },
    secondaryButton: {
      backgroundColor: "transparent",
      color: "#4e2a11ff",
      border: "1px solid #4e2a11ff"
    },
    searchContainer: {
      display: "flex",
      gap: "0.5rem",
      marginBottom: "1.5rem"
    },
    searchInput: {
      flex: "1",
      padding: "0.8rem",
      border: "1px solid #d6d3d1",
      borderRadius: "6px",
      fontSize: "1rem"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      margin: "1.5rem 0"
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
    actionCell: {
      display: "flex",
      gap: "0.5rem"
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "1rem",
      marginTop: "1.5rem"
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
    success: {
      backgroundColor: "#dcfce7",
      color: "#16a34a"
    },
    loading: {
      backgroundColor: "#e0f2fe",
      color: "#0369a1"
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
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError("");
      const url = `${API_URL}/api/users/?page=${page}&limit=${limit}&search=${searchVal}`;
      const result = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      setUsers(result.data.users);
      setTotalPages(Math.ceil(result.data.total / limit));
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      const url = `${API_URL}/api/users/${id}`;
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      setError("success|User deleted successfully");
      fetchUsers();
    } catch (err) {
      setError("error|Failed to delete user");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!frmRef.current.checkValidity()) {
      frmRef.current.reportValidity();
      return;
    }
    try {
      setIsSubmitting(true);
      const url = `${API_URL}/api/users`;
      await axios.post(url, form, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      setError("success|User added successfully");
      fetchUsers();
      resetForm();
    } catch (err) {
      setError(`error|${err.response?.data?.message || "Failed to add user"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (user) => {
    setEditId(user._id);
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: "",
      role: user.role,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!frmRef.current.checkValidity()) {
      frmRef.current.reportValidity();
      return;
    }
    try {
      setIsSubmitting(true);
      const url = `${API_URL}/api/users/${editId}`;
      await axios.patch(url, form, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      setError("success|User updated successfully");
      fetchUsers();
      setEditId();
      resetForm();
    } catch (err) {
      setError(`error|${err.response?.data?.message || "Failed to update user"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditId();
    resetForm();
  };

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const getStatusStyle = (role) => {
    return role === 'admin' ? 
      { ...styles.status, ...styles.statusCompleted } : 
      { ...styles.status, ...styles.statusPending };
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>User Management</h2>
        
        {(error || isLoading) && (
          <div style={{
            ...styles.message,
            ...(error.startsWith("error") ? styles.error : 
                 error.startsWith("success") ? styles.success : styles.loading)
          }}>
            {error.split("|")[1] || "Loading users..."}
          </div>
        )}

        <div style={styles.formCard}>
          <form ref={frmRef}>
            <div style={styles.formGroup}>
              <label style={styles.label}>First Name</label>
              <input
                name="firstName"
                value={form.firstName}
                type="text"
                style={styles.input}
                placeholder="First Name"
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Last Name</label>
              <input
                name="lastName"
                value={form.lastName}
                type="text"
                style={styles.input}
                placeholder="Last Name"
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                name="email"
                value={form.email}
                type="email"
                style={styles.input}
                placeholder="Email Address"
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                {editId ? "New Password (leave blank to keep current)" : "Password"}
              </label>
              <input
                name="password"
                value={form.password}
                type="password"
                style={styles.input}
                placeholder={editId ? "New Password" : "Password"}
                onChange={handleChange}
                required={!editId}
                minLength="6"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Role</label>
              <select
                name="role"
                value={form.role}
                style={styles.select}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Role --</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              {editId ? (
                <>
                  <button
                    type="button"
                    style={styles.button}
                    onClick={handleUpdate}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update"}
                  </button>
                  <button
                    type="button"
                    style={{...styles.button, ...styles.secondaryButton}}
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  style={styles.button}
                  onClick={handleAdd}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add User"}
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={styles.searchContainer}>
          <input
            type="text"
            style={styles.searchInput}
            placeholder="Search users..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
          <button
            style={styles.button}
            onClick={handleSearch}
          >
            Search
          </button>
          <select
            style={{...styles.select, width: "auto"}}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
          </select>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>First Name</th>
              <th style={styles.tableHeader}>Last Name</th>
              <th style={styles.tableHeader}>Email</th>
              <th style={styles.tableHeader}>Role</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td style={styles.tableCell}>{user.firstName}</td>
                <td style={styles.tableCell}>{user.lastName}</td>
                <td style={styles.tableCell}>{user.email}</td>
                <td style={styles.tableCell}>
                  <span style={getStatusStyle(user.role)}>
                    {user.role}
                  </span>
                </td>
                <td style={{...styles.tableCell, ...styles.actionCell}}>
                  <button
                    style={{...styles.button, padding: "0.5rem 1rem"}}
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    style={{...styles.button, ...styles.secondaryButton, padding: "0.5rem 1rem"}}
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={styles.pagination}>
          <button
            style={styles.button}
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            style={styles.button}
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}