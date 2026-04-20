import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) return toast.warning("Please fill in all fields");

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) return toast.error(error.message);

    toast.success("Welcome back! 🎉");
    setTimeout(() => navigate("/dashboard"), 1200);
  };

  const handleKey = (e) => { if (e.key === "Enter") login(); };

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

        {/* Card */}
        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Sign in to your account</h1>
            <p>Welcome back — your storefront is waiting</p>
          </div>

          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKey}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKey}
            />
          </div>

          <button
            className="auth-submit"
            onClick={login}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in →"}
          </button>

          <p className="switch-text">
            New to Lineo?{" "}
            <span onClick={() => navigate("/signup")}>Create a free account</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

