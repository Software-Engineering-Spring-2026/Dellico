// src/pages/Favorites.jsx - Enhanced version
import { useState, useEffect } from "react";

function Favorites() {
  const [favoriteProjects, setFavoriteProjects] = useState([]);
  const [favoritePortfolios, setFavoritePortfolios] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [allPortfolios, setAllPortfolios] = useState([]);
  const [activeTab, setActiveTab] = useState("projects");
  const [message, setMessage] = useState("");
  
  const currentUser = localStorage.getItem("currentUserEmail");

  useEffect(() => {
    loadFavorites();
    loadAllData();
  }, []);

  function loadFavorites() {
    const savedFavoriteProjects = JSON.parse(localStorage.getItem("favoriteProjects")) || [];
    const userFavoriteProjects = savedFavoriteProjects.filter(f => f.userEmail === currentUser);
    setFavoriteProjects(userFavoriteProjects);

    const savedFavoritePortfolios = JSON.parse(localStorage.getItem("favoritePortfolios")) || [];
    const userFavoritePortfolios = savedFavoritePortfolios.filter(f => f.userEmail === currentUser);
    setFavoritePortfolios(userFavoritePortfolios);
  }

  function loadAllData() {
    const projects = JSON.parse(localStorage.getItem("allProjects")) || [];
    setAllProjects(projects);

    const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const portfolios = users
      .filter(u => u.role === "student")
      .map(u => ({
        email: u.email,
        name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
        major: u.major || "Not specified",
        skills: u.skills || "Not specified",
        projectCount: projects.filter(p => p.studentEmail === u.email).length
      }));
    setAllPortfolios(portfolios);
  }

  function addFavoriteProject(project) {
    const savedFavorites = JSON.parse(localStorage.getItem("favoriteProjects")) || [];
    const alreadyFavorite = savedFavorites.some(f => f.projectId === project.id && f.userEmail === currentUser);
    
    if (alreadyFavorite) {
      setMessage("Project already in favorites");
      return;
    }

    const newFavorite = {
      id: Date.now(),
      projectId: project.id,
      projectTitle: project.title,
      projectCourse: project.course,
      projectStudent: project.studentEmail,
      userEmail: currentUser,
      addedAt: new Date().toISOString()
    };

    savedFavorites.push(newFavorite);
    localStorage.setItem("favoriteProjects", JSON.stringify(savedFavorites));
    setMessage(`Added "${project.title}" to favorites`);
    loadFavorites();
    setTimeout(() => setMessage(""), 2000);
  }

  function removeFavoriteProject(favoriteId) {
    const savedFavorites = JSON.parse(localStorage.getItem("favoriteProjects")) || [];
    const updatedFavorites = savedFavorites.filter(f => f.id !== favoriteId);
    localStorage.setItem("favoriteProjects", JSON.stringify(updatedFavorites));
    setMessage("Removed from favorites");
    loadFavorites();
    setTimeout(() => setMessage(""), 2000);
  }

  function getFavoriteProjectDetails() {
    return favoriteProjects.map(fav => {
      const project = allProjects.find(p => p.id === fav.projectId);
      return { ...fav, ...project };
    }).filter(p => p.title);
  }

  return (
    <div className="favorites-container">
      <h2>My Favorites</h2>
      <p>Save projects and portfolios you like for easy access</p>

      <div className="favorites-tabs">
        <button className={activeTab === "projects" ? "active-tab tab" : "tab"} onClick={() => setActiveTab("projects")}>
          📁 Favorite Projects ({favoriteProjects.length})
        </button>
        <button className={activeTab === "portfolios" ? "active-tab tab" : "tab"} onClick={() => setActiveTab("portfolios")}>
          👤 Favorite Portfolios ({favoritePortfolios.length})
        </button>
      </div>

      {message && <p className="success-text">{message}</p>}

      {activeTab === "projects" && (
        <section>
          {favoriteProjects.length === 0 ? (
            <div className="empty-state">
              <p>No favorite projects yet.</p>
              <p>Browse projects and click the ★ button to save them here.</p>
            </div>
          ) : (
            getFavoriteProjectDetails().map((project) => (
              <div key={project.id} className="list-card">
                <h4>{project.projectTitle}</h4>
                <p><strong>Course:</strong> {project.projectCourse}</p>
                <p><strong>Student:</strong> {project.projectStudent}</p>
                <div className="button-row">
                  <button className="secondary-btn" onClick={() => {
                    localStorage.setItem("selectedProject", JSON.stringify(project));
                    window.location.href = "/project-details";
                  }}>View Project</button>
                  <button className="secondary-btn danger-btn" onClick={() => removeFavoriteProject(project.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {activeTab === "portfolios" && (
        <section>
          {favoritePortfolios.length === 0 ? (
            <div className="empty-state">
              <p>No favorite portfolios yet.</p>
            </div>
          ) : (
            favoritePortfolios.map((portfolio) => (
              <div key={portfolio.id} className="list-card">
                <h4>{portfolio.portfolioName || portfolio.portfolioEmail}</h4>
                <p><strong>Major:</strong> {portfolio.portfolioMajor || "Not specified"}</p>
                <button className="secondary-btn" onClick={() => {
                  window.location.href = `/student-profile-view?email=${portfolio.portfolioEmail}`;
                }}>View Portfolio</button>
                <button className="secondary-btn danger-btn" onClick={() => {
                  const saved = JSON.parse(localStorage.getItem("favoritePortfolios")) || [];
                  const updated = saved.filter(f => f.id !== portfolio.id);
                  localStorage.setItem("favoritePortfolios", JSON.stringify(updated));
                  loadFavorites();
                }}>Remove</button>
              </div>
            ))
          )}
        </section>
      )}
    </div>
  );
}

export default Favorites;