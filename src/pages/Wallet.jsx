import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/wallet.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PLATFORM_FEE = 0.10;   // 10%
const MIN_WITHDRAW = 3.00;   // $3 minimum

function Wallet() {
  const navigate = useNavigate();

  const [userEmail,     setUserEmail]     = useState("");
  const [earnings,      setEarnings]      = useState([]);   // raw sale records
  const [withdrawals,   setWithdrawals]   = useState([]);   // past withdrawals
  const [loading,       setLoading]       = useState(true);
  const [withdrawing,   setWithdrawing]   = useState(false);

  // Withdraw form
  const [paypalEmail,   setPaypalEmail]   = useState("");
  const [withdrawAmt,   setWithdrawAmt]   = useState("");

  useEffect(() => { init(); }, []);

  /* ── load everything ── */
  const init = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const email = userData?.user?.email;
      if (!email) { navigate("/"); return; }
      setUserEmail(email);

      await Promise.all([
        loadEarnings(email),
        loadWithdrawals(email),
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────────────────────────
     LOAD EARNINGS
     How it works:
     1. Get all products uploaded by this user (matched by uploader_email OR
        we join via the products table where the seller_email = this user).
     2. For each product, fetch payments from the payments table.
     3. Each payment = a sale; gross = payment.amount, net = gross * 0.90.

     NOTE: This requires products to have an `uploader_email` column.
     If your products table doesn't have that yet, see the SQL note below.
  ───────────────────────────────────────────────── */
  const loadEarnings = async (email) => {
    // Step 1 — get my products
    const { data: myProducts, error: prodErr } = await supabase
      .from("products")
      .select("id, title")
      .eq("uploader_email", email);

    if (prodErr) {
      console.error("products fetch error:", prodErr.message);
      // Graceful fallback — empty earnings
      setEarnings([]);
      return;
    }

    if (!myProducts || myProducts.length === 0) {
      setEarnings([]);
      return;
    }

    const productIds = myProducts.map((p) => p.id);
    const productMap = Object.fromEntries(myProducts.map((p) => [p.id, p.title]));

    // Step 2 — get payments for those products
    const { data: payments, error: payErr } = await supabase
      .from("payments")
      .select("id, product_id, amount, user_email, created_at, status")
      .in("product_id", productIds)
      .eq("status", "success")
      .order("created_at", { ascending: false });

    if (payErr) {
      console.error("payments fetch error:", payErr.message);
      setEarnings([]);
      return;
    }

    const rows = (payments || []).map((p) => ({
      id:          p.id,
      product_id:  p.product_id,
      productName: productMap[p.product_id] || "Unknown product",
      buyerEmail:  p.user_email,
      gross:       parseFloat(p.amount) || 0,
      fee:         (parseFloat(p.amount) || 0) * PLATFORM_FEE,
      net:         (parseFloat(p.amount) || 0) * (1 - PLATFORM_FEE),
      date:        p.created_at,
    }));

    setEarnings(rows);
  };

  /* ── load past withdrawals ── */
  const loadWithdrawals = async (email) => {
    const { data, error } = await supabase
      .from("withdrawals")
      .select("*")
      .eq("seller_email", email)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("withdrawals fetch error:", error.message);
      setWithdrawals([]);
      return;
    }
    setWithdrawals(data || []);
  };

  /* ── derived numbers ── */
  const totalGross      = earnings.reduce((s, e) => s + e.gross, 0);
  const totalFees       = earnings.reduce((s, e) => s + e.fee, 0);
  const totalNet        = earnings.reduce((s, e) => s + e.net, 0);
  const totalWithdrawn  = withdrawals
    .filter((w) => w.status === "approved" || w.status === "pending")
    .reduce((s, w) => s + (parseFloat(w.amount) || 0), 0);
  const availableBalance = Math.max(0, totalNet - totalWithdrawn);

  const requestedAmt    = parseFloat(withdrawAmt) || 0;
  const feeOnWithdraw   = requestedAmt * PLATFORM_FEE;
  const youReceive      = requestedAmt - feeOnWithdraw;

  /* ── submit withdrawal ── */
  const submitWithdrawal = async () => {
    if (!paypalEmail) return toast.warning("Please enter your PayPal email");
    if (requestedAmt < MIN_WITHDRAW)
      return toast.warning(`Minimum withdrawal is $${MIN_WITHDRAW.toFixed(2)}`);
    if (requestedAmt > availableBalance)
      return toast.warning("Amount exceeds your available balance");

    setWithdrawing(true);
    try {
      const { error } = await supabase.from("withdrawals").insert([{
        seller_email:  userEmail,
        paypal_email:  paypalEmail,
        amount:        requestedAmt,
        fee:           feeOnWithdraw,
        net_amount:    youReceive,
        status:        "pending",
      }]);

      if (error) throw error;

      toast.success("Withdrawal request submitted! We'll process it within 24 hrs.");
      setWithdrawAmt("");
      loadWithdrawals(userEmail);
    } catch (err) {
      toast.error("Withdrawal failed: " + err.message);
    } finally {
      setWithdrawing(false);
    }
  };

  const fmt = (n) => `$${n.toFixed(2)}`;
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }) : "—";

  return (
    <div className="wallet-page">
      <ToastContainer position="top-right" autoClose={3500} />

      {/* ── TOPBAR ── */}
      <div className="wallet-topbar">
        <button className="wallet-back-btn" onClick={() => navigate("/dashboard")}>
          <svg viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </button>
        <span className="wallet-topbar-title">Wallet</span>
      </div>

      <div className="wallet-content">

        {/* ── BALANCE HERO ── */}
        <div className="wallet-balance-card">
          <div className="wbc-top">
            <span className="wbc-label">Available Balance</span>
            <span className="wbc-badge">10% platform fee</span>
          </div>

          <div className="wbc-amount">
            <span className="wbc-amount-currency">$</span>
            {loading ? "—" : availableBalance.toFixed(2)}
          </div>
          <div className="wbc-sub">After Lineo's 10% fee · Payable via PayPal</div>

          <div className="wbc-stats">
            <div className="wbc-stat">
              <span className="wbc-stat-val">{loading ? "—" : fmt(totalGross)}</span>
              <span className="wbc-stat-lbl">Gross sales</span>
            </div>
            <div className="wbc-stat">
              <span className="wbc-stat-val">{loading ? "—" : earnings.length.toString()}</span>
              <span className="wbc-stat-lbl">Total sales</span>
            </div>
            <div className="wbc-stat">
              <span className="wbc-stat-val">{loading ? "—" : fmt(totalFees)}</span>
              <span className="wbc-stat-lbl">Fees paid</span>
            </div>
            <div className="wbc-stat">
              <span className="wbc-stat-val">{loading ? "—" : fmt(totalWithdrawn)}</span>
              <span className="wbc-stat-lbl">Withdrawn</span>
            </div>
          </div>
        </div>

        {/* ── WITHDRAW CARD ── */}
        <div className="wallet-card">
          <div className="wallet-card-head">
            <h3>Request Withdrawal</h3>
            <span>PayPal only</span>
          </div>
          <div className="wallet-card-body">

            <div className="threshold-note">
              <span>ℹ️</span>
              <span>Minimum withdrawal is <strong>$3.00</strong>. A <strong>10% fee</strong> is deducted from your withdrawal amount. Requests are processed within <strong>24 hours</strong>.</span>
            </div>

            <div className="withdraw-field">
              <label>Your PayPal email</label>
              <input
                type="email"
                placeholder="your-paypal@email.com"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
              />
            </div>

            <div className="withdraw-field">
              <label>Amount to withdraw (USD)</label>
              <input
                type="number"
                placeholder="0.00"
                min={MIN_WITHDRAW}
                step="0.01"
                max={availableBalance}
                value={withdrawAmt}
                onChange={(e) => setWithdrawAmt(e.target.value)}
              />
            </div>

            {requestedAmt > 0 && (
              <div className="withdraw-preview">
                <div className="withdraw-preview-row">
                  <span className="wpr-label">You requested</span>
                  <span className="wpr-val">{fmt(requestedAmt)}</span>
                </div>
                <div className="withdraw-preview-row">
                  <span className="wpr-label">Platform fee (10%)</span>
                  <span className="wpr-fee">− {fmt(feeOnWithdraw)}</span>
                </div>
                <div className="divider-line" />
                <div className="withdraw-preview-row">
                  <span className="wpr-label" style={{fontWeight:700}}>You receive</span>
                  <span className="wpr-net wpr-val">{fmt(youReceive)}</span>
                </div>
              </div>
            )}

            <button
              className="btn-withdraw"
              onClick={submitWithdrawal}
              disabled={withdrawing || loading || availableBalance < MIN_WITHDRAW}
            >
              {withdrawing
                ? "⏳ Submitting…"
                : availableBalance < MIN_WITHDRAW
                  ? `🔒 Need $${MIN_WITHDRAW} minimum (you have ${fmt(availableBalance)})`
                  : "💸 Request Withdrawal via PayPal"}
            </button>
          </div>
        </div>

        {/* ── EARNINGS TABLE ── */}
        <div className="wallet-card" style={{ animationDelay: "0.1s" }}>
          <div className="wallet-card-head">
            <h3>Sales & Earnings</h3>
            <span>{earnings.length} sale{earnings.length !== 1 ? "s" : ""}</span>
          </div>

          {earnings.length === 0 ? (
            <div className="earnings-empty">
              <span>💰</span>
              {loading ? "Loading your earnings…" : "No sales yet. Upload a product and start sharing!"}
            </div>
          ) : (
            <table className="earnings-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Buyer</th>
                  <th>Gross</th>
                  <th>Fee (10%)</th>
                  <th>You earn</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((e) => (
                  <tr key={e.id}>
                    <td><div className="et-product">{e.productName}</div></td>
                    <td><div className="et-buyer">{e.buyerEmail}</div></td>
                    <td><div className="et-gross">{fmt(e.gross)}</div></td>
                    <td><div className="et-fee">−{fmt(e.fee)}</div></td>
                    <td><div className="et-net">{fmt(e.net)}</div></td>
                    <td><div className="et-date">{fmtDate(e.date)}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── PAST WITHDRAWALS ── */}
        {withdrawals.length > 0 && (
          <div className="wallet-card" style={{ animationDelay: "0.15s" }}>
            <div className="wallet-card-head">
              <h3>Withdrawal History</h3>
              <span>{withdrawals.length} request{withdrawals.length !== 1 ? "s" : ""}</span>
            </div>
            <table className="earnings-table">
              <thead>
                <tr>
                  <th>PayPal email</th>
                  <th>Requested</th>
                  <th>Fee</th>
                  <th>You get</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w.id}>
                    <td style={{fontSize:12.5, color:"#6b6580"}}>{w.paypal_email}</td>
                    <td>{fmt(parseFloat(w.amount) || 0)}</td>
                    <td><span className="et-fee">−{fmt(parseFloat(w.fee) || 0)}</span></td>
                    <td><span className="et-net">{fmt(parseFloat(w.net_amount) || 0)}</span></td>
                    <td>
                      <span style={{
                        background: w.status === "approved" ? "#dcfce7" : w.status === "pending" ? "#fff8ec" : "#ffe4e1",
                        color: w.status === "approved" ? "#166534" : w.status === "pending" ? "#9a6a0a" : "#c44230",
                        fontSize: 11.5, fontWeight: 700,
                        padding: "3px 9px", borderRadius: 99,
                      }}>
                        {w.status}
                      </span>
                    </td>
                    <td><div className="et-date">{fmtDate(w.created_at)}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

export default Wallet;

