import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/success.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Success() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const hasFired  = useRef(false); // ← replaces sessionStorage guard (see below)

  const [status,  setStatus]  = useState("processing");
  const [orderID, setOrderID] = useState(null);

  useEffect(() => {
    handlePayment();
  }, []);

  const handlePayment = async () => {
    // ─────────────────────────────────────────────────────────────
    // BUG FIX: The original code used sessionStorage.getItem("captured")
    // as a duplicate-execution guard.  The problem: sessionStorage persists
    // for the entire browser tab session, so the key set during payment #1
    // was STILL there when the user came back to buy a second product.
    // Result: handlePayment returned immediately every time after the first
    // purchase → status stayed "processing" forever → no redirect.
    //
    // Fix: use a React ref (hasFired) that only lives for this component
    // mount.  Each new navigation to /success gets a fresh component mount
    // and a fresh ref = false, so the guard works correctly every time.
    // We also clear the old sessionStorage key so it can't cause issues.
    // ─────────────────────────────────────────────────────────────
    if (hasFired.current) return;
    hasFired.current = true;
    sessionStorage.removeItem("captured"); // clear legacy key

    try {
      const params     = new URLSearchParams(location.search);
      const token      = params.get("token");       // PayPal order token

      // These were saved to localStorage before the PayPal redirect
      const product_id  = localStorage.getItem("product_id");
      const amount      = localStorage.getItem("amount");
      const user_email  = localStorage.getItem("user_email");

      if (!token) {
        toast.error("Missing payment token");
        setStatus("error");
        return;
      }

      setOrderID(token);

      const res = await fetch("http://localhost:5000/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderID:    token,       // ← exact field name server.js expects
          product_id,
          amount,
          user_email,
        }),
      });

      const data = await res.json();

      if (data.status === "success") {
        toast.success("Payment successful 🎉");
        setStatus("success");

        // Signal marketplace to re-check payments
        localStorage.setItem("just_paid", "true");

        // Clean up payment context
        localStorage.removeItem("product_id");
        localStorage.removeItem("amount");
        localStorage.removeItem("user_email");

        setTimeout(() => navigate("/marketplace"), 2500);

      } else {
        console.error("Capture response:", data);
        toast.error("Payment capture failed — " + (data.error || "unknown error"));
        setStatus("error");
      }

    } catch (err) {
      console.error("handlePayment error:", err);
      toast.error("Something went wrong: " + err.message);
      setStatus("error");
    }
  };

  return (
    <div className="success-page">
      <ToastContainer position="top-right" autoClose={4000} />

      <div className="success-box">

        {/* ── PROCESSING ── */}
        {status === "processing" && (
          <>
            <div className="success-spinner-wrap">
              <div className="success-spinner" />
            </div>
            <h1>Confirming Payment…</h1>
            <p>Securely verifying your transaction with PayPal.<br />Please don't close this tab.</p>
          </>
        )}

        {/* ── SUCCESS ── */}
        {status === "success" && (
          <>
            <div className="success-checkmark">✓</div>
            <h1>Payment Successful! 🎉</h1>
            <p>Your purchase is confirmed. Redirecting you to the marketplace to download your product.</p>

            {orderID && (
              <div className="success-detail-row">
                <span className="success-detail-label">Order ID</span>
                <span className="success-detail-value">{orderID.slice(0, 22)}…</span>
              </div>
            )}

            <div className="success-redirect-bar">
              <div className="success-progress-track">
                <div className="success-progress-fill" />
              </div>
              <span>Redirecting to marketplace…</span>
            </div>

            <button className="success-cta" onClick={() => navigate("/marketplace")}>
              Go to marketplace now →
            </button>
          </>
        )}

        {/* ── ERROR ── */}
        {status === "error" && (
          <>
            <div className="success-error-icon">✕</div>
            <h1>Something went wrong</h1>
            <p>We couldn't confirm your payment. Check your PayPal account — if you were charged, contact support with your order ID.</p>
            <button
              className="success-cta"
              onClick={() => navigate("/marketplace")}
              style={{ background: "linear-gradient(135deg,#ff6b54,#e85540)", boxShadow: "0 4px 18px rgba(255,107,84,.35)" }}
            >
              Return to marketplace
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default Success;

