import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const frmRef = useRef();
  const [form, setForm] = useState({
    productName: "",
    description: "",
    price: "",
    imgUrl: "",
  });
  const [page, setPage] = useState(1);
  const [searchVal, setSearchVal] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10); // Increased default limit
  const [editId, setEditId] = useState();
  const API_URL = import.meta.env.VITE_API_URL;

  // AshCafé color palette
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
      marginBottom: "1.5rem",
      textAlign: "center"
    },
    card: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(8px)",
      borderRadius: "8px",
      padding: "2rem",
      boxShadow: "0 2px 10px rgba(146, 64, 14, 0.1)",
      marginBottom: "2rem"
    },
    formGroup: {
      marginBottom: "1rem"
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
      transition: "all 0.2s ease"
    },
    inputFocus: {
      borderColor: "#4e2a11ff",
      boxShadow: "0 0 0 3px rgba(146, 64, 14, 0.1)"
    },
    button: {
      padding: "0.7rem 1.2rem",
      backgroundColor: "#4e2a11ff",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      marginRight: "0.5rem",
      transition: "all 0.2s ease"
    },
    buttonHover: {
      backgroundColor: "#4e2a11ff"
    },
    secondaryButton: {
      backgroundColor: "transparent",
      color: "#4e2a11ff",
      border: "1px solid #4e2a11ff"
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
      borderBottom: "1px solid #d6d3d1",
      verticalAlign: "middle"
    },
    productImage: {
      width: "120px",
      height: "120px",
      objectFit: "cover",
      borderRadius: "4px"
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "1rem",
      marginTop: "1.5rem"
    },
    disabledButton: {
      opacity: 0.5,
      cursor: "not-allowed"
    },
    searchContainer: {
      display: "flex",
      gap: "0.5rem",
      marginBottom: "1.5rem"
    },
    searchInput: {
      flex: 1,
      padding: "0.8rem",
      border: "1px solid #d6d3d1",
      borderRadius: "6px"
    },
    message: {
      padding: "0.8rem",
      borderRadius: "6px",
      marginBottom: "1rem",
      textAlign: "center"
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
    }
  };

  const fetchProducts = async () => {
    try {
      setError("loading|Loading products...");
      const url = `${API_URL}/api/products/?page=${page}&limit=${limit}&search=${searchVal}`;
      const result = await axios.get(url);
      setProducts(result.data.products);
      setTotalPages(Math.ceil(result.data.total / limit));
      setError("");
    } catch (err) {
      setError("error|Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, limit]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const url = `${API_URL}/api/products/${id}`;
      await axios.delete(url);
      setError("success|Product deleted successfully");
      fetchProducts();
    } catch (err) {
      setError("error|Failed to delete product");
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
      const url = `${API_URL}/api/products`;
      await axios.post(url, form);
      setError("success|Product added successfully");
      fetchProducts();
      resetForm();
    } catch (err) {
      setError(`error|${err.response?.data?.message || "Failed to add product"}`);
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setForm({
      productName: product.productName,
      description: product.description,
      price: product.price,
      imgUrl: product.imgUrl,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!frmRef.current.checkValidity()) {
      frmRef.current.reportValidity();
      return;
    }
    try {
      const url = `${API_URL}/api/products/${editId}`;
      await axios.patch(url, form);
      setError("success|Product updated successfully");
      fetchProducts();
      setEditId();
      resetForm();
    } catch (err) {
      setError(`error|${err.response?.data?.message || "Failed to update product"}`);
    }
  };

  const handleCancel = () => {
    setEditId();
    resetForm();
  };

  const resetForm = () => {
    setForm({
      productName: "",
      description: "",
      price: "",
      imgUrl: "",
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>Product Management</h2>
        
        {error && (
          <div style={{
            ...styles.message,
            ...(error.startsWith("success") ? styles.success : 
                 error.startsWith("error") ? styles.error : styles.loading)
          }}>
            {error.split("|")[1]}
          </div>
        )}

        <div style={styles.card}>
          <form ref={frmRef}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Product Name</label>
              <input
                name="productName"
                value={form.productName}
                type="text"
                style={styles.input}
                placeholder="Product Name"
                onChange={handleChange}
                required
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => e.target.style.borderColor = "#d6d3d1"}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <input
                name="description"
                value={form.description}
                type="text"
                style={styles.input}
                placeholder="Description"
                onChange={handleChange}
                required
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => e.target.style.borderColor = "#d6d3d1"}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Price</label>
              <input
                name="price"
                value={form.price}
                type="number"
                style={styles.input}
                placeholder="Price"
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => e.target.style.borderColor = "#d6d3d1"}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Image URL</label>
              <input
                name="imgUrl"
                value={form.imgUrl}
                type="url"
                style={styles.input}
                placeholder="Image URL"
                onChange={handleChange}
                required
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => e.target.style.borderColor = "#d6d3d1"}
              />
            </div>

            <div>
              {editId ? (
                <>
                  <button
                    type="button"
                    style={styles.button}
                    onClick={handleUpdate}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    style={{...styles.button, ...styles.secondaryButton}}
                    onClick={handleCancel}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f4"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  style={styles.button}
                  onClick={handleAdd}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
                >
                  Add Product
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={styles.card}>
          <form onSubmit={handleSearch} style={styles.searchContainer}>
            <input
              type="text"
              style={styles.searchInput}
              placeholder="Search products..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
            <button
              type="submit"
              style={styles.button}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
            >
              Search
            </button>
          </form>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Image</th>
                <th style={styles.tableHeader}>Product Name</th>
                <th style={styles.tableHeader}>Description</th>
                <th style={styles.tableHeader}>Price</th>
                <th style={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td style={styles.tableCell}>
                    {product.imgUrl && (
                      <img 
                        src={product.imgUrl} 
                        alt={product.productName} 
                        style={styles.productImage}
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = "https://via.placeholder.com/120?text=No+Image";
                        }}
                      />
                    )}
                  </td>
                  <td style={styles.tableCell}>{product.productName}</td>
                  <td style={styles.tableCell}>{product.description}</td>
                  <td style={styles.tableCell}>₹{parseFloat(product.price).toFixed(2)}</td>
                  <td style={styles.tableCell}>
                    <button
                      style={{...styles.button, marginRight: "0.5rem"}}
                      onClick={() => handleEdit(product)}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
                    >
                      Edit
                    </button>
                    <button
                      style={{...styles.button, ...styles.secondaryButton}}
                      onClick={() => handleDelete(product._id)}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f4"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
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
              style={{
                ...styles.button,
                ...(page === 1 && styles.disabledButton)
              }}
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              onMouseEnter={(e) => !(page === 1) && (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              style={{
                ...styles.button,
                ...(page === totalPages && styles.disabledButton)
              }}
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              onMouseEnter={(e) => !(page === totalPages) && (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
            >
              Next
            </button>
            <select 
              value={limit} 
              onChange={(e) => setLimit(Number(e.target.value))}
              style={{...styles.input, width: "auto", padding: "0.5rem"}}
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}