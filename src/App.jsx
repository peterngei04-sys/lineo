import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/global.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UploadProduct from "./pages/UploadProduct";
import Marketplace from "./pages/Marketplace";
import Profile from "./pages/Profile";
import Success from "./pages/Success";
import Wallet   from "./pages/Wallet";
import Terms    from "./pages/Terms";
import Privacy  from "./pages/Privacy";
import Support  from "./pages/Support";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/upload" element={<UploadProduct />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/success" element={<Success />} />
       <Route path="/profile" element={<Profile />} />
       <Route path="/wallet"   element={<Wallet />} />
<Route path="/terms"    element={<Terms />} />
<Route path="/privacy"  element={<Privacy />} />
<Route path="/support"  element={<Support />} />
<Route path="*"         element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
