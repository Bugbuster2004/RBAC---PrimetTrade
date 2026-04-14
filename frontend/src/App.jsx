import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      {/* Toast notifications — dark theme, top-center */}
      <Toaster
        position="top-center"
        theme="dark"
        richColors
        toastOptions={{
          style: {
            background: "#16181f",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "#e2e8f0",
            fontSize: "13px",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
