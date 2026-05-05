import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("role");
    navigate("/");
  }

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <header className="topbar">
          <div>
            <h1>Project Portfolio Platform</h1>
            <p>Manage, explore, and showcase projects</p>
          </div>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </header>

        {children}
      </main>
    </div>
  );
}

export default Layout;