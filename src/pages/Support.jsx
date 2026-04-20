import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SUPPORT_EMAIL = "pecoindustries1@gmail.com";

const FAQ = [
  {
    q: "How do I withdraw my earnings?",
    a: "Go to your Wallet page, enter your PayPal email and the amount you want to withdraw (minimum $3.00). A 10% platform fee is deducted. Requests are processed within 24 hours.",
  },
  {
    q: "Why is the download button not showing after I paid?",
    a: "After payment, you are redirected back to the marketplace where the download button appears automatically. If it doesn't appear, try refreshing the page. If the issue persists, contact support with your PayPal order ID.",
  },
  {
    q: "How do I get a refund?",
    a: "All digital product sales are generally final. If a product does not match its description or has a technical fault, contact us at " + SUPPORT_EMAIL + " with your order details and we will review within 48 hours.",
  },
  {
    q: "How do I share my product link?",
    a: "On the Marketplace page, each product card has a 'Copy Link' button. Anyone can open that link — they will land directly on your product and can purchase it.",
  },
  {
    q: "Can I sell any type of digital product?",
    a: "You can sell ebooks, templates, courses, music, software, presets, illustrations, and more. Products that are illegal, infringe copyright, or contain malware will be removed immediately.",
  },
  {
    q: "Why is my balance showing $0?",
    a: "Your balance shows earnings from products you've uploaded. Make sure your products table has your email as the uploader_email. If you believe there is an error, contact support.",
  },
  {
    q: "How long does account verification take?",
    a: "Account verification via email is instant. Check your spam folder if you haven't received the verification email.",
  },
];

function Support() {
  const navigate = useNavigate();
  const [openFaq,  setOpenFaq]  = useState(null);
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [subject,  setSubject]  = useState("");
  const [message,  setMessage]  = useState("");

  const sendEmail = () => {
    if (!name || !email || !subject || !message) {
      return toast.warning("Please fill all fields before sending.");
    }
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );
    const sub  = encodeURIComponent(`[Lineo Support] ${subject}`);
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${sub}&body=${body}`;
    toast.success("Opening your email client… We reply quickly! 🚀");
  };

  return (
    <div className="inner-page">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="inner-topbar">
        <button className="inner-back-btn" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </button>
        <span className="inner-topbar-title">Support</span>
      </div>

      <div className="inner-content">

        <div className="inner-hero">
          <h1>We're here to help 👋</h1>
          <p>Fast responses, real humans. Most questions answered within a few hours.</p>
        </div>

        {/* ── QUICK CONTACT CARD ── */}
        <div className="inner-card" style={{ marginBottom: 18 }}>
          <div className="inner-card-head">
            <h3>Contact Support</h3>
            <span>⚡ Quick response</span>
          </div>
          <div className="inner-card-body" style={{ display:"flex", flexDirection:"column", gap:14 }}>

            {/* Direct email badge */}
            <div style={{
              display:"flex", alignItems:"center", gap:12,
              background:"#ede9ff", border:"1px solid rgba(91,79,245,0.2)",
              borderRadius:12, padding:"12px 16px",
            }}>
              <span style={{fontSize:22}}>📧</span>
              <div>
                <div style={{fontSize:13.5, fontWeight:700, color:"#1a1535"}}>Email us directly</div>
                <a href={`mailto:${SUPPORT_EMAIL}`}
                  style={{fontSize:13, color:"#5b4ff5", fontWeight:600}}>
                  {SUPPORT_EMAIL}
                </a>
              </div>
            </div>

            {/* Form fields */}
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
              <div>
                <label style={{display:"block", fontSize:12.5, fontWeight:700, color:"#1a1535", marginBottom:5}}>Your name</label>
                <input
                  style={fieldStyle}
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label style={{display:"block", fontSize:12.5, fontWeight:700, color:"#1a1535", marginBottom:5}}>Your email</label>
                <input
                  style={fieldStyle}
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{display:"block", fontSize:12.5, fontWeight:700, color:"#1a1535", marginBottom:5}}>Subject</label>
              <input
                style={fieldStyle}
                placeholder="e.g. Payment not reflecting, Download issue…"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div>
              <label style={{display:"block", fontSize:12.5, fontWeight:700, color:"#1a1535", marginBottom:5}}>Message</label>
              <textarea
                style={{...fieldStyle, minHeight:110, resize:"vertical"}}
                placeholder="Describe your issue in detail. Include any order IDs or error messages if relevant."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button
              onClick={sendEmail}
              style={{
                padding:"12px", background:"linear-gradient(135deg,#5b4ff5,#7468f7)",
                color:"#fff", border:"none", borderRadius:12, fontSize:14,
                fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                boxShadow:"0 4px 16px rgba(91,79,245,0.3)",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              }}
            >
              📨 Send Message
            </button>

            <p style={{fontSize:12, color:"#a09cba", textAlign:"center", marginTop:-4}}>
              We typically respond within a few hours — often faster. 🚀
            </p>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="inner-card" style={{ animationDelay:"0.08s" }}>
          <div className="inner-card-head">
            <h3>Frequently Asked Questions</h3>
            <span>{FAQ.length} topics</span>
          </div>
          <div style={{padding:"8px 0"}}>
            {FAQ.map((item, i) => (
              <div key={i} style={{borderBottom: i < FAQ.length - 1 ? "1px solid #f4f2fe" : "none"}}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width:"100%", textAlign:"left", padding:"15px 24px",
                    background:"transparent", border:"none", cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    gap:12, fontFamily:"inherit",
                  }}
                >
                  <span style={{fontSize:13.5, fontWeight:600, color:"#1a1535"}}>{item.q}</span>
                  <span style={{
                    fontSize:18, color:"#5b4ff5", flexShrink:0,
                    transform: openFaq === i ? "rotate(45deg)" : "rotate(0)",
                    transition:"transform 0.2s",
                  }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{
                    padding:"0 24px 16px",
                    fontSize:13.5, color:"#6b6580", lineHeight:1.7,
                  }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const fieldStyle = {
  width:"100%", padding:"11px 13px",
  borderRadius:10, border:"1.5px solid #e2dff7",
  background:"#faf9ff", color:"#1a1535",
  fontFamily:"inherit", fontSize:13.5,
  boxSizing:"border-box",
  outline:"none",
};

export default Support;

