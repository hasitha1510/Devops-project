import { useState } from "react";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

const menuItems = [
  { name: "Double Down Burger", price: 299, category: "Burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400" },
  { name: "Grilled Veg Burger", price: 199, category: "Burgers", image: "https://images.unsplash.com/photo-1550317138-10000687a72b?w=400" },
  { name: "Chicken Shawarma",   price: 249, category: "Wraps",   image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400" },
  { name: "Paneer Wrap",        price: 179, category: "Wraps",   image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400" },
  { name: "Loaded Fries",       price: 149, category: "Sides",   image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400" },
  { name: "Onion Rings",        price: 129, category: "Sides",   image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400" },
  { name: "Chocolate Shake",    price: 159, category: "Drinks",  image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400" },
  { name: "Mango Smoothie",     price: 139, category: "Drinks",  image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400" },
];

const categories = ["All", "Burgers", "Wraps", "Sides", "Drinks"];

const testimonials = [
  { name: "Riya Sharma",   city: "Mumbai",    rating: 5, text: "Absolutely loved the Double Down Burger! Crispy, juicy and delivered in under 30 mins. Will definitely order again!", avatar: "R" },
  { name: "Arjun Mehta",   city: "Bangalore", rating: 5, text: "The Chicken Shawarma is hands down the best I've had. Pesto never disappoints — amazing quality every single time.", avatar: "A" },
  { name: "Sneha Reddy",   city: "Hyderabad", rating: 4, text: "Loaded Fries were incredible! Great portion size and the packaging kept everything hot. Super fast delivery too.", avatar: "S" },
  { name: "Karan Patel",   city: "Delhi",     rating: 5, text: "Ordered for the whole office and everyone loved it. The Paneer Wrap is a must-try for vegetarians!", avatar: "K" },
];

const deals = [
  {
    tag: "🔥 Limited Time",
    title: "Buy 2 Burgers Get 1 Free",
    desc: "Order any 2 burgers and get the third one absolutely free. Valid on weekdays only.",
    code: "BURGER3",
    bg: "#B21A1A",
    color: "#fff",
  },
  {
    tag: "⚡ Flash Deal",
    title: "Flat ₹50 Off on Orders above ₹399",
    desc: "Use code at checkout to get instant discount on your next order. Limited time offer!",
    code: "SAVE50",
    bg: "#fdb813",
    color: "#1a1a1a",
  },
  {
    tag: "🚚 Free Delivery",
    title: "Free Delivery on Your First Order",
    desc: "New to Pesto? Enjoy free delivery on your very first order — no minimum order value!",
    code: "FIRSTFREE",
    bg: "#1a1a1a",
    color: "#fff",
  },
];

export default function Home() {
  const { addToCart } = useCart();
  const [active, setActive] = useState("All");
  const [added, setAdded]   = useState("");
  const [copied, setCopied] = useState("");

  const filtered = active === "All"
    ? menuItems
    : menuItems.filter(i => i.category === active);

  function handleAdd(item) {
    addToCart(item);
    setAdded(item.name);
    setTimeout(() => setAdded(""), 1200);
  }

  function copyCode(code) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(""), 2000);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#EFE8E0" }}>
      <Navbar />

      {/* ── HERO ── */}
      <div style={styles.hero}>
        <div style={styles.heroLeft}>
          <p style={styles.heroTag}>🍔 GRILLED TO PERFECTION</p>
          <h1 style={styles.heroTitle}>Burgers &<br />More</h1>
          <p style={styles.heroSub}>
            Fresh ingredients, bold flavors,<br />delivered fast to your door.
          </p>
          <button
            style={styles.heroBtn}
            onClick={() => document.getElementById("menu").scrollIntoView({ behavior: "smooth" })}
          >
            View Menu ↓
          </button>
        </div>
        <div style={styles.heroRight}>
          <img
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"
            alt="Burger"
            style={styles.heroImg}
          />
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div style={styles.statsBar}>
        {[
          { icon: "⚡", label: "30 min delivery" },
          { icon: "🌿", label: "Fresh ingredients" },
          { icon: "⭐", label: "4.8 rated" },
          { icon: "🚚", label: "Free delivery above ₹499" },
        ].map((s, i) => (
          <div key={i} style={styles.stat}>
            <span style={styles.statIcon}>{s.icon}</span>
            <span style={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── SPECIAL OFFERS ── */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>🎁 Special Offers</h2>
          <p style={styles.sectionSub}>Grab these deals before they're gone!</p>
        </div>
        <div style={styles.dealsGrid}>
          {deals.map((deal, i) => (
            <div key={i} style={{ ...styles.dealCard, background: deal.bg, color: deal.color }}>
              <span style={{ ...styles.dealTag, color: deal.bg === "#fdb813" ? "#1a1a1a" : "#fdb813" }}>
                {deal.tag}
              </span>
              <h3 style={styles.dealTitle}>{deal.title}</h3>
              <p style={{ ...styles.dealDesc, color: deal.color === "#fff" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.6)" }}>
                {deal.desc}
              </p>
              <div style={styles.dealCodeRow}>
                <div style={{ ...styles.dealCode, color: deal.bg === "#fdb813" ? "#1a1a1a" : "#fdb813" }}>
                  {deal.code}
                </div>
                <button
                  style={{
                    ...styles.copyBtn,
                    background: copied === deal.code ? "#2e7d32" : deal.color === "#fff" ? "#fff" : "#1a1a1a",
                    color: copied === deal.code ? "#fff" : deal.bg,
                  }}
                  onClick={() => copyCode(deal.code)}
                >
                  {copied === deal.code ? "✓ Copied!" : "Copy Code"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MENU ── */}
      <div id="menu" style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Our Menu</h2>
          <p style={styles.sectionSub}>Freshly prepared with the finest ingredients</p>
        </div>

        <div style={styles.categories}>
          {categories.map(cat => (
            <button
              key={cat}
              style={{ ...styles.catBtn, ...(active === cat ? styles.catActive : {}) }}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={styles.grid}>
          {filtered.map(item => (
            <div key={item.name} style={styles.card}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={styles.imgWrap}>
                <img src={item.image} alt={item.name} style={styles.cardImg} />
                <span style={styles.cardCatBadge}>{item.category}</span>
              </div>
              <div style={styles.cardBody}>
                <h3 style={styles.cardName}>{item.name}</h3>
                <p style={styles.cardDesc}>Freshly prepared with the finest ingredients.</p>
                <div style={styles.cardFooter}>
                  <span style={styles.cardPrice}>₹{item.price}</span>
                  <button
                    style={{ ...styles.addBtn, ...(added === item.name ? styles.addedBtn : {}) }}
                    onClick={() => handleAdd(item)}
                  >
                    {added === item.name ? "✓ Added!" : "+ Add"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <div style={{ ...styles.section, background: "#fff", borderRadius: 0, padding: "4rem 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>❤️ What Our Customers Say</h2>
            <p style={styles.sectionSub}>Don't just take our word for it!</p>
          </div>
          <div style={styles.testimonialGrid}>
            {testimonials.map((t, i) => (
              <div key={i} style={styles.testimonialCard}>
                <div style={styles.stars}>
                  {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                </div>
                <p style={styles.testimonialText}>"{t.text}"</p>
                <div style={styles.testimonialAuthor}>
                  <div style={styles.testimonialAvatar}>{t.avatar}</div>
                  <div>
                    <div style={styles.testimonialName}>{t.name}</div>
                    <div style={styles.testimonialCity}>📍 {t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA BANNER ── */}
      <div style={styles.ctaBanner}>
        <h2 style={styles.ctaTitle}>Hungry? Order Now! 🍔</h2>
        <p style={styles.ctaDesc}>Get your favourite food delivered in under 30 minutes.</p>
        <button
          style={styles.ctaBtn}
          onClick={() => document.getElementById("menu").scrollIntoView({ behavior: "smooth" })}
        >
          Order Now
        </button>
      </div>

      {/* ── FOOTER ── */}
      <div style={styles.footer}>
        <h2 style={styles.footerLogo}>Pesto<span style={{ color: "#fdb813" }}>.</span></h2>
        <p style={styles.footerText}>Fresh food, delivered fast. Made with ❤️ in India.</p>
        <p style={styles.footerText}>© 2025 Pesto. All rights reserved.</p>
      </div>
    </div>
  );
}

const styles = {
  // HERO
  hero: {
    background: "#B21A1A", padding: "4rem 5rem",
    display: "flex", alignItems: "center",
    justifyContent: "space-between", gap: "2rem", minHeight: "85vh",
  },
  heroLeft: { flex: 1, maxWidth: 560 },
  heroTag: { color: "#fdb813", fontWeight: 700, letterSpacing: 2, fontSize: "0.9rem", marginBottom: "1rem" },
  heroTitle: { fontSize: "clamp(3rem, 7vw, 5rem)", fontWeight: 800, color: "#fff", lineHeight: 1.05, marginBottom: "1.2rem" },
  heroSub: { color: "rgba(255,255,255,0.85)", fontSize: "1.1rem", lineHeight: 1.7, marginBottom: "2rem" },
  heroBtn: {
    background: "#fdb813", border: "none", padding: "1rem 2.8rem",
    borderRadius: 999, fontWeight: 800, fontSize: "1.05rem",
    cursor: "pointer", fontFamily: "Baloo 2, cursive",
    boxShadow: "0 10px 30px rgba(253,184,19,0.4)",
  },
  heroRight: { flex: 1, display: "flex", justifyContent: "center", alignItems: "center" },
  heroImg: {
    width: "100%", maxWidth: 500, height: 420, objectFit: "cover",
    borderRadius: 32, boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
    border: "4px solid rgba(255,255,255,0.15)",
  },

  // STATS BAR
  statsBar: {
    background: "#fff", display: "flex", justifyContent: "center",
    gap: "3rem", padding: "1.2rem 2rem", flexWrap: "wrap",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },
  stat: { display: "flex", alignItems: "center", gap: "0.5rem" },
  statIcon: { fontSize: "1.2rem" },
  statLabel: { fontSize: "0.9rem", fontWeight: 600, color: "#555" },

  // SECTION
  section: { maxWidth: 1200, margin: "0 auto", padding: "4rem 2rem" },
  sectionHeader: { marginBottom: "2.5rem" },
  sectionTitle: { fontSize: "2rem", fontWeight: 800, color: "#2b2b2b", marginBottom: "0.4rem" },
  sectionSub: { color: "#888", fontSize: "1rem" },

  // DEALS
  dealsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" },
  dealCard: {
    borderRadius: 22, padding: "2rem",
    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
    display: "flex", flexDirection: "column", gap: "0.8rem",
  },
  dealTag: { fontSize: "0.8rem", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" },
  dealTitle: { fontSize: "1.25rem", fontWeight: 800, margin: 0, lineHeight: 1.3 },
  dealDesc: { fontSize: "0.88rem", lineHeight: 1.6, margin: 0 },
  dealCodeRow: { display: "flex", alignItems: "center", gap: "0.8rem", marginTop: "0.5rem" },
  dealCode: {
    fontWeight: 800, fontSize: "1.1rem", letterSpacing: 2,
    border: "2px dashed currentColor", padding: "0.3rem 0.8rem", borderRadius: 8,
  },
  copyBtn: {
    border: "none", padding: "0.45rem 1rem", borderRadius: 999,
    fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
    fontFamily: "Baloo 2, cursive", transition: "all 0.2s ease",
  },

  // MENU
  categories: { display: "flex", gap: "0.8rem", marginBottom: "2.5rem", flexWrap: "wrap" },
  catBtn: {
    padding: "0.55rem 1.5rem", borderRadius: 999,
    border: "2px solid #ddd", background: "#fff",
    fontWeight: 600, cursor: "pointer",
    fontFamily: "Baloo 2, cursive", fontSize: "0.95rem",
  },
  catActive: { background: "#B21A1A", color: "#fff", borderColor: "#B21A1A" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "1.8rem" },
  card: {
    background: "#fff", borderRadius: 22, overflow: "hidden",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)", transition: "transform 0.25s ease",
  },
  imgWrap: { position: "relative" },
  cardImg: { width: "100%", height: 210, objectFit: "cover", display: "block" },
  cardCatBadge: {
    position: "absolute", top: 12, left: 12,
    background: "#B21A1A", color: "#fff",
    fontSize: "0.72rem", fontWeight: 700,
    padding: "0.2rem 0.7rem", borderRadius: 999,
    textTransform: "uppercase", letterSpacing: 1,
  },
  cardBody: { padding: "1.3rem" },
  cardName: { fontSize: "1.1rem", fontWeight: 700, margin: "0 0 0.3rem" },
  cardDesc: { fontSize: "0.82rem", color: "#aaa", margin: "0 0 1rem", lineHeight: 1.5 },
  cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardPrice: { fontSize: "1.3rem", fontWeight: 800, color: "#2b2b2b" },
  addBtn: {
    background: "#B21A1A", color: "#fff", border: "none",
    padding: "0.55rem 1.3rem", borderRadius: 999, fontWeight: 700,
    cursor: "pointer", fontFamily: "Baloo 2, cursive",
    fontSize: "0.95rem", transition: "all 0.2s ease",
  },
  addedBtn: { background: "#2e7d32" },

  // TESTIMONIALS
  testimonialGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem",
  },
  testimonialCard: {
    background: "#EFE8E0", borderRadius: 20, padding: "1.8rem",
    display: "flex", flexDirection: "column", gap: "1rem",
    boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
    borderLeft: "4px solid #B21A1A",
  },
  stars: { color: "#fdb813", fontSize: "1.1rem", letterSpacing: 2 },
  testimonialText: { fontSize: "0.92rem", color: "#444", lineHeight: 1.7, fontStyle: "italic", margin: 0 },
  testimonialAuthor: { display: "flex", alignItems: "center", gap: "0.8rem", marginTop: "auto" },
  testimonialAvatar: {
    width: 42, height: 42, borderRadius: "50%",
    background: "linear-gradient(135deg, #B21A1A, #fdb813)",
    color: "#fff", fontWeight: 800, fontSize: "1.1rem",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  testimonialName: { fontWeight: 700, fontSize: "0.95rem" },
  testimonialCity: { fontSize: "0.78rem", color: "#888" },

  // CTA BANNER
  ctaBanner: {
    background: "#B21A1A", padding: "5rem 2rem",
    textAlign: "center",
  },
  ctaTitle: { fontSize: "2.5rem", fontWeight: 800, color: "#fff", marginBottom: "0.8rem" },
  ctaDesc: { color: "rgba(255,255,255,0.85)", fontSize: "1.05rem", marginBottom: "2rem" },
  ctaBtn: {
    background: "#fdb813", border: "none", padding: "1rem 3rem",
    borderRadius: 999, fontWeight: 800, fontSize: "1.1rem",
    cursor: "pointer", fontFamily: "Baloo 2, cursive",
    boxShadow: "0 10px 30px rgba(253,184,19,0.4)",
  },

  // FOOTER
  footer: {
    background: "#1a1a1a", color: "#fff",
    textAlign: "center", padding: "2.5rem",
    display: "flex", flexDirection: "column", gap: "0.5rem",
  },
  footerLogo: { fontSize: "2rem", fontWeight: 800 },
  footerText: { color: "#777", fontSize: "0.88rem" },
};