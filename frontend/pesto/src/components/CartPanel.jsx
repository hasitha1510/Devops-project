import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartPanel({ isOpen, onClose }) {
  const { cart, updateQty, removeItem, total } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem("pestoToken");

  function handleCheckout() {
    if (cart.length === 0) { alert("Your bag is empty!"); return; }
    if (!token) {
      onClose();
      navigate("/login");
      return;
    }
    onClose();
    navigate("/checkout");
  }

  return (
    <>
      {isOpen && <div style={styles.overlay} onClick={onClose} />}
      <div style={{ ...styles.panel, right: isOpen ? 0 : "-420px" }}>
        <div style={styles.header}>
          <h3 style={styles.title}>Your Bag 🛒</h3>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.items}>
          {cart.length === 0 ? (
            <p style={styles.empty}>Your bag is empty 🍽️</p>
          ) : (
            cart.map(item => (
              <div key={item.name} style={styles.item}>
                <img src={item.image} alt={item.name} style={styles.img} />
                <div style={styles.info}>
                  <h4 style={styles.name}>{item.name}</h4>
                  <span style={styles.price}>₹{item.price}</span>
                  <div style={styles.qty}>
                    <button onClick={() => updateQty(item.name, -1)} style={styles.qtyBtn}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.name, 1)} style={styles.qtyBtn}>+</button>
                    <button onClick={() => removeItem(item.name)} style={styles.removeBtn}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={styles.footer}>
          <div style={styles.totalRow}>
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>
          {!token && cart.length > 0 && (
            <p style={styles.hint}>
              <a href="/login" style={{ color: "#B21A1A", fontWeight: 600 }}>Login</a> to save your cart
            </p>
          )}
          <button onClick={handleCheckout} style={styles.checkoutBtn}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
}

const styles = {
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.4)",
    zIndex: 200,
  },
  panel: {
    position: "fixed", top: 0, bottom: 0,
    width: "400px",
    background: "#fff",
    zIndex: 201,
    transition: "right 0.3s ease",
    display: "flex",
    flexDirection: "column",
    boxShadow: "-8px 0 30px rgba(0,0,0,0.15)",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "1.2rem 1.5rem",
    borderBottom: "1px solid #eee",
    background: "#B21A1A",
    color: "#fff",
  },
  title: { fontSize: "1.2rem", margin: 0 },
  closeBtn: {
    background: "transparent", border: "none",
    color: "#fff", fontSize: "1.2rem", cursor: "pointer",
  },
  items: { flex: 1, overflowY: "auto", padding: "1rem 1.5rem" },
  empty: { textAlign: "center", color: "#aaa", marginTop: "3rem", fontSize: "1rem" },
  item: {
    display: "flex", gap: "1rem",
    padding: "0.8rem 0",
    borderBottom: "1px solid #f5f5f5",
  },
  img: { width: 65, height: 65, borderRadius: 12, objectFit: "cover" },
  info: { flex: 1 },
  name: { fontSize: "0.95rem", marginBottom: "0.2rem" },
  price: { fontSize: "0.85rem", color: "#777" },
  qty: { display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.4rem" },
  qtyBtn: {
    width: 26, height: 26, borderRadius: "50%",
    border: "1px solid #ddd", background: "#f9f9f9",
    cursor: "pointer", fontWeight: 700, fontSize: "1rem",
  },
  removeBtn: {
    background: "none", border: "none",
    color: "#B21A1A", fontSize: "0.8rem",
    cursor: "pointer", marginLeft: "0.5rem",
  },
  footer: {
    padding: "1.2rem 1.5rem",
    borderTop: "1px solid #eee",
  },
  totalRow: {
    display: "flex", justifyContent: "space-between",
    fontSize: "1.1rem", fontWeight: 700,
    marginBottom: "0.8rem",
    color: "#B21A1A",
  },
  hint: { fontSize: "0.85rem", color: "#777", marginBottom: "0.8rem", textAlign: "center" },
  checkoutBtn: {
    width: "100%", padding: "0.9rem",
    borderRadius: "999px", border: "none",
    background: "linear-gradient(135deg, #fdb813, #f4a900)",
    fontWeight: 700, fontSize: "1rem",
    cursor: "pointer",
    fontFamily: "Baloo 2, cursive",
  },
};