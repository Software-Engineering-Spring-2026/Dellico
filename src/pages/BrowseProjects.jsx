import { useState, useEffect } from "react";

function BrowseProjects() {
  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterInstructor, setFilterInstructor] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [sortBy, setSortBy] = useState("date_desc");
  
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    loadProjects();
    loadInstructors();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [searchTerm, filterCourse, filterInstructor, dateRange, sortBy, allProjects]);

  function loadProjects() {
    const projects = JSON.parse(localStorage.getItem("allProjects")) || [];
    const publicProjects = projects.filter(p => p.visibility === "Public");
    setAllProjects(publicProjects);
  }

  function loadInstructors() {
    const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const instructorList = users.filter(u => u.role === "instructor");
    setInstructors(instructorList);
  }

  function applyFiltersAndSort() {
    let results = [...allProjects];

    if (searchTerm) {
      results = results.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCourse) {
      results = results.filter(p => p.course === filterCourse);
    }

    if (filterInstructor) {
      results = results.filter(p => p.supervisor === filterInstructor);
    }

    if (dateRange.from) {
      results = results.filter(p => {
        const projectDate = new Date(p.createdAt || p.creationDate);
        return projectDate >= new Date(dateRange.from);
      });
    }
    if (dateRange.to) {
      results = results.filter(p => {
        const projectDate = new Date(p.createdAt || p.creationDate);
        return projectDate <= new Date(dateRange.to);
      });
    }

    results.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.creationDate);
      const dateB = new Date(b.createdAt || b.creationDate);
      switch(sortBy) {
        case "date_desc":
          return dateB - dateA;
        case "date_asc":
          return dateA - dateB;
        default:
          return 0;
      }
    });

    setFilteredProjects(results);
  }

  function viewProjectDetails(project) {
    localStorage.setItem("selectedProject", JSON.stringify(project));
    window.location.href = "/project-details";
  }

  function clearFilters() {
    setSearchTerm("");
    setFilterCourse("");
    setFilterInstructor("");
    setDateRange({ from: "", to: "" });
    setSortBy("date_desc");
  }

  return (
    <div className="browse-page-modern">
      <div className="page-header">
        <h1>🚀 Browse Projects</h1>
        <p>Search, filter, and explore student projects</p>
      </div>

      {/* Search and Filters */}
      <div className="filters-card">
        <div className="search-bar-modern">
          <input
            type="text"
            placeholder="🔍 Search projects by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="clear-filters-btn" onClick={clearFilters}>Clear All</button>
        </div>
        
        <div className="filters-row">
          <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
            <option value="">All Courses</option>
            <option>Software Engineering</option>
            <option>Database Systems</option>
            <option>Web Development</option>
            <option>Bachelor Project</option>
          </select>
          
          <select value={filterInstructor} onChange={(e) => setFilterInstructor(e.target.value)}>
            <option value="">All Instructors</option>
            {instructors.map(inst => (
              <option key={inst.email} value={`Dr. ${inst.lastName}`}>
                Dr. {inst.firstName} {inst.lastName}
              </option>
            ))}
          </select>
          
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date_desc">📅 Newest First</option>
            <option value="date_asc">📅 Oldest First</option>
          </select>
        </div>

        <div className="date-filters-row">
          <div className="date-input">
            <label>From Date</label>
            <input type="date" value={dateRange.from} onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })} />
          </div>
          <div className="date-input">
            <label>To Date</label>
            <input type="date" value={dateRange.to} onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-count-modern">
        Found <strong>{filteredProjects.length}</strong> projects
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="empty-state-browse">
          <span>📭</span>
          <h3>No projects found</h3>
          <p>Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="projects-grid-modern">
          {filteredProjects.map(project => (
            <div key={project.id} className="project-card-modern">
              <div className="project-card-header">
                <h3>{project.title}</h3>
                <span className="course-tag">{project.course}</span>
              </div>
              <p className="project-student">👨‍🎓 {project.studentEmail}</p>
              <p className="project-supervisor">👨‍🏫 {project.supervisor || "Not specified"}</p>
              <p className="project-languages">💻 {project.programmingLanguages || "No languages specified"}</p>
              <p className="project-date">📅 {new Date(project.createdAt || project.creationDate).toLocaleDateString()}</p>
              <button className="view-btn" onClick={() => viewProjectDetails(project)}>
                View Details →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BrowseProjects;