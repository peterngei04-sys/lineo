import { useNavigate } from "react-router-dom";
import "../styles/pages.css";

function Terms() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("en-US", { month:"long", day:"numeric", year:"numeric" });

  return (
    <div className="inner-page">
      <div className="inner-topbar">
        <button className="inner-back-btn" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </button>
        <span className="inner-topbar-title">Terms of Service</span>
      </div>

      <div className="inner-content">
        <div className="inner-hero">
          <h1>Terms of Service</h1>
          <p>Please read these terms carefully before using Lineo.</p>
        </div>

        <div className="inner-card">
          <div className="prose-body">
            <div className="prose-updated">📅 Last updated: {today}</div>

            <h2>1. Acceptance of Terms</h2>
            <p>By creating an account or using the Lineo platform ("Lineo", "we", "our", or "us"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>

            <h2>2. About Lineo</h2>
            <p>Lineo is a digital products marketplace that enables creators ("Sellers") to upload and sell digital products, and enables buyers ("Buyers") to purchase and download those products. Lineo acts as a facilitator and is not responsible for the content of individual products.</p>

            <h2>3. Eligibility</h2>
            <p>You must be at least 18 years old to create an account. By registering, you confirm that you meet this requirement and that all information you provide is accurate and truthful.</p>

            <h2>4. Seller Responsibilities</h2>
            <ul>
              <li>You must own or have the legal right to sell any product you upload.</li>
              <li>You may not upload illegal, harmful, or infringing content.</li>
              <li>Product descriptions must be accurate and not misleading.</li>
              <li>You are responsible for ensuring your products work as described.</li>
              <li>Lineo reserves the right to remove any product at any time without notice.</li>
            </ul>

            <h2>5. Platform Fees</h2>
            <p>Lineo charges a <strong>10% platform fee</strong> on all sales and withdrawals. This fee covers payment processing, hosting, bandwidth, and platform maintenance. Fees are non-refundable once a transaction is completed.</p>

            <h2>6. Payments &amp; Withdrawals</h2>
            <p>Payments are processed via PayPal. Sellers may withdraw their available balance at any time, subject to a minimum withdrawal threshold of <strong>$3.00 USD</strong>. Withdrawal requests are processed within 24 hours on business days. Lineo is not liable for delays caused by PayPal or third-party payment processors.</p>

            <h2>7. Refund Policy</h2>
            <p>Due to the digital nature of products, all sales are generally final. Refunds may be issued at Lineo's sole discretion in cases of (a) a product that does not match its description, or (b) proven technical failure. To request a refund, contact <a href="mailto:pecoindustries1@gmail.com">pecoindustries1@gmail.com</a>.</p>

            <h2>8. Intellectual Property</h2>
            <p>Sellers retain ownership of their content. By uploading a product, you grant Lineo a non-exclusive, worldwide licence to display and distribute your product title, description, and preview for the purpose of operating the marketplace.</p>

            <h2>9. Prohibited Conduct</h2>
            <ul>
              <li>Uploading malware, viruses, or harmful code.</li>
              <li>Fraudulent transactions or chargeback abuse.</li>
              <li>Scraping, crawling, or reverse-engineering the platform.</li>
              <li>Impersonating other users or creating fake accounts.</li>
              <li>Using the platform for any unlawful purpose.</li>
            </ul>

            <h2>10. Account Termination</h2>
            <p>Lineo reserves the right to suspend or permanently terminate any account that violates these Terms, engages in fraudulent activity, or otherwise harms the platform or its users. Pending balances at the time of termination for cause may be forfeited.</p>

            <h2>11. Disclaimer of Warranties</h2>
            <p>Lineo is provided "as is" without warranties of any kind, express or implied. We do not guarantee uninterrupted access, error-free operation, or the accuracy of any product listing.</p>

            <h2>12. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Lineo's total liability for any claim arising from your use of the platform shall not exceed the fees you paid to Lineo in the 30 days preceding the claim.</p>

            <h2>13. Changes to Terms</h2>
            <p>We may update these Terms from time to time. Continued use of Lineo after changes are posted constitutes your acceptance of the revised Terms. We will notify users of material changes by email or in-app notice.</p>

            <h2>14. Contact</h2>
            <p>For questions about these Terms, contact us at <a href="mailto:pecoindustries1@gmail.com">pecoindustries1@gmail.com</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Terms;

