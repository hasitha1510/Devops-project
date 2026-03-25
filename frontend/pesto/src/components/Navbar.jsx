import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import CartPanel from "./CartPanel";

export default function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const { cart } = useCart();
  const navigate = useNavigate();

  const token = localStorage.getItem("pestoToken");
  const username = localStorage.getItem("pestoUser");
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  function logout() {
    localStorage.removeItem("pestoToken");
    localStorage.removeItem("pestoUser");
    navigate("/login");
  }

  return (
    <>
      <nav style={styles.nav}>
        <Link to="/" style={styles.logo}>Pesto<span style={styles.dot}>.</span></Link>

        <div style={styles.links}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/" style={styles.link}>Menu</Link>
        </div>

        <div style={styles.right}>
          <button onClick={() => setCartOpen(true)} style={styles.cartBtn}>
            🛒 <span style={styles.badge}>{totalItems}</span>
          </button>

          {token ? (
            <div style={styles.avatarWrap}>
              <Link to="/profile" style={styles.avatar}>
                {username ? username.charAt(0).toUpperCase() : "U"}
              </Link>
            </div>
          ) : (
            <Link to="/login" style={styles.loginBtn}>Login</Link>
          )}
        </div>
      </nav>

      <CartPanel isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

const styles = {
  nav: {
    background: "#B21A1A",
    padding: "1rem 3rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: "1.8rem",
    fontWeight: 800,
    color: "#fff",
    textDecoration: "none",
  },
  dot: { color: "#fdb813" },
  links: { display: "flex", gap: "2rem" },
  link: { color: "#fff", textDecoration: "none", fontSize: "1rem", fontWeight: 300 },
  right: { display: "flex", alignItems: "center", gap: "1rem" },
  cartBtn: {
    background: "transparent",
    border: "none",
    fontSize: "1.4rem",
    cursor: "pointer",
    position: "relative",
    color: "#fff",
  },
  badge: {
    background: "#fdb813",
    color: "#000",
    borderRadius: "50%",
    padding: "0 6px",
    fontSize: "0.75rem",
    fontWeight: 700,
  },
  avatarWrap: { position: "relative" },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #fdb813, #f4a900)",
    color: "#000",
    fontWeight: 800,
    fontSize: "1rem",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
  },
  loginBtn: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "1rem",
    border: "1.5px solid #fff",
    padding: "0.3rem 1rem",
    borderRadius: "999px",
  },
};