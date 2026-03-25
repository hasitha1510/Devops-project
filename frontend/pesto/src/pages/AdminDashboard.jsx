import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";

const API = "http://localhost:3001";

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("pestoToken");
  const role  = localStorage.getItem("pestoRole");

  useEffect(() => {
    if (!token || role !== "admin") { navigate("/login"); return; }
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const res = await axios.get(`${API}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div style={styles.page}>
      <AdminNavbar active="/admin" />
      <div style={styles.main}>
        <p style={{ color: "#aaa", fontSize: "1.2rem" }}>Loading...</p>
      </div>
    </div>
  );

  const statCards = [
    { icon: "🧾", label: "Total Orders",   value: stats?.totalOrders   || 0, color: "#B21A1A" },
    { icon: "💰", label: "Total Revenue",  value: `₹${stats?.totalRevenue || 0}`, color: "#2e7d32" },
    { icon: "👥", label: "Total Users",    value: stats?.totalUsers    || 0, color: "#1565c0" },
    { icon: "⏳", label: "Pending Orders", value: stats?.pendingOrders || 0, color: "#f57c00" },
  ];

  return (
    <div style={styles.page}>
      <AdminNavbar active="/admin" />
      <div style={styles.main}>

        <div style={styles.header}>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Welcome back! Here's what's happening at Pesto.</p>
        </div>

        {/* STAT CARDS */}
        <div style={styles.statsGrid}>
          {statCards.map((s, i) => (
            <div key={i} style={styles.statCard}>
              <div style={{ ...styles.statIconBox, background: s.color + "18" }}>
                <span style={styles.statIcon}>{s.icon}</span>
              </div>
              <div>
                <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* QUICK LINKS */}
        <div style={styles.quickLinks}>
          <div style={styles.quickCard} onClick={() => navigate("/admin/orders")}>
            <h3 style={styles.quickTitle}>🧾 Manage Orders</h3>
            <p style={styles.quickDesc}>View all orders, update status and see customer details.</p>
            <span style={styles.quickArrow}>→</span>
          </div>
          <div style={styles.quickCard} onClick={() => navigate("/admin/users")}>
            <h3 style={styles.quickTitle}>👥 Manage Users</h3>
            <p style={styles.quickDesc}>View all registered users and their order history.</p>
            <span style={styles.quickArrow}>→</span>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", minHeight: "100vh", background: "#f5f5f5" },
  main: { marginLeft: 240, flex: 1, padding: "2.5rem" },
  header: { marginBottom: "2rem" },
  title: { fontSize: "2rem", fontWeight: 800, color: "#1a1a1a", margin: 0 },
  subtitle: { color: "#888", margin: "0.3rem 0 0" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.2rem", marginBottom: "2rem" },
  statCard: {
    background: "#fff", borderRadius: 18, padding: "1.5rem",
    display: "flex", alignItems: "center", gap: "1.2rem",
    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
  },
  statIconBox: { width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  statIcon: { fontSize: "1.6rem" },
  statValue: { fontSize: "1.8rem", fontWeight: 800, lineHeight: 1 },
  statLabel: { fontSize: "0.85rem", color: "#888", marginTop: "0.2rem" },
  quickLinks: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" },
  quickCard: {
    background: "#fff", borderRadius: 18, padding: "1.8rem",
    cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
    transition: "transform 0.2s ease",
    position: "relative",
  },
  quickTitle: { fontSize: "1.2rem", fontWeight: 700, margin: "0 0 0.5rem" },
  quickDesc: { color: "#888", fontSize: "0.9rem", margin: 0 },
  quickArrow: { position: "absolute", top: "1.8rem", right: "1.8rem", fontSize: "1.3rem", color: "#B21A1A" },
};