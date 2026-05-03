import { BrowserRouter, Routes, Route } from "react-router-dom";
import BrowseProjects from "./pages/BrowseProjects";
import BrowsePortfolios from "./pages/BrowsePortfolios";
import Favorites from "./pages/Favorites";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "1rem", background: "#f0f0f0", display: "flex", gap: "1rem" }}>
        <a href="/browse-projects">Browse Projects</a>
        <a href="/browse-portfolios">Browse Portfolios</a>
        <a href="/favorites">Favorites</a>
      </nav>
      <Routes>
        <Route path="/browse-projects" element={<BrowseProjects />} />
        <Route path="/browse-portfolios" element={<BrowsePortfolios />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;