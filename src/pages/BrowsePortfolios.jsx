import { useState, useEffect } from "react";

function BrowsePortfolios() {
  const [allPortfolios, setAllPortfolios] = useState([]);
  const [filteredPortfolios, setFilteredPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMajor, setFilterMajor] = useState("");
  const [filterSkills, setFilterSkills] = useState("");
  const [sortBy, setSortBy] = useState("projects_desc");
  const [activeTab, setActiveTab] = useState("browse");
  
  const [majors, setMajors] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadPortfolios();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [searchTerm, filterMajor, filterSkills, sortBy, allPortfolios]);

  function loadPortfolios() {
    const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const projects = JSON.parse(localStorage.getItem("allProjects")) || [];
    const portfolios = JSON.parse(localStorage.getItem("studentPortfolio")) || {};
    
    const students = users.filter(u => u.role === "student");
    
    const portfolioList = students.map(student => {
      const studentProjects = projects.filter(p => p.studentEmail === student.email && p.visibility === "Public");
      const studentPortfolio = portfolios[student.email] || {};
      
      return {
        email: student.email,
        name: `${student.firstName || ""} ${student.lastName || ""}`.trim(),
        major: studentPortfolio.major || "Not specified",
        skills: studentPortfolio.skills || "Not specified",
        linkedin: studentPortfolio.linkedin || "",
        pictureName: studentPortfolio.pictureName || null,
        projectCount: studentProjects.length,
        projects: studentProjects,
        registeredAt: new Date(student.registeredAt || Date.now()).toISOString()
      };
    });
    
    setAllPortfolios(portfolioList);
    
    // Extract unique majors for filter
    const uniqueMajors = [...new Set(portfolioList.map(p => p.major).filter(m => m !== "Not specified"))];
    setMajors(uniqueMajors);
  }

  function applyFiltersAndSort() {
    let results = [...allPortfolios];

    // Search by student name or email
    if (searchTerm) {
      results = results.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by major
    if (filterMajor) {
      results = results.filter(p => p.major === filterMajor);
    }

    // Filter by skills
    if (filterSkills) {
      results = results.filter(p => 
        p.skills.toLowerCase().includes(filterSkills.toLowerCase())
      );
    }

    // Sort portfolios
    results.sort((a, b) => {
      switch(sortBy) {
        case "projects_desc":
          return b.projectCount - a.projectCount;
        case "projects_asc":
          return a.projectCount - b.projectCount;
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    setFilteredPortfolios(results);
  }

  function viewPortfolioDetails(portfolio) {
    setSelectedPortfolio(portfolio);
    setActiveTab("details");
  }

  function clearFilters() {
    setSearchTerm("");
    setFilterMajor("");
    setFilterSkills("");
    setSortBy("projects_desc");
    setMessage("Filters cleared");
    setTimeout(() => setMessage(""), 2000);
  }

  return (
    <div className="browse-container">
      <h1>Browse Portfolios</h1>
      <p>Discover student portfolios by name, major, or skills</p>

      {/* Tab Navigation */}
      <div className="browse-tabs">
        <button className={activeTab === "browse" ? "active" : ""} onClick={() => setActiveTab("browse")}>
          🔍 Browse Portfolios
        </button>
        {selectedPortfolio && (
          <button className={activeTab === "details" ? "active" : ""} onClick={() => setActiveTab("details")}>
            👤 Portfolio Details
          </button>
        )}
      </div>

      {activeTab === "browse" && (
        <>
          {/* Search Bar */}
          <div className="search-section">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by student name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="clear-btn" onClick={clearFilters}>Clear All</button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="filters-section">
            <div className="filter-group">
              <label>Major</label>
              <select value={filterMajor} onChange={(e) => setFilterMajor(e.target.value)}>
                <option value="">All Majors</option>
                {majors.map(major => (
                  <option key={major} value={major}>{major}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Skills</label>
              <input
                type="text"
                placeholder="Filter by skills (e.g., React, Python)"
                value={filterSkills}
                onChange={(e) => setFilterSkills(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Sort by</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="projects_desc">📊 Most Projects First</option>
                <option value="projects_asc">📊 Fewest Projects First</option>
                <option value="name_asc">🔤 Name (A-Z)</option>
                <option value="name_desc">🔤 Name (Z-A)</option>
              </select>
            </div>
          </div>

          {message && <p className="success-text">{message}</p>}

          {/* Results Count */}
          <div className="results-header">
            <h3>Found {filteredPortfolios.length} portfolios</h3>
          </div>

          {/* Portfolios Grid */}
          {filteredPortfolios.length === 0 ? (
            <div className="empty-results">
              <p>No portfolios found matching your criteria.</p>
              <button className="primary" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="portfolios-grid">
              {filteredPortfolios.map(portfolio => (
                <div key={portfolio.email} className="portfolio-card">
                  <div className="portfolio-avatar">
                    {portfolio.pictureName ? (
                      <img src={portfolio.pictureName} alt={portfolio.name} />
                    ) : (
                      <span className="avatar-placeholder">
                        {portfolio.name.charAt(0) || "👨‍🎓"}
                      </span>
                    )}
                  </div>
                  <div className="portfolio-info">
                    <h3>{portfolio.name || portfolio.email}</h3>
                    <p className="portfolio-major">🎓 {portfolio.major}</p>
                    <p className="portfolio-skills">💻 {portfolio.skills}</p>
                    <div className="portfolio-stats">
                      <span>📁 {portfolio.projectCount} projects</span>
                    </div>
                    <button className="secondary-btn" onClick={() => viewPortfolioDetails(portfolio)}>
                      View Portfolio →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Portfolio Details View */}
      {activeTab === "details" && selectedPortfolio && (
        <div className="portfolio-details-browse">
          <button className="back-btn" onClick={() => setActiveTab("browse")}>
            ← Back to Search Results
          </button>
          
          <div className="details-card">
            <div className="portfolio-header">
              <div className="portfolio-avatar-large">
                {selectedPortfolio.pictureName ? (
                  <img src={selectedPortfolio.pictureName} alt={selectedPortfolio.name} />
                ) : (
                  <span>👨‍🎓</span>
                )}
              </div>
              <div className="portfolio-header-info">
                <h2>{selectedPortfolio.name || selectedPortfolio.email}</h2>
                <p className="portfolio-email">{selectedPortfolio.email}</p>
                <div className="portfolio-badges">
                  <span className="major-badge">🎓 {selectedPortfolio.major}</span>
                  <span className="projects-badge">📁 {selectedPortfolio.projectCount} Projects</span>
                </div>
                {selectedPortfolio.linkedin && (
                  <a href={selectedPortfolio.linkedin} target="_blank" className="linkedin-link">
                    🔗 LinkedIn Profile
                  </a>
                )}
              </div>
            </div>

            <div className="portfolio-skills-section">
              <h3>Skills & Expertise</h3>
              <div className="skills-tags">
                {selectedPortfolio.skills.split(",").map((skill, idx) => (
                  <span key={idx} className="skill-tag">{skill.trim()}</span>
                ))}
              </div>
            </div>

            <div className="portfolio-projects-section">
              <h3>Projects ({selectedPortfolio.projectCount})</h3>
              {selectedPortfolio.projects.length === 0 ? (
                <p>No public projects available.</p>
              ) : (
                <div className="portfolio-projects-list">
                  {selectedPortfolio.projects.map(project => (
                    <div key={project.id} className="portfolio-project-item">
                      <h4>{project.title}</h4>
                      <p>{project.course}</p>
                      <button 
                        className="small-btn" 
                        onClick={() => {
                          localStorage.setItem("selectedProject", JSON.stringify(project));
                          window.location.href = "/browse-projects";
                        }}
                      >
                        View Project Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrowsePortfolios;