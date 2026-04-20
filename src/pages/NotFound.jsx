import { useNavigate } from "react-router-dom";
import "../styles/pages.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight:"100vh", background:"#f0effe",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:24, fontFamily:"'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{
        background:"#fff", border:"1px solid #e2dff7",
        borderRadius:24, padding:"56px 40px",
        textAlign:"center", maxWidth:460, width:"100%",
        boxShadow:"0 8px 40px rgba(91,79,245,0.1)",
        animation:"innerFadeUp 0.45s ease both",
      }}>
        <div style={{fontSize:64, marginBottom:16}}>🔍</div>

        <div style={{
          fontFamily:"'Fraunces', serif",
          fontSize:88, fontWeight:700, color:"#5b4ff5",
          letterSpacing:"-0.04em", lineHeight:1,
          marginBottom:8,
        }}>404</div>

        <h2 style={{
          fontFamily:"'Fraunces', serif",
          fontSize:22, fontWeight:700, color:"#1a1535",
          letterSpacing:"-0.02em", marginBottom:10,
        }}>Page not found</h2>

        <p style={{
          fontSize:14, color:"#8b84b0",
          lineHeight:1.7, marginBottom:28,
        }}>
          The page you're looking for doesn't exist or has been moved.
          Head back to the dashboard to continue.
        </p>

        <div style={{display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap"}}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding:"11px 24px",
              background:"linear-gradient(135deg,#5b4ff5,#7468f7)",
              color:"#fff", border:"none", borderRadius:12,
              fontSize:14, fontWeight:700, cursor:"pointer",
              fontFamily:"inherit",
              boxShadow:"0 4px 16px rgba(91,79,245,0.3)",
            }}
          >
            🏠 Go to Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding:"11px 24px",
              background:"#fff", color:"#1a1535",
              border:"1.5px solid #e2dff7", borderRadius:12,
              fontSize:14, fontWeight:600, cursor:"pointer",
              fontFamily:"inherit",
            }}
          >
            ← Go back
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
