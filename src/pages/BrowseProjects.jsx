import { useState, useEffect } from "react";

function BrowseProjects() {
  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterInstructor, setFilterInstructor] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [sortBy, setSortBy] = useState("date_desc");
  const [activeTab, setActiveTab] = useState("browse");
  
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProjects();
    loadCourses();
    loadInstructors();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [searchTerm, filterCourse, filterInstructor, dateRange, sortBy, allProjects]);

  function loadProjects() {
    const projects = JSON.parse(localStorage.getItem("allProjects")) || [];
    // Only show public projects (visible on portfolio)
    const publicProjects = projects.filter(p => p.visibility === "Public");
    setAllProjects(publicProjects);
  }

  function loadCourses() {
    const savedCourses = JSON.parse(localStorage.getItem("courses")) || [];
    setCourses(savedCourses);
  }

  function loadInstructors() {
    const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const instructorList = users.filter(u => u.role === "instructor");
    setInstructors(instructorList);
  }

  function applyFiltersAndSort() {
    let results = [...allProjects];

    // Search by project title
    if (searchTerm) {
      results = results.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by course
    if (filterCourse) {
      results = results.filter(p => p.course === filterCourse);
    }

    // Filter by instructor/supervisor
    if (filterInstructor) {
      results = results.filter(p => p.supervisor === filterInstructor);
    }

    // Filter by date range
    if (dateRange.from) {
      results = results.filter(p => {
        const projectDate = new Date(p.createdAt || p.creationDate);
        const fromDate = new Date(dateRange.from);
        return projectDate >= fromDate;
      });
    }
    if (dateRange.to) {
      results = results.filter(p => {
        const projectDate = new Date(p.createdAt || p.creationDate);
        const toDate = new Date(dateRange.to);
        return projectDate <= toDate;
      });
    }

    // Sort projects
    results.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.creationDate);
      const dateB = new Date(b.createdAt || b.creationDate);
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;

      switch(sortBy) {
        case "date_desc":
          return dateB - dateA;
        case "date_asc":
          return dateA - dateB;
        case "rating_desc":
          return ratingB - ratingA;
        case "rating_asc":
          return ratingA - ratingB;
        default:
          return 0;
      }
    });

    setFilteredProjects(results);
  }

  function viewProjectDetails(project) {
    localStorage.setItem("selectedProject", JSON.stringify(project));
    setSelectedProject(project);
    setActiveTab("details");
  }

  function clearFilters() {
    setSearchTerm("");
    setFilterCourse("");
    setFilterInstructor("");
    setDateRange({ from: "", to: "" });
    setSortBy("date_desc");
    setMessage("Filters cleared");
    setTimeout(() => setMessage(""), 2000);
  }

  function getProjectRating(project) {
    const feedbacks = JSON.parse(localStorage.getItem("instructorFeedback")) || [];
    const projectFeedback = feedbacks.find(f => f.projectName === project.title);
    return projectFeedback?.rating || "Not rated";
  }

  return (
    <div className="browse-container">
      <h1>Browse Projects</h1>
      <p>Search, filter, and explore student projects</p>

      {/* Tab Navigation */}
      <div className="browse-tabs">
        <button className={activeTab === "browse" ? "active" : ""} onClick={() => setActiveTab("browse")}>
          🔍 Browse Projects
        </button>
        {selectedProject && (
          <button className={activeTab === "details" ? "active" : ""} onClick={() => setActiveTab("details")}>
            📄 Project Details
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
                placeholder="Search projects by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="clear-btn" onClick={clearFilters}>Clear All</button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="filters-section">
            <div className="filter-group">
              <label>Course</label>
              <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
                <option value="">All Courses</option>
                <option>Software Engineering</option>
                <option>Database Systems</option>
                <option>Web Development</option>
                <option>Human Computer Interaction</option>
                <option>Bachelor Project</option>
                {courses.map(c => (
                  <option key={c.code} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Course Instructor / Supervisor</label>
              <select value={filterInstructor} onChange={(e) => setFilterInstructor(e.target.value)}>
                <option value="">All Instructors</option>
                {instructors.map(inst => (
                  <option key={inst.email} value={`Dr. ${inst.lastName}`}>
                    Dr. {inst.firstName} {inst.lastName}
                  </option>
                ))}
                <option>Dr. Smith</option>
                <option>Dr. Ahmed</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sort by</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date_desc">📅 Newest First</option>
                <option value="date_asc">📅 Oldest First</option>
                <option value="rating_desc">⭐ Highest Rated</option>
                <option value="rating_asc">⭐ Lowest Rated</option>
              </select>
            </div>
          </div>

          {/* Date Range Filters */}
          <div className="date-filters">
            <div className="filter-group">
              <label>From Date</label>
              <input type="date" value={dateRange.from} onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })} />
            </div>
            <div className="filter-group">
              <label>To Date</label>
              <input type="date" value={dateRange.to} onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })} />
            </div>
          </div>

          {message && <p className="success-text">{message}</p>}

          {/* Results Count */}
          <div className="results-header">
            <h3>Found {filteredProjects.length} projects</h3>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="empty-results">
              <p>No projects found matching your criteria.</p>
              <button className="primary" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="projects-grid-browse">
              {filteredProjects.map(project => (
                <div key={project.id} className="project-card-browse">
                  <h3>{project.title}</h3>
                  <div className="project-meta">
                    <span className="course-badge">{project.course}</span>
                    <span className="rating-browse">⭐ {getProjectRating(project)}</span>
                  </div>
                  <p className="project-date">📅 Created: {new Date(project.createdAt || project.creationDate).toLocaleDateString()}</p>
                  <p className="project-student">👨‍🎓 Student: {project.studentEmail}</p>
                  <p className="project-supervisor">👨‍🏫 Supervisor: {project.supervisor || "Not specified"}</p>
                  <button className="primary" onClick={() => viewProjectDetails(project)}>
                    View Details →
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Project Details View */}
      {activeTab === "details" && selectedProject && (
        <div className="project-details-browse">
          <button className="back-btn" onClick={() => setActiveTab("browse")}>
            ← Back to Search Results
          </button>
          
          <div className="details-card">
            <h2>{selectedProject.title}</h2>
            
            <div className="details-grid">
              <div className="detail-item">
                <strong>Course:</strong>
                <span>{selectedProject.course}</span>
              </div>
              <div className="detail-item">
                <strong>Student:</strong>
                <span>{selectedProject.studentEmail}</span>
              </div>
              <div className="detail-item">
                <strong>Supervisor:</strong>
                <span>{selectedProject.supervisor || "Not specified"}</span>
              </div>
              <div className="detail-item">
                <strong>Creation Date:</strong>
                <span>{new Date(selectedProject.createdAt || selectedProject.creationDate).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <strong>Programming Languages:</strong>
                <span>{selectedProject.programmingLanguages}</span>
              </div>
              <div className="detail-item full-width">
                <strong>Project Report:</strong>
                <p>{selectedProject.report}</p>
              </div>
              <div className="detail-item">
                <strong>GitHub:</strong>
                <a href={selectedProject.github} target="_blank">View Repository →</a>
              </div>
              <div className="detail-item">
                <strong>Demo Video:</strong>
                <a href={selectedProject.demo} target="_blank">Watch Demo →</a>
              </div>
              <div className="detail-item full-width">
                <strong>Tasks:</strong>
                <ul>
                  {selectedProject.tasks?.map((task, idx) => (
                    <li key={idx}>{task.name} - {task.status}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrowseProjects;