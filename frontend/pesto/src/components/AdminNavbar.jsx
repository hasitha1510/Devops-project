import { useNavigate, Link } from "react-router-dom";

export default function AdminNavbar({ active }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("pestoToken");
    localStorage.removeItem("pestoUser");
    localStorage.removeItem("pestoRole");
    navigate("/login");
  }

  const links = [
    { path: "/admin",       label: "📊 Dashboard" },
    { path: "/admin/orders", label: "🧾 Orders"    },
    { path: "/admin/users",  label: "👥 Users"     },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        Pesto<span style={styles.dot}>.</span>
        <div style={styles.adminBadge}>ADMIN</div>
      </div>

      <nav style={styles.nav}>
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              ...styles.navLink,
              ...(active === link.path ? styles.navLinkActive : {})
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div style={styles.bottom}>
        <Link to="/" style={styles.viewSite}>🌐 View Site</Link>
        <button style={styles.logoutBtn} onClick={logout}>🚪 Logout</button>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: 240, minHeight: "100vh", background: "#1a1a1a",
    display: "flex", flexDirection: "column",
    padding: "2rem 1.2rem", position: "fixed",
    top: 0, left: 0, zIndex: 100,
  },
  logo: {
    fontSize: "1.8rem", fontWeight: 800, color: "#fff",
    marginBottom: "2.5rem", display: "flex",
    alignItems: "center", gap: "0.5rem",
  },
  dot: { color: "#fdb813" },
  adminBadge: {
    background: "#B21A1A", color: "#fff",
    fontSize: "0.6rem", fontWeight: 800,
    padding: "0.2rem 0.5rem", borderRadius: 6,
    letterSpacing: 1,
  },
  nav: { display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 },
  navLink: {
    color: "#aaa", textDecoration: "none",
    padding: "0.8rem 1rem", borderRadius: 12,
    fontSize: "0.95rem", fontWeight: 600,
    transition: "all 0.2s ease",
  },
  navLinkActive: { background: "#B21A1A", color: "#fff" },
  bottom: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  viewSite: {
    color: "#aaa", textDecoration: "none",
    padding: "0.7rem 1rem", borderRadius: 12,
    fontSize: "0.9rem", fontWeight: 600,
  },
  logoutBtn: {
    background: "transparent", border: "1px solid #333",
    color: "#aaa", padding: "0.7rem 1rem",
    borderRadius: 12, cursor: "pointer",
    fontFamily: "Baloo 2, cursive", fontSize: "0.9rem",
    fontWeight: 600, textAlign: "left",
  },
};