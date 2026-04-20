import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import "../styles/marketplace.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../config";
function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(null);
  const [paidProducts, setPaidProducts] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const navigate = useNavigate();

  // 1. Initial Load Logic
  useEffect(() => {
    loadAll();
    
    // Check if user just returned from PayPal success page
    if (localStorage.getItem("just_paid")) {
      localStorage.removeItem("just_paid");
      setTimeout(() => loadAll(), 2000); 
    }
  }, []);

  const loadAll = async () => {
    const freshProducts = await fetchProducts();
    if (freshProducts && freshProducts.length > 0) {
      await checkPayments(freshProducts);
    }
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      toast.error("Failed to load products");
      return [];
    }
    setProducts(data || []);
    return data || [];
  };

  const checkPayments = async (productsList) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const paymentChecks = productsList.map(async (product) => {
        try {
          const res = await fetch(`${API_URL}/check-payment?user_email=${encodeURIComponent(email)}&product_id=${encodeURIComponent(p.id)}`)
                            
          const result = await res.json();
          return result.hasPaid ? product.id : null;
        } catch (e) { 
          return null; 
        }
      });

      const results = await Promise.all(paymentChecks);
      setPaidProducts(results.filter(id => id !== null));
    } catch (err) {
      console.error("Payment sync error:", err);
    }
  };

  // 2. Action Handlers
  const handleDownload = (product) => {
    // IMPORTANT: Ensure 'products' matches your Supabase Bucket name exactly
    const { data } = supabase.storage
      .from('products') 
      .getPublicUrl(product.file_url);

    if (data?.publicUrl) {
      const link = document.createElement('a');
      link.href = data.publicUrl;
      link.setAttribute('download', product.title || 'file');
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      toast.error("Download link failed to generate.");
    }
  };

  const buyProduct = async (product) => {
    try {
      setLoadingProduct(product.id);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please login to purchase");
        return;
      }

      // Store context for the success/callback page
      localStorage.setItem("product_id", product.id);
      localStorage.setItem("amount", product.price);
      localStorage.setItem("user_email", user.email);
                      localStorage.setItem("just_paid", "true"); 
      const res = await fetch(`${API_URL}/paypal/create-order`, {
        method: "POST",                                                                                           
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: product.price }),
      });

      const orderData = await res.json();
      if (orderData.links) {
        const approvalLink = orderData.links.find(l => l.rel === "approve").href;
        window.location.href = approvalLink;
      } else {
        throw new Error("No approval link found");
      }
    } catch (err) {
      toast.error("Checkout failed: " + err.message);
    } finally {
      setLoadingProduct(null);
    }
  };

  const copyShareLink = (productId) => {
    const link = `${window.location.origin}/marketplace?product=${productId}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedId(productId);
      toast.success("Link copied!");
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const getEmoji = (title = "") => {
    const t = title.toLowerCase();
    if (t.includes("code") || t.includes("app")) return "⚡";
    if (t.includes("course") || t.includes("guide")) return "🎓";
    if (t.includes("design") || t.includes("ui")) return "🎨";
    return "📦";
  };

  // 3. Render
  return (
    <div className="marketplace-page">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mp-topbar">
        <button className="mp-back-btn" onClick={() => navigate("/dashboard")}>Back</button>
        <span className="mp-topbar-title">Marketplace</span>
      </div>

      <div className="mp-content">
        <div className="mp-hero">
          <h1>Digital Marketplace 🛒</h1>
          <p>Pay once, download forever.</p>
        </div>

        <div className="product-grid">
          {products.map((product) => {
            const isPaid = paidProducts.includes(product.id);
            const shareUrl = `${window.location.origin}/marketplace?product=${product.id}`;

            return (
              <div key={product.id} className="product-card">
                <div className="product-preview">
                  <div className="product-preview-emoji">{getEmoji(product.title)}</div>
                  {!isPaid && <div className="preview-lock-overlay">🔒</div>}
                </div>

                <div className="product-card-body">
                  <div className="product-card-title">{product.title}</div>
                  <div className="product-card-desc">{product.description}</div>

                  <div className="product-card-footer">
                    <div className="product-price">USD {Number(product.price).toFixed(2)}</div>
                    
                    {isPaid ? (
                      <button 
                        onClick={() => handleDownload(product)} 
                        className="btn-download"
                        style={{ backgroundColor: "#28a745", color: "white", padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer", width: "100%", marginTop: "10px" }}
                      >
                        ⬇️ Download Now
                      </button>
                    ) : (
                      <button 
                        onClick={() => buyProduct(product)} 
                        className="btn-buy"
                        disabled={loadingProduct === product.id}
                        style={{ width: "100%", marginTop: "10px" }}
                      >
                        {loadingProduct === product.id ? "⏳ Processing..." : "💳 Buy Now"}
                      </button>
                    )}

                    <div className="share-link-row" style={{ marginTop: "15px", display: "flex", gap: "5px" }}>
                      <button 
                        className="btn-copy-link"
                        onClick={() => copyShareLink(product.id)}
                        style={{ fontSize: "12px" }}
                      >
                        {copiedId === product.id ? "✓ Copied" : "🔗 Copy Link"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Marketplace;
