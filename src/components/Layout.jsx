import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("role");
    navigate("/");
  }

  return (
    <div className="template-layout">
      <Sidebar />

      <main className="template-content">
        <div className="template-topbar">
          <button className="template-logout" onClick={logout}>
            Logout
          </button>
        </div>

        {children}
      </main>
    </div>
  );
}

export default Layout;