import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

const API = process.env.REACT_APP_API_URL;

export default function Setup() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone]       = useState("");
  const [address, setAddress]   = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();
  const { cart } = useCart();

  const token = localStorage.getItem("pestoToken");
  if (!token) navigate("/login");

  async function handleSetup() {
    setError("");
    if (!fullName || !phone || !address) { setError("Please fill all fields."); return; }

    setLoading(true);
    try {
      await axios.post(`${API}/profile/setup`,
        { full_name: fullName, phone, address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (cart.length > 0) navigate("/checkout");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.body}>
      <div style={styles.card}>
        <h1 style={styles.logo}>Pesto<span style={styles.dot}>.</span></h1>
        <p style={styles.subtitle}>One last step before you start ordering!</p>

        <div style={styles.progress}>
          <div style={{ ...styles.dot2, background: "#fdb813" }} />
          <div style={{ ...styles.dot2, background: "#fdb813" }} />
          <div style={{ ...styles.dot2, background: "#B21A1A" }} />
        </div>

        <div style={styles.badge}>
          ℹ️ Complete your profile for faster checkout
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.group}>
          <label style={styles.label}>Full Name</label>
          <input style={styles.input} type="text" placeholder="Your full name"
            value={fullName} onChange={e => setFullName(e.target.value)} />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Phone Number</label>
          <input style={styles.input} type="tel" placeholder="+91 98765 43210"
            value={phone} onChange={e => setPhone(e.target.value)} />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Delivery Address</label>
          <textarea style={styles.textarea} placeholder="Enter your full delivery address"
            value={address} onChange={e => setAddress(e.target.value)} />
        </div>

        <button style={styles.btn} onClick={handleSetup} disabled={loading}>
          {loading ? "Saving..." : "Save & Continue"}
        </button>

        <p style={styles.skip} onClick={() => navigate("/")}>Skip for now →</p>
      </div>
    </div>
  );
}

const styles = {
  body: {
    minHeight: "100vh", background: "#B21A1A",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem",
  },
  card: {
    background: "#fff", borderRadius: 24, padding: "3rem 2.5rem",
    width: "100%", maxWidth: 460,
    boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
  },
  logo: { textAlign: "center", fontSize: "2.2rem", fontWeight: 800, color: "#B21A1A", marginBottom: "0.3rem" },
  dot: { color: "#fdb813" },
  subtitle: { textAlign: "center", color: "#777", fontSize: "0.95rem", marginBottom: "0.8rem" },
  progress: { display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "1rem" },
  dot2: { width: 10, height: 10, borderRadius: "50%" },
  badge: {
    background: "#fff8e1", color: "#f57c00",
    padding: "0.5rem 1rem", borderRadius: 999,
    fontSize: "0.85rem", fontWeight: 600,
    textAlign: "center", marginBottom: "1.5rem",
  },
  errorBox: {
    background: "#fdecea", color: "#c62828",
    padding: "0.8rem 1rem", borderRadius: 12,
    fontSize: "0.9rem", marginBottom: "1rem", textAlign: "center",
  },
  group: { marginBottom: "1.2rem" },
  label: { display: "block", fontWeight: 600, marginBottom: "0.4rem", fontSize: "0.95rem", color: "#333" },
  input: {
    width: "100%", padding: "0.85rem 1rem",
    borderRadius: 999, border: "1.5px solid #ddd",
    fontSize: "0.95rem", fontFamily: "Baloo 2, cursive", outline: "none",
  },
  textarea: {
    width: "100%", padding: "0.85rem 1rem",
    borderRadius: 16, border: "1.5px solid #ddd",
    fontSize: "0.95rem", fontFamily: "Baloo 2, cursive",
    height: 90, resize: "none", outline: "none",
  },
  btn: {
    width: "100%", padding: "0.9rem", borderRadius: 999,
    border: "none", background: "linear-gradient(135deg, #fdb813, #f4a900)",
    fontWeight: 700, fontSize: "1.05rem", cursor: "pointer",
    fontFamily: "Baloo 2, cursive", marginTop: "0.5rem",
  },
  skip: {
    textAlign: "center", marginTop: "1rem",
    color: "#B21A1A", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem",
  },
};