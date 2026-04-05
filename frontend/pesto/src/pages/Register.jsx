import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  async function handleRegister() {
    setError("");
    if (!username || !email || !password) { setError("Please fill all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    try {
      // Step 1 — Register
      await axios.post(`${API}/auth/register`, { username, email, password });

      // Step 2 — Auto login
      const loginRes = await axios.post(`${API}/auth/login`, { email, password });
      localStorage.setItem("pestoToken", loginRes.data.access_token);
      localStorage.setItem("pestoUser", username);

      // Step 3 — Go to setup
      navigate("/setup");

    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.body}>
      <div style={styles.card}>
        <h1 style={styles.logo}>Pesto<span style={styles.dot}>.</span></h1>
        <p style={styles.subtitle}>Create your account to start ordering</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.group}>
          <label style={styles.label}>Username</label>
          <input style={styles.input} type="text" placeholder="Choose a username"
            value={username} onChange={e => setUsername(e.target.value)} />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Email Address</label>
          <input style={styles.input} type="email" placeholder="you@example.com"
            value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" placeholder="Create a password"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleRegister()} />
        </div>

        <button style={styles.btn} onClick={handleRegister} disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p style={styles.switch}>
          Already have an account? <Link to="/login" style={styles.switchLink}>Login here</Link>
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
  btn: {
    width: "100%", padding: "0.9rem", borderRadius: 999,
    border: "none", background: "linear-gradient(135deg, #fdb813, #f4a900)",
    fontWeight: 700, fontSize: "1.05rem", cursor: "pointer",
    fontFamily: "Baloo 2, cursive", marginTop: "0.5rem",
  },
  switch: { textAlign: "center", marginTop: "1.5rem", fontSize: "0.95rem", color: "#555" },
  switchLink: { color: "#B21A1A", fontWeight: 600 },
};