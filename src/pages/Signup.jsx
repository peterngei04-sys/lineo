import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [username,  setUsername]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [category,  setCategory]  = useState("");
  const [agreed,    setAgreed]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const navigate = useNavigate();

  const signUp = async () => {
    if (!firstName || !lastName || !email || !password || !confirm) {
      return toast.warning("Please fill in all required fields");
    }
    if (password.length < 6) return toast.warning("Password must be at least 6 characters");
    if (password !== confirm)  return toast.warning("Passwords do not match");
    if (!agreed) return toast.warning("Please accept the Terms of Service and Privacy Policy to continue");

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name:       firstName,
          last_name:        lastName,
          username:         username || null,
          creator_category: category || null,
        },
      },
    });
    setLoading(false);

    if (error) return toast.error(error.message);

    toast.success("Account created! Check your email ✉️");
    setTimeout(() => navigate("/"), 1800);
  };

  return (
    <div className="auth-page">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="auth-wrap">
        {/* Logo */}
        <div className="auth-logo-bar">
          <div className="auth-logo-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="auth-logo-name">Lineo</span>
        </div>

        {/* Feature pills */}
        <div className="auth-features">
          <span className="auth-feature-pill"><span className="dot" />Free to start</span>
          <span className="auth-feature-pill"><span className="dot" />Instant payouts</span>
          <span className="auth-feature-pill"><span className="dot" />No hidden fees</span>
        </div>

        {/* Card */}
        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Create your account</h1>
            <p>Start selling digital products today — it's completely free</p>
          </div>

          <div className="input-row">
            <div className="form-group">
              <label>First name *</label>
              <input type="text" placeholder="Jane" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Last name *</label>
              <input type="text" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>Username</label>
            <input type="text" placeholder="janedoe  (shown on your store page)" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="form-section-label">Creator profile</div>

          <div className="form-group">
            <label>What do you sell?</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Choose a category…</option>
              <option value="ebooks">Ebooks &amp; Writing</option>
              <option value="templates">Templates &amp; Design assets</option>
              <option value="courses">Courses &amp; Education</option>
              <option value="music">Music &amp; Audio</option>
              <option value="software">Software &amp; Tools</option>
              <option value="photography">Photography &amp; Presets</option>
              <option value="art">Digital Art &amp; Illustrations</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-section-label">Account credentials</div>

          <div className="form-group">
            <label>Email address *</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="input-row">
            <div className="form-group">
              <label>Password *</label>
              <input type="password" placeholder="Min. 6 chars" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Confirm *</label>
              <input type="password" placeholder="Repeat it" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
          </div>

          {/* ── TERMS CHECKBOX ── */}
          <div style={{
            display:"flex", alignItems:"flex-start", gap:10,
            background: agreed ? "#f0fdf4" : "#faf9ff",
            border: `1.5px solid ${agreed ? "rgba(34,197,94,0.3)" : "#e2dff7"}`,
            borderRadius:10, padding:"12px 14px",
            marginBottom:16, transition:"all 0.2s",
          }}>
            <input
              id="terms-check"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{
                width:17, height:17, marginTop:1,
                accentColor:"#5b4ff5", cursor:"pointer",
                flexShrink:0,
              }}
            />
            <label
              htmlFor="terms-check"
              style={{fontSize:13, color:"#4a4560", lineHeight:1.6, cursor:"pointer"}}
            >
              I agree to Lineo's{" "}
              <span
                onClick={(e) => { e.preventDefault(); navigate("/terms"); }}
                style={{color:"#5b4ff5", fontWeight:600, cursor:"pointer", textDecoration:"underline"}}
              >
                Terms of Service
              </span>
              {" "}and{" "}
              <span
                onClick={(e) => { e.preventDefault(); navigate("/privacy"); }}
                style={{color:"#5b4ff5", fontWeight:600, cursor:"pointer", textDecoration:"underline"}}
              >
                Privacy Policy
              </span>
            </label>
          </div>

          <button
            className="auth-submit"
            onClick={signUp}
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create free account →"}
          </button>

          <p className="switch-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/")}>Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;

