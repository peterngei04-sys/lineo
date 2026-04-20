import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/profile.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Profile() {
  const navigate = useNavigate();

  const [user,           setUser]           = useState(null);
  const [loading,        setLoading]        = useState(false);
  const [purchasedItems, setPurchasedItems] = useState([]);

  // Editable fields
  const [firstName,  setFirstName]  = useState("");
  const [lastName,   setLastName]   = useState("");
  const [username,   setUsername]   = useState("");
  const [bio,        setBio]        = useState("");
  const [category,   setCategory]   = useState("");

  /* ── load user on mount ── */
  useEffect(() => {
    loadUser();
    loadPurchasedProducts();
  }, []);

  const loadUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data?.user) { navigate("/"); return; }
    const u  = data.user;
    const md = u.user_metadata || {};
    setUser(u);
    setFirstName(md.first_name  || "");
    setLastName( md.last_name   || "");
    setUsername( md.username    || "");
    setBio(      md.bio         || "");
    setCategory( md.creator_category || "");
  };

  /* ── load products the user has purchased via backend check ── */
  const loadPurchasedProducts = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const email = userData?.user?.email;
      if (!email) return;

      // Fetch all products from Supabase
      const { data: products } = await supabase.from("products").select("*");
      if (!products || products.length === 0) return;

      // Check each product
      const paid = [];
      for (const p of products) {
        try {
          const res  = await fetch(
            `http://localhost:5000/check-payment?user_email=${encodeURIComponent(email)}&product_id=${encodeURIComponent(p.id)}`
          );
          if (!res.ok) continue;
          const d = await res.json();
          if (d.hasPaid) paid.push(p);
        } catch (_) {}
      }
      setPurchasedItems(paid);
    } catch (err) {
      console.log("loadPurchasedProducts error:", err);
    }
  };

  /* ── save profile changes ── */
  const saveProfile = async () => {
    if (!firstName.trim()) return toast.warning("First name is required");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        first_name:       firstName.trim(),
        last_name:        lastName.trim(),
        username:         username.trim(),
        bio:              bio.trim(),
        creator_category: category,
      },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile updated ✓");
    loadUser();
  };

  /* ── logout ── */
  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
    setTimeout(() => navigate("/"), 1000);
  };

  /* ── derived display values ── */
  const displayName = firstName
    ? `${firstName} ${lastName}`.trim()
    : user?.email?.split("@")[0] || "Creator";
  const handle   = username ? `@${username}` : `@${user?.email?.split("@")[0] || "creator"}`;
  const initials = displayName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const getEmoji = (title = "") => {
    const t = title.toLowerCase();
    if (t.includes("template"))                           return "📝";
    if (t.includes("course") || t.includes("guide"))     return "🎓";
    if (t.includes("music")  || t.includes("audio"))     return "🎵";
    if (t.includes("design") || t.includes("ui"))        return "🎨";
    if (t.includes("ebook")  || t.includes("book"))      return "📚";
    return "📦";
  };

  return (
    <div className="profile-page">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ── TOPBAR ── */}
      <div className="profile-topbar">
        <button className="profile-back-btn" onClick={() => navigate("/dashboard")}>
          <svg viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          Back
        </button>
        <span className="profile-topbar-title">Profile</span>
      </div>

      <div className="profile-content">

        {/* ── HERO CARD ── */}
        <div className="profile-hero-card">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-avatar-edit-hint" title="Edit profile below">✏️</div>
          </div>
          <div className="profile-hero-info">
            <div className="profile-hero-name">{displayName}</div>
            <div className="profile-hero-handle">{handle} · {user?.email}</div>
            <div className="profile-hero-tags">
              {category && <span className="profile-hero-tag">{category}</span>}
              <span className="profile-hero-tag">Free plan</span>
              <span className="profile-hero-tag">Creator</span>
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="profile-stats-row">
          <div className="profile-stat-tile">
            <div className="profile-stat-emoji">📦</div>
            <div className="profile-stat-value">—</div>
            <div className="profile-stat-label">Products listed</div>
          </div>
          <div className="profile-stat-tile">
            <div className="profile-stat-emoji">🛍️</div>
            <div className="profile-stat-value">{purchasedItems.length}</div>
            <div className="profile-stat-label">Purchases made</div>
          </div>
          <div className="profile-stat-tile">
            <div className="profile-stat-emoji">💰</div>
            <div className="profile-stat-value">—</div>
            <div className="profile-stat-label">Total earned</div>
          </div>
        </div>

        {/* ── EDIT PROFILE ── */}
        <div className="profile-section-card">
          <div className="profile-section-head">
            <h3>Account details</h3>
            <span>Changes save to your account</span>
          </div>
          <div className="profile-section-body">

            <div className="profile-field-row">
              <div className="profile-field">
                <label>First name</label>
                <input
                  type="text"
                  placeholder="Jane"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="profile-field">
                <label>Last name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="profile-field-row">
              <div className="profile-field">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="janedoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="profile-field">
                <label>Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  style={{ opacity: 0.6, cursor: "not-allowed" }}
                />
              </div>
            </div>

            <div className="profile-field-row">
              <div className="profile-field profile-field-full">
                <label>Creator category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Select category…</option>
                  <option value="Ebooks & Writing">Ebooks &amp; Writing</option>
                  <option value="Templates & Design">Templates &amp; Design</option>
                  <option value="Courses & Education">Courses &amp; Education</option>
                  <option value="Music & Audio">Music &amp; Audio</option>
                  <option value="Software & Tools">Software &amp; Tools</option>
                  <option value="Photography & Presets">Photography &amp; Presets</option>
                  <option value="Digital Art">Digital Art &amp; Illustrations</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="profile-field-row">
              <div className="profile-field profile-field-full">
                <label>Bio</label>
                <textarea
                  placeholder="Tell buyers a bit about yourself and what you create…"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>

            <button
              className="btn-save-profile"
              onClick={saveProfile}
              disabled={loading}
            >
              {loading ? "Saving…" : "💾 Save changes"}
            </button>
          </div>
        </div>

        {/* ── PURCHASED PRODUCTS ── */}
        <div className="profile-section-card">
          <div className="profile-section-head">
            <h3>My purchases</h3>
            <span>{purchasedItems.length} item{purchasedItems.length !== 1 ? "s" : ""}</span>
          </div>

          {purchasedItems.length === 0 ? (
            <div className="purchased-empty">
              <span>🛍️</span>
              You haven't purchased any products yet.
            </div>
          ) : (
            <div className="purchased-list">
              {purchasedItems.map((p) => (
                <div key={p.id} className="purchased-item">
                  <div className="purchased-emoji">{getEmoji(p.title)}</div>
                  <div className="purchased-info">
                    <div className="purchased-name">{p.title}</div>
                    <div className="purchased-meta">USD {Number(p.price).toFixed(2)} · Paid</div>
                  </div>
                  <a
                    href={p.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="purchased-download"
                  >
                    ⬇️ Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── DANGER ZONE ── */}
        <div className="danger-zone-card">
          <div className="danger-zone-head">
            <h3>Sign out</h3>
          </div>
          <div className="danger-zone-body">
            <p>You'll be signed out of your Lineo account on this device.</p>
            <button className="btn-logout-danger" onClick={logout}>
              🚪 Sign out
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;

