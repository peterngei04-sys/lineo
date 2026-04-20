import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import "../styles/upload.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UploadProduct() {
  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice]             = useState("");
  const [file, setFile]               = useState(null);
  const [loading, setLoading]         = useState(false);
  const [uploaded, setUploaded]       = useState(null);
  const [linkCopied, setLinkCopied]   = useState(false);
  const navigate = useNavigate();

  const uploadProduct = async () => {
    if (!title || !description || !price) {
      return toast.warning("Please fill all fields");
    }

    if (!file) {
      return toast.warning("Please select a file");
    }

    try {
      setLoading(true);

      const fileName = `${Date.now()}-${file.name}`;

      // 1. Upload file — UNCHANGED
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Get URL (You can actually REMOVE this part entirely if you want)
const { data } = supabase.storage
  .from("products")
  .getPublicUrl(fileName);
      // 3. Get current user email — needed for wallet earnings
      const { data: userData } = await supabase.auth.getUser();
      const uploaderEmail = userData?.user?.email || null;
      
      // 4. Save to DB
const { data: insertData, error: dbError } = await supabase
  .from("products")
  .insert([
    {
      title,
      description,
      price,
      file_url: fileName, // <--- CHANGE THIS from data.publicUrl to fileName
      uploader_email: uploaderEmail,
    },
  ])
        .select()
        .single();

      if (dbError) throw dbError;

      toast.success("Product uploaded successfully! 🎉");

      // Show success banner with share link
      setUploaded({ id: insertData.id, title: insertData.title });

      // Reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setFile(null);

    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── copy share link ── */
  const copyLink = () => {
    if (!uploaded) return;
    const link = `${window.location.origin}/marketplace?product=${uploaded.id}`;
    navigator.clipboard.writeText(link).then(() => {
      setLinkCopied(true);
      toast.success("Link copied! Share it to get buyers 🔗");
      setTimeout(() => setLinkCopied(false), 2500);
    });
  };

  const shareLink = uploaded
    ? `${window.location.origin}/marketplace?product=${uploaded.id}`
    : "";

  return (
    <div className="upload-page">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ── TOPBAR ── */}
      <div className="up-topbar">
        <button className="up-back-btn" onClick={() => navigate("/dashboard")}>
          <svg viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          Back
        </button>
        <span className="up-topbar-title">Upload Product</span>
      </div>

      {/* ── CONTENT ── */}
      <div className="up-content">

        <div className="up-heading">
          <h1>List a new product 📦</h1>
          <p>Fill in the details below and your product will go live on the marketplace immediately.</p>
        </div>

        <div className="upload-card">

          {/* Title */}
          <div className="form-group">
            <label>Product Title</label>
            <input
              type="text"
              value={title}
              placeholder="e.g. Notion Dashboard Template"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              placeholder="Describe what's included, who it's for, and why it's valuable…"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Price */}
          <div className="form-group">
            <label>Price (USD)</label>
            <div className="price-input-wrap">
              <span className="price-currency-tag">USD $</span>
              <input
                type="number"
                value={price}
                placeholder="0.00"
                min="0"
                step="0.01"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          {/* File upload */}
          <div className="form-group">
            <label>Product File</label>
            <div className="file-drop-zone">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <div className="file-drop-icon">📎</div>
              <div className="file-drop-text">Click or drag a file here</div>
              <div className="file-drop-hint">PDF, ZIP, MP3, PNG, etc.</div>
            </div>
            {file && (
              <div className="file-name-tag">
                📄 {file.name}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            className="btn-upload"
            onClick={uploadProduct}
            disabled={loading}
          >
            {loading ? "⏳ Uploading…" : "🚀 Publish Product"}
          </button>
        </div>

        {/* ── SUCCESS BANNER ── */}
        {uploaded && (
          <div className="upload-success-banner">
            <div className="usb-emoji">🎉</div>
            <div className="usb-title">Congratulations! Your product is live.</div>
            <div className="usb-sub">
              Share the link below and start getting buyers for <strong style={{ color:"#fff" }}>{uploaded.title}</strong>.
            </div>

            <div className="usb-link-box">
              <span className="usb-link-url">{shareLink}</span>
              <button className="usb-copy-btn" onClick={copyLink}>
                {linkCopied ? "✓ Copied!" : "Copy link"}
              </button>
            </div>

            <div className="usb-actions">
              <button className="usb-btn-market" onClick={() => navigate("/marketplace")}>
                View in marketplace →
              </button>
              <button className="usb-btn-another" onClick={() => setUploaded(null)}>
                Upload another
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default UploadProduct;

