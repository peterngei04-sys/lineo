import { useNavigate } from "react-router-dom";
import "../styles/pages.css";

function Privacy() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("en-US", { month:"long", day:"numeric", year:"numeric" });

  return (
    <div className="inner-page">
      <div className="inner-topbar">
        <button className="inner-back-btn" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </button>
        <span className="inner-topbar-title">Privacy Policy</span>
      </div>

      <div className="inner-content">
        <div className="inner-hero">
          <h1>Privacy Policy</h1>
          <p>How Lineo collects, uses, and protects your information.</p>
        </div>

        <div className="inner-card">
          <div className="prose-body">
            <div className="prose-updated">📅 Last updated: {today}</div>

            <h2>1. Who We Are</h2>
            <p>Lineo ("we", "our", "us") operates the Lineo digital marketplace platform. This Privacy Policy explains how we handle your personal data when you use our services. Our contact email is <a href="mailto:pecoindustries1@gmail.com">pecoindustries1@gmail.com</a>.</p>

            <h2>2. Information We Collect</h2>
            <p><strong>Account information:</strong> When you sign up, we collect your name, email address, username, and creator category.</p>
            <p><strong>Payment information:</strong> When you make or receive a payment, we store transaction records including buyer email, seller email, product ID, amount, and PayPal transaction ID. We do not store full card numbers or PayPal passwords.</p>
            <p><strong>Product data:</strong> Titles, descriptions, pricing, and uploaded files you provide as a seller.</p>
            <p><strong>Usage data:</strong> Browser type, IP address, pages visited, and time spent on the platform for analytics and security purposes.</p>

            <h2>3. How We Use Your Information</h2>
            <ul>
              <li>To provide, operate, and improve the platform.</li>
              <li>To process payments and manage seller balances.</li>
              <li>To send transactional emails (e.g. purchase confirmations).</li>
              <li>To detect and prevent fraud and abuse.</li>
              <li>To respond to support requests.</li>
              <li>To comply with legal obligations.</li>
            </ul>

            <h2>4. Information Sharing</h2>
            <p>We do not sell your personal data. We may share your information with:</p>
            <ul>
              <li><strong>PayPal</strong> — to process payments and withdrawals.</li>
              <li><strong>Supabase</strong> — our database and authentication provider, which stores your account and transaction data securely.</li>
              <li><strong>Law enforcement</strong> — if required by applicable law or valid legal process.</li>
            </ul>

            <h2>5. Cookies &amp; Tracking</h2>
            <p>Lineo uses essential cookies to maintain your login session. We may use analytics tools to understand how the platform is used. You can disable cookies in your browser settings, though some features may not function properly.</p>

            <h2>6. Data Storage &amp; Security</h2>
            <p>Your data is stored on Supabase's secure infrastructure. We use HTTPS encryption for all data in transit. We implement industry-standard security practices, but no system is 100% secure. Please use a strong, unique password for your account.</p>

            <h2>7. Data Retention</h2>
            <p>We retain your account data for as long as your account is active. Transaction records are kept for a minimum of 7 years for financial and legal compliance purposes. You may request deletion of non-transactional data by contacting us.</p>

            <h2>8. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you.</li>
              <li>Correct inaccurate data.</li>
              <li>Request deletion of your account and data (subject to legal retention requirements).</li>
              <li>Object to certain uses of your data.</li>
              <li>Export your data in a portable format.</li>
            </ul>
            <p>To exercise these rights, email us at <a href="mailto:pecoindustries1@gmail.com">pecoindustries1@gmail.com</a>.</p>

            <h2>9. Children's Privacy</h2>
            <p>Lineo is not intended for users under 18. We do not knowingly collect personal data from minors. If you believe a minor has registered, please contact us and we will remove the account promptly.</p>

            <h2>10. Third-Party Links</h2>
            <p>Product files and external links may direct you to third-party websites. Lineo is not responsible for the privacy practices of those sites.</p>

            <h2>11. Changes to This Policy</h2>
            <p>We may update this policy periodically. Material changes will be communicated by email or prominent notice on the platform. Continued use after changes constitutes acceptance.</p>

            <h2>12. Contact Us</h2>
            <p>For any privacy-related questions or requests, contact us at <a href="mailto:pecoindustries1@gmail.com">pecoindustries1@gmail.com</a>. We aim to respond within 48 hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Privacy;

