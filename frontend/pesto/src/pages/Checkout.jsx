import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

const API = "http://localhost:3001";

export default function Checkout() {
  const [name, setName]         = useState("");
  const [phone, setPhone]       = useState("");
  const [address, setAddress]   = useState("");
  const [payment, setPayment]   = useState("upi");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem("pestoToken");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    autoFill();
  }, []);

  async function autoFill() {
    try {
      const res = await axios.get(`${API}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.full_name) setName(res.data.full_name);
      if (res.data.phone)     setPhone(res.data.phone);
      if (res.data.address)   setAddress(res.data.address);
    } catch (_) {}
  }

  async function handlePay() {
    setError("");
    if (!name || !phone || !address) { setError("Please fill all delivery details."); return; }
    if (cart.length === 0) { setError("Your cart is empty!"); return; }

    setLoading(true);
    try {
      for (const item of cart) {
        await axios.post(`${API}/cart/add`,
          { name: item.name, price: item.price, image: item.image, quantity: item.qty },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      clearCart();
      navigate("/order-success");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const paymentOptions = [
    { id: "upi",  label: "UPI", sub: "Google Pay, PhonePe, Paytm & more", icon: "📱" },
    { id: "card", label: "Credit / Debit Card", sub: "Visa, Mastercard, Amex", icon: "💳" },
    { id: "cod",  label: "Cash on Delivery", sub: "Pay when your order arrives", icon: "💵" },
  ];

  return (
    <>
      <Navbar />
      <div style={styles.container}>

        {/* LEFT */}
        <div style={styles.left}>
          <h2 style={styles.title}>Checkout</h2>

          {/* Delivery Details */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Delivery Details</h3>
            {error && <div style={styles.errorBox}>{error}</div>}
            <input style={styles.input} type="text" placeholder="Full Name"
              value={name} onChange={e => setName(e.target.value)} />
            <input style={styles.input} type="tel" placeholder="Phone Number"
              value={phone} onChange={e => setPhone(e.target.value)} />
            <textarea style={styles.textarea} placeholder="Delivery Address"
              value={address} onChange={e => setAddress(e.target.value)} />
          </div>

          {/* Payment */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Payment Method</h3>
            {paymentOptions.map(opt => (
              <div key={opt.id}
                style={{ ...styles.payOption, ...(payment === opt.id ? styles.paySelected : {}) }}
                onClick={() => setPayment(opt.id)}
              >
                <div style={styles.payLeft}>
                  <div style={styles.payIcon}>{opt.icon}</div>
                  <div>
                    <div style={styles.payLabel}>{opt.label}</div>
                    <div style={styles.paySub}>{opt.sub}</div>
                  </div>
                </div>
                <div style={{ ...styles.radio, ...(payment === opt.id ? styles.radioSelected : {}) }}>
                  {payment === opt.id && <div style={styles.radioDot} />}
                </div>
              </div>
            ))}

            <button style={styles.payBtn} onClick={handlePay} disabled={loading}>
              🔒 {loading ? "Processing..." : "Pay Securely"}
            </button>
            <p style={styles.secureNote}>
              🛡️ 100% Secure Payments powered by SSL encryption
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div style={styles.right}>
          <h3 style={styles.cardTitle}>Your Order</h3>
          {cart.length === 0 ? (
            <p style={{ color: "#aaa" }}>Your cart is empty.</p>
          ) : (
            cart.map(item => (
              <div key={item.name} style={styles.orderItem}>
                <img src={item.image} alt={item.name} style={styles.orderImg}
                  onError={e => e.target.style.display = "none"} />
                <div style={styles.orderInfo}>
                  <h4 style={{ margin: 0, fontSize: "0.95rem" }}>{item.name}</h4>
                  <p style={{ color: "#777", fontSize: "0.8rem", margin: 0 }}>Qty: {item.qty}</p>
                </div>
                <div style={styles.orderPrice}>₹{item.price * item.qty}</div>
              </div>
            ))
          )}
          <div style={styles.totalRow}>
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>
        </div>

      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: 1200, margin: "2rem auto", padding: "1.5rem",
    display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem",
  },
  left: {},
  title: { fontSize: "2.2rem", color: "#B21A1A", marginBottom: "1.5rem" },
  card: {
    background: "#fff", borderRadius: 20, padding: "1.8rem",
    marginBottom: "1.5rem", boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  },
  cardTitle: { fontSize: "1.2rem", marginBottom: "1.2rem", color: "#333" },
  errorBox: {
    background: "#fdecea", color: "#c62828",
    padding: "0.8rem 1rem", borderRadius: 12,
    fontSize: "0.9rem", marginBottom: "1rem", textAlign: "center",
  },
  input: {
    width: "100%", padding: "0.85rem 1rem", borderRadius: 999,
    border: "1.5px solid #ddd", fontSize: "0.95rem",
    fontFamily: "Baloo 2, cursive", outline: "none",
    marginBottom: "1rem", display: "block",
  },
  textarea: {
    width: "100%", padding: "0.85rem 1rem", borderRadius: 16,
    border: "1.5px solid #ddd", fontSize: "0.95rem",
    fontFamily: "Baloo 2, cursive", outline: "none",
    height: 90, resize: "none", display: "block",
  },
  payOption: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "1rem 1.2rem", borderRadius: 16, border: "2px solid #eee",
    marginBottom: "0.9rem", cursor: "pointer", transition: "all 0.2s ease",
  },
  paySelected: { borderColor: "#fdb813", background: "#fffbee" },
  payLeft: { display: "flex", alignItems: "center", gap: "1rem" },
  payIcon: {
    width: 46, height: 46, borderRadius: 12,
    background: "#f5f5f5", display: "flex",
    alignItems: "center", justifyContent: "center", fontSize: "1.4rem",
  },
  payLabel: { fontWeight: 700, fontSize: "1rem" },
  paySub: { fontSize: "0.8rem", color: "#999" },
  radio: {
    width: 22, height: 22, borderRadius: "50%",
    border: "2px solid #ddd", display: "flex",
    alignItems: "center", justifyContent: "center",
  },
  radioSelected: { borderColor: "#B21A1A", background: "#B21A1A" },
  radioDot: { width: 8, height: 8, borderRadius: "50%", background: "#fff" },
  payBtn: {
    width: "100%", padding: "1rem", borderRadius: 999,
    border: "none", background: "linear-gradient(135deg, #fdb813, #f4a900)",
    fontWeight: 700, fontSize: "1.05rem", cursor: "pointer",
    fontFamily: "Baloo 2, cursive", marginTop: "0.5rem",
  },
  secureNote: { textAlign: "center", fontSize: "0.8rem", color: "#aaa", marginTop: "0.8rem" },
  right: {
    background: "#fff", borderRadius: 20, padding: "1.8rem",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    height: "fit-content", position: "sticky", top: "5rem",
  },
  orderItem: {
    display: "grid", gridTemplateColumns: "55px 1fr auto",
    gap: "0.8rem", alignItems: "center",
    paddingBottom: "0.8rem", borderBottom: "1px dashed #eee", marginBottom: "0.8rem",
  },
  orderImg: { width: 55, height: 55, borderRadius: 10, objectFit: "cover" },
  orderInfo: {},
  orderPrice: { fontWeight: 700, color: "#B21A1A" },
  totalRow: {
    borderTop: "1px dashed #ddd", paddingTop: "1rem", marginTop: "0.5rem",
    display: "flex", justifyContent: "space-between",
    fontSize: "1.2rem", fontWeight: 700, color: "#B21A1A",
  },
};