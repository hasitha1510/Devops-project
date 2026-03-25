import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";

const API = "http://localhost:3001";

export default function AdminUsers() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("pestoToken");
  const role  = localStorage.getItem("pestoRole");

  useEffect(() => {
    if (!token || role !== "admin") { navigate("/login"); return; }
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const res = await axios.get(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) navigate("/login");
    } finally {
      setLoading(false);
    }
  }

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={styles.page}>
      <AdminNavbar active="/admin/users" />
      <div style={styles.main}><p style={{ color: "#aaa" }}>Loading users...</p></div>
    </div>
  );

  return (
    <div style={styles.page}>
      <AdminNavbar active="/admin/users" />
      <div style={styles.main}>

        <div style={styles.header}>
          <h1 style={styles.title}>Users</h1>
          <p style={styles.subtitle}>{users.length} registered users</p>
        </div>

        {/* SEARCH */}
        <input
          style={styles.search}
          type="text"
          placeholder="🔍 Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* USERS TABLE */}
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Contact</th>
                <th style={styles.th}>Address</th>
                <th style={styles.th}>Orders</th>
                <th style={styles.th}>Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "#aaa" }}>
                    No users found.
                  </td>
                </tr>
              ) : (
                filtered.map(user => (
                  <tr key={user.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.userCell}>
                        <div style={styles.userAvatar}>
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={styles.userName}>{user.username}</div>
                          <div style={styles.userEmail}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.tdText}>{user.phone || <span style={styles.notSet}>Not set</span>}</div>
                    </td>
                    <td style={styles.td}>
                      <div style={{ ...styles.tdText, maxWidth: 200 }}>
                        {user.address || <span style={styles.notSet}>Not set</span>}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.orderBadge}>{user.total_orders || 0} items</div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.spentBadge}>₹{user.total_spent || 0}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", minHeight: "100vh", background: "#f5f5f5" },
  main: { marginLeft: 240, flex: 1, padding: "2.5rem" },
  header: { marginBottom: "1.5rem" },
  title: { fontSize: "2rem", fontWeight: 800, color: "#1a1a1a", margin: 0 },
  subtitle: { color: "#888", margin: "0.3rem 0 0" },
  search: {
    width: "100%", maxWidth: 400, padding: "0.8rem 1.2rem",
    borderRadius: 999, border: "1.5px solid #ddd",
    fontSize: "0.95rem", fontFamily: "Baloo 2, cursive",
    outline: "none", marginBottom: "1.5rem", display: "block",
    background: "#fff",
  },
  tableWrap: { background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f9f9f9" },
  th: {
    padding: "1rem 1.2rem", textAlign: "left",
    fontSize: "0.82rem", fontWeight: 700,
    color: "#888", textTransform: "uppercase", letterSpacing: 1,
  },
  tr: { borderTop: "1px solid #f0f0f0" },
  td: { padding: "1rem 1.2rem", verticalAlign: "middle" },
  userCell: { display: "flex", alignItems: "center", gap: "0.8rem" },
  userAvatar: {
    width: 38, height: 38, borderRadius: "50%",
    background: "linear-gradient(135deg, #B21A1A, #fdb813)",
    color: "#fff", fontWeight: 800, fontSize: "1rem",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  userName: { fontWeight: 700, fontSize: "0.95rem" },
  userEmail: { fontSize: "0.8rem", color: "#888" },
  tdText: { fontSize: "0.88rem", color: "#555" },
  notSet: { color: "#ccc", fontStyle: "italic" },
  orderBadge: {
    background: "#e3f2fd", color: "#1565c0",
    padding: "0.3rem 0.8rem", borderRadius: 999,
    fontSize: "0.82rem", fontWeight: 700, display: "inline-block",
  },
  spentBadge: {
    background: "#e8f5e9", color: "#2e7d32",
    padding: "0.3rem 0.8rem", borderRadius: 999,
    fontSize: "0.82rem", fontWeight: 700, display: "inline-block",
  },
};