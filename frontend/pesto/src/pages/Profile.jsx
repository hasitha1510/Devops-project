import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const API = process.env.REACT_APP_API_URL;

export default function Profile() {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("pestoToken");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    loadAll();
  }, []);

  async function loadAll() {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const meRes = await axios.get(`${API}/auth/me`, { headers });
      setUser(meRes.data);

      try {
        const profileRes = await axios.get(`${API}/profile`, { headers });
        setProfile(profileRes.data);
      } catch (_) {
        setProfile(null);
      }

      try {
        const cartRes = await axios.get(`${API}/cart`, { headers });
        setOrders(cartRes.data.items || []);
      } catch (_) {
        setOrders([]);
      }

    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("pestoToken");
        localStorage.removeItem("pestoUser");
        navigate("/login");
      } else {
        setError("Could not load profile. Make sure backend is running.");
      }
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("pestoToken");
    localStorage.removeItem("pestoUser");
    navigate("/login");
  }

  const totalSpent = orders.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (loading) return (
    <>
      <Navbar />
      <div style={{ textAlign: "center", padding: "5rem", color: "#aaa", fontSize: "1.2rem" }}>
        Loading profile...
      </div>
    </>
  );

  if (error) return (
    <>
      <Navbar />
      <div style={{ textAlign: "center", padding: "5rem", color: "#B21A1A", fontSize: "1.1rem" }}>
        {error}
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div style={styles.wrapper}>

        {/* HERO */}
        <div style={styles.hero}>
          <div style={styles.avatar}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div style={styles.heroInfo}>
            <h2 style={styles.heroName}>{user?.username}</h2>
            <p style={styles.heroEmail}>✉️ {user?.email}</p>
            {profile?.phone && <p style={styles.heroEmail}>📞 {profile.phone}</p>}
          </div>
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>

        {/* STATS */}
        <div style={styles.statsRow}>
          {[
            { icon: "🛒", value: orders.length,    label: "Items Ordered" },
            { icon: "💰", value: `₹${totalSpent}`, label: "Total Spent" },
            { icon: "👤", value: profile?.profile_complete ? "Complete" : "Incomplete", label: "Profile" },
          ].map((s, i) => (
            <div key={i} style={styles.statCard}>
              <div style={styles.statIcon}>{s.icon}</div>
              <div style={styles.statValue}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* SETUP PROMPT */}
        {!profile?.profile_complete && (
          <div style={styles.setupPrompt}>
            <span>⚠️ Complete your profile for faster checkout</span>
            <button style={styles.setupBtn} onClick={() => navigate("/setup")}>Complete Now</button>
          </div>
        )}

        {/* PROFILE DETAILS */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Profile Details</h3>
            <button style={styles.editBtn} onClick={() => navigate("/setup")}>✏️ Edit</button>
          </div>
          {[
            { label: "Full Name",        value: profile?.full_name, icon: "👤" },
            { label: "Phone Number",     value: profile?.phone,     icon: "📞" },
            { label: "Delivery Address", value: profile?.address,   icon: "📍" },
          ].map((row, i) => (
            <div key={i} style={styles.detailRow}>
              <div style={styles.detailIcon}>{row.icon}</div>
              <div>
                <div style={styles.detailLabel}>{row.label}</div>
                <div style={row.value ? styles.detailValue : styles.notSet}>
                  {row.value || "Not set"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ORDER HISTORY */}
        <h3 style={styles.sectionTitle}>🕐 Order History</h3>
        {orders.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>🛍️ You haven't ordered anything yet!</p>
            <button style={styles.browseBtn} onClick={() => navigate("/")}>Browse Menu</button>
          </div>
        ) : (
          orders.map((item, i) => (
            <div key={i} style={styles.orderCard}>
              <img src={item.image} alt={item.name} style={styles.orderImg}
                onError={e => e.target.style.display = "none"} />
              <div style={styles.orderInfo}>
                <h4 style={{ margin: 0 }}>{item.name}</h4>
                <p style={{ color: "#777", fontSize: "0.85rem", margin: "0.2rem 0 0" }}>Qty: {item.quantity}</p>
              </div>
              <div style={styles.orderPrice}>₹{item.price * item.quantity}</div>
            </div>
          ))
        )}

      </div>
    </>
  );
}

const styles = {
  wrapper: { maxWidth: 900, margin: "2rem auto", padding: "0 1.5rem 3rem" },
  hero: {
    background: "#fff", borderRadius: 24, padding: "2rem",
    display: "flex", alignItems: "center", gap: "1.5rem",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)", marginBottom: "1.5rem",
    borderTop: "6px solid #B21A1A",
  },
  avatar: {
    width: 80, height: 80, borderRadius: "50%",
    background: "linear-gradient(135deg, #B21A1A, #fdb813)",
    color: "#fff", fontWeight: 800, fontSize: "2rem",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  heroInfo: { flex: 1 },
  heroName: { fontSize: "1.6rem", margin: "0 0 0.2rem" },
  heroEmail: { color: "#777", fontSize: "0.9rem", margin: "0.2rem 0" },
  logoutBtn: {
    background: "#fdecea", color: "#B21A1A", border: "none",
    padding: "0.6rem 1.4rem", borderRadius: 999,
    fontWeight: 700, cursor: "pointer", fontFamily: "Baloo 2, cursive",
  },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "1.5rem" },
  statCard: {
    background: "#fff", borderRadius: 18, padding: "1.5rem",
    textAlign: "center", boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  },
  statIcon: { fontSize: "1.8rem", marginBottom: "0.4rem" },
  statValue: { fontSize: "1.6rem", fontWeight: 800, color: "#B21A1A" },
  statLabel: { fontSize: "0.85rem", color: "#777" },
  setupPrompt: {
    background: "#fff8e1", borderRadius: 14, padding: "1rem 1.5rem",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: "1.5rem", fontSize: "0.9rem", color: "#666",
  },
  setupBtn: {
    background: "#fdb813", border: "none", padding: "0.5rem 1.2rem",
    borderRadius: 999, fontWeight: 700, cursor: "pointer", fontFamily: "Baloo 2, cursive",
  },
  card: {
    background: "#fff", borderRadius: 18, padding: "1.5rem",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)", marginBottom: "1.5rem",
  },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" },
  cardTitle: { fontSize: "1.1rem", margin: 0 },
  editBtn: {
    background: "#fff8e1", color: "#f57c00", border: "none",
    padding: "0.4rem 1rem", borderRadius: 999,
    fontWeight: 600, cursor: "pointer", fontFamily: "Baloo 2, cursive",
  },
  detailRow: {
    display: "flex", gap: "1rem", alignItems: "flex-start",
    padding: "0.7rem 0", borderBottom: "1px solid #f5f5f5",
  },
  detailIcon: {
    width: 36, height: 36, borderRadius: "50%",
    background: "#fdecea", display: "flex",
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  detailLabel: { fontSize: "0.78rem", color: "#aaa", marginBottom: "0.2rem" },
  detailValue: { fontWeight: 600, fontSize: "0.95rem" },
  notSet: { color: "#ccc", fontStyle: "italic", fontSize: "0.9rem" },
  sectionTitle: { fontSize: "1.3rem", marginBottom: "1rem" },
  orderCard: {
    background: "#fff", borderRadius: 18, padding: "1rem 1.5rem",
    display: "flex", alignItems: "center", gap: "1rem",
    boxShadow: "0 6px 16px rgba(0,0,0,0.06)", marginBottom: "1rem",
  },
  orderImg: { width: 60, height: 60, borderRadius: 12, objectFit: "cover" },
  orderInfo: { flex: 1 },
  orderPrice: { fontWeight: 700, color: "#B21A1A", fontSize: "1.1rem" },
  empty: {
    background: "#fff", borderRadius: 18, padding: "3rem",
    textAlign: "center", color: "#aaa",
    boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
  },
  browseBtn: {
    background: "#fdb813", border: "none",
    padding: "0.6rem 1.8rem", borderRadius: 999,
    fontWeight: 700, cursor: "pointer", fontFamily: "Baloo 2, cursive",
  },
};