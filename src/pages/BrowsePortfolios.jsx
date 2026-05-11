import { useState, useEffect } from "react";

function BrowsePortfolios() {
  const [allPortfolios, setAllPortfolios] = useState([]);
  const [filteredPortfolios, setFilteredPortfolios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMajor, setFilterMajor] = useState("");
  const [filterSkills, setFilterSkills] = useState("");
  const [sortBy, setSortBy] = useState("projects_desc");
  
  const [majors, setMajors] = useState([]);

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
        projectCount: studentProjects.length,
        projects: studentProjects,
      };
    });
    
    setAllPortfolios(portfolioList);
    const uniqueMajors = [...new Set(portfolioList.map(p => p.major).filter(m => m !== "Not specified"))];
    setMajors(uniqueMajors);
  }

  function applyFiltersAndSort() {
    let results = [...allPortfolios];

    if (searchTerm) {
      results = results.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterMajor) {
      results = results.filter(p => p.major === filterMajor);
    }

    if (filterSkills) {
      results = results.filter(p => 
        p.skills.toLowerCase().includes(filterSkills.toLowerCase())
      );
    }

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

  function viewPortfolio(portfolio) {
    localStorage.setItem("selectedPortfolio", JSON.stringify(portfolio));
    window.location.href = `/student-profile-view?email=${portfolio.email}`;
  }

  return (
    <div className="browse-page-modern">
      <div className="page-header">
        <h1>📁 Browse Portfolios</h1>
        <p>Discover student portfolios by name, major, or skills</p>
      </div>

      {/* Search and Filters */}
      <div className="filters-card">
        <div className="search-bar-modern">
          <input
            type="text"
            placeholder="🔍 Search by student name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filters-row">
          <select value={filterMajor} onChange={(e) => setFilterMajor(e.target.value)}>
            <option value="">All Majors</option>
            {majors.map(major => (
              <option key={major} value={major}>{major}</option>
            ))}
          </select>
          
          <input
            type="text"
            placeholder="Filter by skills (e.g., React, Python)"
            value={filterSkills}
            onChange={(e) => setFilterSkills(e.target.value)}
          />
          
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="projects_desc">📊 Most Projects First</option>
            <option value="projects_asc">📊 Fewest Projects First</option>
            <option value="name_asc">🔤 Name (A-Z)</option>
            <option value="name_desc">🔤 Name (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-count-modern">
        Found <strong>{filteredPortfolios.length}</strong> portfolios
      </div>

      {/* Portfolios Grid */}
      {filteredPortfolios.length === 0 ? (
        <div className="empty-state-browse">
          <span>👤</span>
          <h3>No portfolios found</h3>
          <p>Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="portfolios-grid-modern">
          {filteredPortfolios.map(portfolio => (
            <div key={portfolio.email} className="portfolio-card-modern">
              <div className="portfolio-avatar-modern">
                {portfolio.name.charAt(0) || "👤"}
              </div>
              <div className="portfolio-info-modern">
                <h3>{portfolio.name || portfolio.email}</h3>
                <p className="portfolio-major">🎓 {portfolio.major}</p>
                <p className="portfolio-skills">💻 {portfolio.skills}</p>
                <div className="portfolio-stats-modern">
                  <span>📁 {portfolio.projectCount} project{portfolio.projectCount !== 1 ? 's' : ''}</span>
                </div>
                <button className="view-btn" onClick={() => viewPortfolio(portfolio)}>
                  View Portfolio →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BrowsePortfolios;