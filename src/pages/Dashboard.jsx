import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/dashboard.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ── SVG icon helper ── */
const Ic = ({ d, s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

/* ── icon paths ── */
const I = {
  home:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  box:     ["M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z","M3.27 6.96L12 12.01l8.73-5.05","M12 22.08V12"],
  store:   ["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z","M9 22V12h6v10"],
  dollar:  "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  chart:   ["M18 20V10","M12 20V4","M6 20v-6"],
  bell:    ["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9","M13.73 21a2 2 0 01-3.46 0"],
  cog:     ["M12 15a3 3 0 100-6 3 3 0 000 6z","M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"],
  logout:  ["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4","M16 17l5-5-5-5","M21 12H9"],
  upload:  ["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4","M17 8l-5-5-5 5","M12 3v12"],
  search:  ["M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0"],
  eye:     ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 100 6 3 3 0 000-6"],
  trend:   ["M23 6l-9.5 9.5-5-5L1 18","M17 6h6v6"],
  user:    ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 11a4 4 0 100-8 4 4 0 000 8"],
  wallet:  ["M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2z","M16 14a2 2 0 100-4 2 2 0 000 4"],
  support: ["M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"],
  shield:  ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
};

/* ── avatar background colours for real sales rows ── */
const AV_COLORS = ["#ede9ff","#fff1ef","#dcfce7","#fff8ec","#e0f2fe","#fce7f3"];

/* ── emoji from product title ── */
const getEmoji = (title = "") => {
  const t = title.toLowerCase();
  if (t.includes("template"))                           return "📝";
  if (t.includes("course") || t.includes("guide"))     return "🎓";
  if (t.includes("music")  || t.includes("audio"))     return "🎵";
  if (t.includes("design") || t.includes("ui") || t.includes("kit")) return "🎨";
  if (t.includes("brand"))                              return "✨";
  if (t.includes("ebook")  || t.includes("book"))      return "📚";
  if (t.includes("react")  || t.includes("code") || t.includes("app")) return "⚡";
  return "📦";
};

/* ── relative time ── */
const relTime = (iso) => {
  if (!iso) return "";
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60)   return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} d ago`;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [user,      setUser]      = useState(null);
  const [activeNav, setActiveNav] = useState("overview");

  /* ── real data states ── */
  const [statsLoading,  setStatsLoading]  = useState(true);
  const [totalRevenue,  setTotalRevenue]  = useState(0);
  const [totalSales,    setTotalSales]    = useState(0);
  const [activeProducts,setActiveProducts]= useState(0);
  const [recentSales,   setRecentSales]   = useState([]);
  const [topProducts,   setTopProducts]   = useState([]);

  /* ══════════════════════════════════════════
     LOAD USER
  ══════════════════════════════════════════ */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
        loadDashboardData(data.user.email);
      }
    });
  }, []);

  /* ══════════════════════════════════════════
     LOAD ALL REAL DASHBOARD DATA
     Queries:
       1. products uploaded by this seller
       2. payments where seller_email = this user (their sales)
       3. builds top products list from those sales
  ══════════════════════════════════════════ */
  const loadDashboardData = async (email) => {
    setStatsLoading(true);
    try {
      await Promise.all([
        loadSellerStats(email),
        loadRecentSales(email),
        loadTopProducts(email),
      ]);
    } finally {
      setStatsLoading(false);
    }
  };

  /* ── 1. Stats: total revenue, total sales, active product count ── */
  const loadSellerStats = async (email) => {
    // Count products this seller has uploaded
    const { count: prodCount } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("uploader_email", email);

    setActiveProducts(prodCount || 0);

    // Get all successful payments where this user is the seller
    const { data: payments, error } = await supabase
      .from("payments")
      .select("amount")
      .eq("seller_email", email)
      .eq("status", "success");

    if (error) { console.error("stats error:", error.message); return; }

    const sales = payments || [];
    const gross = sales.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const net   = gross * 0.90; // after 10% platform fee

    setTotalSales(sales.length);
    setTotalRevenue(net);
  };

  /* ── 2. Recent sales: last 5 payments for this seller's products ── */
  const loadRecentSales = async (email) => {
    const { data, error } = await supabase
      .from("payments")
      .select("id, user_email, product_id, amount, created_at")
      .eq("seller_email", email)
      .eq("status", "success")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) { console.error("recent sales error:", error.message); return; }
    if (!data || data.length === 0) { setRecentSales([]); return; }

    // Look up product titles for those product_ids
    const productIds = [...new Set(data.map(p => p.product_id))];
    const { data: products } = await supabase
      .from("products")
      .select("id, title")
      .in("id", productIds);

    const titleMap = Object.fromEntries((products || []).map(p => [p.id, p.title]));

    const rows = data.map((p, idx) => {
      const buyerName = p.user_email?.split("@")[0] || "Buyer";
      const initials  = buyerName.slice(0, 2).toUpperCase();
      return {
        id:       p.id,
        initials,
        name:     buyerName,
        bg:       AV_COLORS[idx % AV_COLORS.length],
        product:  titleMap[p.product_id] || "Unknown product",
        amount:   `$${parseFloat(p.amount).toFixed(2)}`,
        time:     relTime(p.created_at),
      };
    });

    setRecentSales(rows);
  };

  /* ── 3. Top products: group sales by product, sort by revenue ── */
  const loadTopProducts = async (email) => {
    const { data: payments, error } = await supabase
      .from("payments")
      .select("product_id, amount")
      .eq("seller_email", email)
      .eq("status", "success");

    if (error) { console.error("top products error:", error.message); return; }
    if (!payments || payments.length === 0) { setTopProducts([]); return; }

    // Aggregate per product
    const agg = {};
    for (const p of payments) {
      if (!agg[p.product_id]) agg[p.product_id] = { sales: 0, revenue: 0 };
      agg[p.product_id].sales   += 1;
      agg[p.product_id].revenue += parseFloat(p.amount) || 0;
    }

    // Fetch product titles
    const productIds = Object.keys(agg);
    const { data: products } = await supabase
      .from("products")
      .select("id, title")
      .in("id", productIds);

    const rows = (products || [])
      .map(p => ({
        id:      p.id,
        emoji:   getEmoji(p.title),
        name:    p.title,
        sales:   agg[p.id]?.sales   || 0,
        revenue: `$${((agg[p.id]?.revenue || 0) * 0.90).toFixed(2)}`,
        up:      (agg[p.id]?.sales || 0) > 1,
      }))
      .sort((a, b) => (agg[b.id]?.revenue || 0) - (agg[a.id]?.revenue || 0))
      .slice(0, 5);

    setTopProducts(rows);
  };

  /* ── logout ── */
  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    setTimeout(() => navigate("/"), 1200);
  };

  /* ── derived user info ── */
  const meta        = user?.user_metadata || {};
  const displayName = meta.first_name
    ? `${meta.first_name} ${meta.last_name || ""}`.trim()
    : user?.email?.split("@")[0] || "Creator";
  const handle    = user?.email ? `@${user.email.split("@")[0]}` : "@creator";
  const initials  = displayName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const firstName = displayName.split(" ")[0];

  /* ── sidebar nav ── */
  const NAV = [
    { id:"overview",    label:"Overview",    icon:I.home   },
    { id:"products",    label:"Products",    icon:I.box    },
    { id:"marketplace", label:"Marketplace", icon:I.store  },
    { id:"sales",       label:"Sales",       icon:I.dollar },
    { id:"wallet",      label:"Wallet",      icon:I.wallet },
    { id:"analytics",   label:"Analytics",   icon:I.chart  },
  ];

  const go = (id) => {
    setActiveNav(id);
    if (id === "marketplace") navigate("/marketplace");
    if (id === "products")    navigate("/upload");
    if (id === "overview")    navigate("/dashboard");
    if (id === "wallet")      navigate("/wallet");
  };

  const fmt = (n) => statsLoading ? "—" : `$${Number(n).toFixed(2)}`;

  return (
    <div className="dash-shell">
      <ToastContainer position="top-right" autoClose={3000} />
{/* ══════════════ SIDEBAR ══════════════ */}
      <aside className="dash-sidebar">

        <div className="sb-logo">
          <div className="sb-logo-mark">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2.4" strokeLinecap="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="sb-logo-text">Lineo</span>
        </div>

        <div className="sb-user-card" onClick={() => navigate("/profile")}>
          <div className="sb-user-avatar">{initials}</div>
          <div className="sb-user-info">
            <div className="sb-user-name">{displayName}</div>
            <div className="sb-user-handle">{handle}</div>
          </div>
          <span className="sb-user-badge">Free</span>
        </div>

        <nav className="sb-nav">
          <div className="sb-section-label">Main menu</div>
          {NAV.map(item => (
            <button
              key={item.id}
              className={`sb-nav-item ${activeNav === item.id ? "active" : ""}`}
              onClick={() => go(item.id)}
            >
              <Ic d={item.icon} s={15} />
              {item.label}
            </button>
          ))}

          <div className="sb-section-label">Account</div>
          <button
            className={`sb-nav-item ${activeNav === "profile" ? "active" : ""}`}
            onClick={() => { setActiveNav("profile"); navigate("/profile"); }}
          >
            <Ic d={I.user} s={15} />
            Profile
          </button>
          <button
            className={`sb-nav-item ${activeNav === "settings" ? "active" : ""}`}
            onClick={() => setActiveNav("settings")}
          >
            <Ic d={I.cog} s={15} />
            Settings
          </button>

          <div className="sb-section-label">Help</div>
          <button
            className="sb-nav-item"
            onClick={() => navigate("/support")}
          >
            <Ic d={I.support} s={15} />
            Support
          </button>
          <button
            className="sb-nav-item"
            onClick={() => navigate("/terms")}
          >
            <Ic d={I.shield} s={15} />
            Terms &amp; Privacy
          </button>
        </nav>

        <div className="sb-bottom">
          <button className="sb-logout-btn" onClick={logout}>
            <Ic d={I.logout} s={15} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ══════════════ MAIN ══════════════ */}
      <div className="dash-main">

        <header className="dash-topbar">
          <div className="topbar-user" onClick={() => navigate("/profile")}>
            <div className="topbar-avatar">{initials}</div>
            <div className="topbar-greeting">
              <span className="topbar-greeting-name">{displayName}</span>
              <span className="topbar-greeting-sub">{handle}</span>
            </div>
          </div>

          <div className="topbar-spacer" />

          <div className="topbar-search">
            <Ic d={I.search} s={14} />
            <input placeholder="Search products, sales…" />
          </div>

          <div className="topbar-spacer" />

          <div className="topbar-actions">
            <button className="topbar-icon-btn" title="Notifications">
              <Ic d={I.bell} s={15} />
              <span className="topbar-notif-dot" />
            </button>
            <button
              className="topbar-icon-btn"
              title="Wallet"
              onClick={() => navigate("/wallet")}
            >
              <Ic d={I.wallet} s={15} />
            </button>
          </div>
        </header>

        <div className="dash-scroll">

          {/* Welcome banner */}
          <div className="dash-banner">
            <div className="banner-text">
              <h2>Good morning, {firstName} 👋</h2>
              <p>Here's what's happening with your store today.</p>
            </div>
            <div className="banner-actions">
              <button className="btn-banner-solid" onClick={() => navigate("/upload")}>
                <Ic d={I.upload} s={14} />
                Upload product
              </button>
              <button className="btn-banner-ghost" onClick={() => navigate("/marketplace")}>
                <Ic d={I.store} s={14} />
                Marketplace
              </button>
            </div>
          </div>

          {/* ── REAL STATS ── */}
          <div className="stats-row">
            {[
              {
                icon: "💰",
                label: "Net revenue (after fee)",
                value: fmt(totalRevenue),
                change: statsLoading ? "—" : `${totalSales} sales`,
                up: true,
              },
              {
                icon: "🛍️",
                label: "Total sales",
                value: statsLoading ? "—" : String(totalSales),
                change: statsLoading ? "—" : totalSales > 0 ? "active" : "none yet",
                up: totalSales > 0,
              },
              {
                icon: "📦",
                label: "Active products",
                value: statsLoading ? "—" : String(activeProducts),
                change: activeProducts > 0 ? "listed" : "upload one",
                up: activeProducts > 0,
              },
              {
                icon: "💳",
                label: "Wallet balance",
                value: fmt(totalRevenue),
                change: "after 10% fee",
                up: true,
              },
            ].map((s, i) => (
              <div key={i} className="stat-tile">
                <div className="stat-tile-top">
                  <div className="stat-tile-icon">{s.icon}</div>
                  <span className={`stat-tile-pill ${s.up ? "pill-green" : "pill-red"}`}>
                    {s.change}
                  </span>
                </div>
                <div className="stat-tile-val">{s.value}</div>
                <div className="stat-tile-lbl">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="quick-row">
            {[
              { emoji:"📦", label:"Upload Product", bg:"#ede9ff", action:() => navigate("/upload")      },
              { emoji:"🛒", label:"Marketplace",    bg:"#fff1ef", action:() => navigate("/marketplace") },
              { emoji:"💰", label:"Wallet",         bg:"#dcfce7", action:() => navigate("/wallet")      },
              { emoji:"👤", label:"View Profile",   bg:"#fff8ec", action:() => navigate("/profile")     },
            ].map((q, i) => (
              <button key={i} className="quick-tile" onClick={q.action}
                style={{ background:"#fff", borderColor:"#e2dff7" }}>
                <div className="quick-tile-icon" style={{ background: q.bg }}>{q.emoji}</div>
                {q.label}
              </button>
            ))}
          </div>

          {/* Bottom grid */}
          <div className="dash-bottom-grid">

            {/* ── REAL Recent Sales ── */}
            <div className="data-card">
              <div className="data-card-head">
                <h3>Recent Sales</h3>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate("/wallet"); }}>
                  View all →
                </a>
              </div>

              {statsLoading ? (
                <div style={{padding:"32px 20px", textAlign:"center", color:"#a09cba", fontSize:13}}>
                  Loading sales…
                </div>
              ) : recentSales.length === 0 ? (
                <div style={{padding:"32px 20px", textAlign:"center", color:"#a09cba", fontSize:13}}>
                  <div style={{fontSize:32, marginBottom:8}}>🛍️</div>
                  No sales yet — share your products to start earning!
                </div>
              ) : (
                <table className="sales-tbl">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSales.map(s => (
                      <tr key={s.id}>
                        <td>
                          <div className="sc-buyer">
                            <div className="sc-av" style={{ background: s.bg }}>
                              <span style={{ color:"#5b4ff5", fontSize:11, fontWeight:800 }}>{s.initials}</span>
                            </div>
                            <div>
                              <div className="sc-name">{s.name}</div>
                              <div className="sc-time">{s.time}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="sc-prod">{s.product}</span></td>
                        <td><span className="sc-amt">{s.amount}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* ── REAL Top Products ── */}
            <div className="data-card">
              <div className="data-card-head">
                <h3>Top Products</h3>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate("/marketplace"); }}>
                  All products →
                </a>
              </div>

              {statsLoading ? (
                <div style={{padding:"32px 20px", textAlign:"center", color:"#a09cba", fontSize:13}}>
                  Loading products…
                </div>
              ) : topProducts.length === 0 ? (
                <div style={{padding:"32px 20px", textAlign:"center", color:"#a09cba", fontSize:13}}>
                  <div style={{fontSize:32, marginBottom:8}}>📦</div>
                  No products yet —{" "}
                  <span
                    style={{color:"#5b4ff5", fontWeight:600, cursor:"pointer"}}
                    onClick={() => navigate("/upload")}
                  >
                    upload your first one
                  </span>
                </div>
              ) : (
                <div className="prod-list">
                  {topProducts.map(p => (
                    <div key={p.id} className="prod-row">
                      <div className="prod-emoji">{p.emoji}</div>
                      <div className="prod-details">
                        <div className="prod-name">{p.name}</div>
                        <div className="prod-meta">
                          {p.sales} sale{p.sales !== 1 ? "s" : ""} · {p.up ? "↑ trending" : "new"}
                        </div>
                      </div>
                      <div className="prod-rev">{p.revenue}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
