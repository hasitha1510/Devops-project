import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

const API =process.env.REACT_APP_API_URL ;

export default function Login() {
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);
  const navigate = useNavigate();
  const { cart } = useCart();

  async function handleLogin() {
    setError("");
    if (!email || !password) { setError("Please fill all fields."); return; }
    if (isAdminMode && !adminSecret) { setError("Please enter the admin secret key."); return; }

    setLoading(true);
    try {
      const payload = { email, password };
      if (isAdminMode) payload.adminSecret = adminSecret;

      const res = await axios.post(`${API}/auth/login`, payload);

      localStorage.setItem("pestoToken", res.data.access_token);
      localStorage.setItem("pestoUser",  res.data.username);
      localStorage.setItem("pestoRole",  res.data.role);

      // Smart redirect based on role
      if (res.data.role === "admin") {
        navigate("/admin");
      } else if (cart.length > 0) {
        navigate("/checkout");
      } else {
        navigate("/");
      }

    } catch (err) {
      setError(err.response?.data?.error || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.body}>
      <div style={styles.card}>
        <h1 style={styles.logo}>Pesto<span style={styles.dot}>.</span></h1>
        <p style={styles.subtitle}>
          {isAdminMode ? "🍽️ Restaurant Admin Login" : "Welcome back! Log in to your account"}
        </p>

        {/* ADMIN MODE BANNER */}
        {isAdminMode && (
          <div style={styles.adminBanner}>
            🔐 You are logging in as a restaurant admin
          </div>
        )}

        {cart.length > 0 && !isAdminMode && (
          <div style={styles.cartNotice}>
            🛒 You have items in your cart! Login to proceed to checkout.
          </div>
        )}

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.group}>
          <label style={styles.label}>Email Address</label>
          <input
            style={styles.input}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="Your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
        </div>

        {/* ADMIN SECRET FIELD — only shown in admin mode */}
        {isAdminMode && (
          <div style={styles.group}>
            <label style={styles.label}>Admin Secret Key</label>
            <input
              style={{ ...styles.input, borderColor: "#B21A1A" }}
              type="password"
              placeholder="Enter restaurant secret key"
              value={adminSecret}
              onChange={e => setAdminSecret(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>
        )}

        <button style={{
          ...styles.btn,
          background: isAdminMode
            ? "linear-gradient(135deg, #B21A1A, #8b0000)"
            : "linear-gradient(135deg, #fdb813, #f4a900)",
          color: isAdminMode ? "#fff" : "#000",
        }} onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : isAdminMode ? "Login as Admin" : "Login"}
        </button>

        {!isAdminMode && (
          <p style={styles.switch}>
            Don't have an account? <Link to="/register" style={styles.switchLink}>Register here</Link>
          </p>
        )}

        {/* DISCREET RESTAURANT LOGIN TOGGLE */}
        <div style={styles.divider} />
        <p
          style={styles.restaurantLink}
          onClick={() => { setIsAdminMode(!isAdminMode); setError(""); setAdminSecret(""); }}
        >
          {isAdminMode ? "← Back to Customer Login" : "🍽️ Restaurant Login"}
        </p>

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
    width: "100%", maxWidth: 420,
    boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
  },
  logo: { textAlign: "center", fontSize: "2.2rem", fontWeight: 800, color: "#B21A1A", marginBottom: "0.3rem" },
  dot: { color: "#fdb813" },
  subtitle: { textAlign: "center", color: "#777", fontSize: "0.95rem", marginBottom: "1.5rem" },
  adminBanner: {
    background: "#fdecea", color: "#B21A1A",
    padding: "0.7rem 1rem", borderRadius: 12,
    fontSize: "0.88rem", fontWeight: 600,
    marginBottom: "1rem", textAlign: "center",
    border: "1px solid #f5c6c6",
  },
  cartNotice: {
    background: "#fff8e1", color: "#f57c00",
    padding: "0.7rem 1rem", borderRadius: 12,
    fontSize: "0.88rem", fontWeight: 600,
    marginBottom: "1rem", textAlign: "center",
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
    fontSize: "0.95rem", fontFamily: "Baloo 2, cursive",
    outline: "none",
  },
  btn: {
    width: "100%", padding: "0.9rem", borderRadius: 999,
    border: "none", fontWeight: 700, fontSize: "1.05rem",
    cursor: "pointer", fontFamily: "Baloo 2, cursive", marginTop: "0.5rem",
  },
  switch: { textAlign: "center", marginTop: "1.5rem", fontSize: "0.95rem", color: "#555" },
  switchLink: { color: "#B21A1A", fontWeight: 600 },
  divider: { borderTop: "1px solid #f0f0f0", margin: "1.5rem 0 1rem" },
  restaurantLink: {
    textAlign: "center", fontSize: "0.85rem",
    color: "#aaa", cursor: "pointer",
    transition: "color 0.2s ease",
  },
};