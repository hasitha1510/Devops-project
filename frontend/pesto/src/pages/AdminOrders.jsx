import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";

const API = process.env.REACT_APP_API_URL;

const STATUS_COLORS = {
  Pending:   { bg: "#fff3e0", color: "#f57c00" },
  Accepted:  { bg: "#e3f2fd", color: "#1565c0" },
  Preparing: { bg: "#f3e5f5", color: "#6a1b9a" },
  Delivered: { bg: "#e8f5e9", color: "#2e7d32" },
};

export default function AdminOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("All");
  const navigate = useNavigate();
  const token = localStorage.getItem("pestoToken");
  const role  = localStorage.getItem("pestoRole");

  useEffect(() => {
    if (!token || role !== "admin") { navigate("/login"); return; }
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const res = await axios.get(`${API}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.orders);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) navigate("/login");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    try {
      await axios.put(`${API}/admin/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch (err) {
      alert("Failed to update status.");
    }
  }

  const statuses = ["All", "Pending", "Accepted", "Preparing", "Delivered"];
  const filtered = filter === "All" ? orders : orders.filter(o => o.status === filter);

  if (loading) return (
    <div style={styles.page}>
      <AdminNavbar active="/admin/orders" />
      <div style={styles.main}><p style={{ color: "#aaa" }}>Loading orders...</p></div>
    </div>
  );

  return (
    <div style={styles.page}>
      <AdminNavbar active="/admin/orders" />
      <div style={styles.main}>

        <div style={styles.header}>
          <h1 style={styles.title}>Orders</h1>
          <p style={styles.subtitle}>{orders.length} total orders</p>
        </div>

        {/* FILTER TABS */}
        <div style={styles.tabs}>
          {statuses.map(s => (
            <button key={s}
              style={{ ...styles.tab, ...(filter === s ? styles.tabActive : {}) }}
              onClick={() => setFilter(s)}
            >
              {s}
              <span style={styles.tabCount}>
                {s === "All" ? orders.length : orders.filter(o => o.status === s).length}
              </span>
            </button>
          ))}
        </div>

        {/* ORDERS LIST */}
        {filtered.length === 0 ? (
          <div style={styles.empty}>No orders found.</div>
        ) : (
          filtered.map(order => (
            <div key={order.id} style={styles.orderCard}>

              {/* LEFT: Item info */}
              <img src={order.image} alt={order.name} style={styles.orderImg}
                onError={e => e.target.style.display = "none"} />
              <div style={styles.orderInfo}>
                <h3 style={styles.orderName}>{order.name}</h3>
                <p style={styles.orderMeta}>Qty: {order.quantity} &nbsp;•&nbsp; ₹{order.price * order.quantity}</p>
                <p style={styles.orderMeta}>
                  🕐 {new Date(order.ordered_at).toLocaleString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit"
                  })}
                </p>
              </div>

              {/* MIDDLE: Customer info */}
              <div style={styles.customerInfo}>
                <div style={styles.customerName}>
                  👤 {order.full_name || order.username}
                </div>
                <div style={styles.customerDetail}>✉️ {order.email}</div>
                {order.phone   && <div style={styles.customerDetail}>📞 {order.phone}</div>}
                {order.address && <div style={styles.customerDetail}>📍 {order.address}</div>}
              </div>

              {/* RIGHT: Status */}
              <div style={styles.statusSection}>
                <div style={{ ...styles.statusBadge, ...STATUS_COLORS[order.status] }}>
                  {order.status}
                </div>
                <select
                  style={styles.statusSelect}
                  value={order.status}
                  onChange={e => updateStatus(order.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", minHeight: "100vh", background: "#f5f5f5" },
  main: { marginLeft: 240, flex: 1, padding: "2.5rem" },
  header: { marginBottom: "1.5rem" },
  title: { fontSize: "2rem", fontWeight: 800, color: "#1a1a1a", margin: 0 },
  subtitle: { color: "#888", margin: "0.3rem 0 0" },
  tabs: { display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" },
  tab: {
    padding: "0.5rem 1.2rem", borderRadius: 999,
    border: "2px solid #ddd", background: "#fff",
    fontWeight: 600, cursor: "pointer",
    fontFamily: "Baloo 2, cursive", fontSize: "0.9rem",
    display: "flex", alignItems: "center", gap: "0.5rem",
  },
  tabActive: { background: "#B21A1A", color: "#fff", borderColor: "#B21A1A" },
  tabCount: {
    background: "rgba(0,0,0,0.1)", borderRadius: 999,
    padding: "0 6px", fontSize: "0.75rem",
  },
  empty: { textAlign: "center", padding: "3rem", color: "#aaa", fontSize: "1rem" },
  orderCard: {
    background: "#fff", borderRadius: 18, padding: "1.5rem",
    display: "grid", gridTemplateColumns: "70px 1fr 1fr auto",
    gap: "1.5rem", alignItems: "center",
    boxShadow: "0 4px 16px rgba(0,0,0,0.06)", marginBottom: "1rem",
  },
  orderImg: { width: 70, height: 70, borderRadius: 12, objectFit: "cover" },
  orderInfo: {},
  orderName: { fontSize: "1.05rem", fontWeight: 700, margin: "0 0 0.3rem" },
  orderMeta: { fontSize: "0.85rem", color: "#777", margin: "0.2rem 0" },
  customerInfo: {
    borderLeft: "1px solid #f0f0f0", paddingLeft: "1.5rem",
  },
  customerName: { fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.3rem" },
  customerDetail: { fontSize: "0.82rem", color: "#777", margin: "0.2rem 0" },
  statusSection: { display: "flex", flexDirection: "column", gap: "0.6rem", alignItems: "flex-end" },
  statusBadge: {
    padding: "0.3rem 0.9rem", borderRadius: 999,
    fontSize: "0.82rem", fontWeight: 700,
  },
  statusSelect: {
    padding: "0.5rem 0.8rem", borderRadius: 10,
    border: "1.5px solid #ddd", fontFamily: "Baloo 2, cursive",
    fontSize: "0.88rem", cursor: "pointer", outline: "none",
  },
};