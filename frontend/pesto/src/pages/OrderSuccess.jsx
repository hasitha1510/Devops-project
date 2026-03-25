import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function OrderSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect to home after 5 seconds
    const timer = setTimeout(() => navigate("/"), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.body}>
      <div style={styles.card}>
        <div style={styles.icon}>🎉</div>
        <h1 style={styles.title}>Order Placed!</h1>
        <p style={styles.subtitle}>
          Your delicious food is being prepared. Hang tight!
        </p>
        <div style={styles.details}>
          <p>🍔 Estimated delivery: <strong>30-45 mins</strong></p>
          <p>📦 You'll receive a confirmation shortly</p>
        </div>
        <button style={styles.btn} onClick={() => navigate("/")}>
          Back to Home
        </button>
        <p style={styles.auto}>Redirecting automatically in 5 seconds...</p>
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
    width: "100%", maxWidth: 460, textAlign: "center",
    boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
  },
  icon: { fontSize: "4rem", marginBottom: "1rem" },
  title: { fontSize: "2rem", fontWeight: 800, color: "#B21A1A", marginBottom: "0.5rem" },
  subtitle: { color: "#777", fontSize: "1rem", marginBottom: "1.5rem" },
  details: {
    background: "#f9f9f9", borderRadius: 14, padding: "1rem 1.5rem",
    marginBottom: "1.5rem", textAlign: "left",
    display: "flex", flexDirection: "column", gap: "0.5rem",
    fontSize: "0.95rem", color: "#555",
  },
  btn: {
    width: "100%", padding: "0.9rem", borderRadius: 999,
    border: "none", background: "linear-gradient(135deg, #fdb813, #f4a900)",
    fontWeight: 700, fontSize: "1.05rem", cursor: "pointer",
    fontFamily: "Baloo 2, cursive",
  },
  auto: { marginTop: "1rem", fontSize: "0.8rem", color: "#aaa" },
};