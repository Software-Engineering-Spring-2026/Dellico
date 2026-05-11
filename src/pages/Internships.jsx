import { useState, useEffect } from "react";

function Internships() {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [message, setMessage] = useState("");
  const [myApplications, setMyApplications] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterDuration, setFilterDuration] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  
  const currentUser = localStorage.getItem("currentUserEmail");

  useEffect(() => {
    loadInternships();
    loadMyApplications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterCompany, filterDuration, sortBy, internships]);

  function loadInternships() {
    const allInternships = JSON.parse(localStorage.getItem("internships")) || [];
    const activeInternships = allInternships.filter(i => i.status === "hiring" && !i.archived);
    setInternships(activeInternships);
  }

  function loadMyApplications() {
    const applications = JSON.parse(localStorage.getItem("internshipApplications")) || {};
    const myApps = applications[currentUser] || [];
    setMyApplications(myApps);
  }

  function applyFilters() {
    let results = [...internships];

    if (searchTerm) {
      results = results.filter(i => 
        i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.companyEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCompany) {
      results = results.filter(i => i.companyEmail === filterCompany);
    }

    if (filterDuration) {
      results = results.filter(i => i.duration === filterDuration);
    }

    results.sort((a, b) => {
      switch(sortBy) {
        case "date_desc":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "date_asc":
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });

    setFilteredInternships(results);
  }

  function applyForInternship() {
    if (!coverLetter.trim()) {
      setMessage("Please write a cover letter explaining why you fit this role");
      return;
    }

    const applications = JSON.parse(localStorage.getItem("internshipApplications")) || {};
    if (!applications[currentUser]) applications[currentUser] = [];
    
    const alreadyApplied = applications[currentUser].some(a => a.internshipId === selectedInternship.id);
    if (alreadyApplied) {
      setMessage("You have already applied for this internship");
      return;
    }

    applications[currentUser].push({
      internshipId: selectedInternship.id,
      title: selectedInternship.title,
      companyName: selectedInternship.companyEmail,
      companyEmail: selectedInternship.companyEmail,
      coverLetter: coverLetter,
      appliedAt: new Date().toISOString(),
      status: "pending"
    });
    
    localStorage.setItem("internshipApplications", JSON.stringify(applications));
    
    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.push({
      id: Date.now(),
      to: selectedInternship.companyEmail,
      message: `📝 New application received for "${selectedInternship.title}" from ${currentUser}`,
      read: false,
      createdAt: new Date().toISOString(),
      type: "internship_application"
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));
    
    setMessage("✅ Application submitted successfully!");
    setCoverLetter("");
    setSelectedInternship(null);
    loadMyApplications();
    setTimeout(() => setMessage(""), 3000);
  }

  const hasApplied = (internshipId) => {
    return myApplications.some(a => a.internshipId === internshipId);
  };

  const getApplicationStatus = (internshipId) => {
    const app = myApplications.find(a => a.internshipId === internshipId);
    return app?.status;
  };

  return (
    <div className="internships-page-modern">
      <div className="page-header">
        <h1>💼 Internship Opportunities</h1>
        <p>Find and apply for internships that match your skills</p>
      </div>

      {/* Search and Filters */}
      <div className="filters-card">
        <div className="search-bar-modern">
          <input
            type="text"
            placeholder="🔍 Search by internship title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filters-row">
          <select value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)}>
            <option value="">All Companies</option>
            {[...new Set(internships.map(i => i.companyEmail))].map(company => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>
          
          <select value={filterDuration} onChange={(e) => setFilterDuration(e.target.value)}>
            <option value="">All Durations</option>
            {[...new Set(internships.map(i => i.duration).filter(d => d))].map(duration => (
              <option key={duration} value={duration}>{duration}</option>
            ))}
          </select>
          
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date_desc">📅 Newest First</option>
            <option value="date_asc">📅 Oldest First</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-count-modern">
        Found <strong>{filteredInternships.length}</strong> internships
      </div>

      {/* Internships Grid */}
      {filteredInternships.length === 0 ? (
        <div className="empty-state-internships">
          <span>🔍</span>
          <h3>No internships found</h3>
          <p>Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="internships-grid-modern">
          {filteredInternships.map(internship => (
            <div key={internship.id} className="internship-card-modern">
              <div className="internship-card-header">
                <h3>{internship.title}</h3>
                <span className="company-badge">🏢 {internship.companyEmail}</span>
              </div>
              
              <div className="internship-meta">
                <span>📅 {internship.duration || "Not specified"}</span>
                <span>⏰ Deadline: {new Date(internship.deadline).toLocaleDateString()}</span>
              </div>
              
              <p className="skills-tag">💻 Skills: {internship.skills || "Not specified"}</p>
              <p className="description-preview">
                {internship.details?.substring(0, 100)}
                {internship.details?.length > 100 ? '...' : ''}
              </p>
              
              {hasApplied(internship.id) ? (
                <div className={`applied-status ${getApplicationStatus(internship.id)}`}>
                  {getApplicationStatus(internship.id) === "pending" && "⏳ Application Submitted"}
                  {getApplicationStatus(internship.id) === "nominated" && "⭐ Nominated"}
                  {getApplicationStatus(internship.id) === "accepted" && "✅ Accepted"}
                  {getApplicationStatus(internship.id) === "rejected" && "❌ Not Selected"}
                </div>
              ) : (
                <button className="apply-btn" onClick={() => setSelectedInternship(internship)}>
                  Apply Now →
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Application Modal */}
      {selectedInternship && (
        <div className="modal-overlay-modern" onClick={() => setSelectedInternship(null)}>
          <div className="modal-content-modern application-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Apply for {selectedInternship.title}</h2>
            <div className="job-details">
              <p><strong>Company:</strong> {selectedInternship.companyEmail}</p>
              <p><strong>Duration:</strong> {selectedInternship.duration}</p>
              <p><strong>Skills Required:</strong> {selectedInternship.skills}</p>
              <p><strong>Deadline:</strong> {new Date(selectedInternship.deadline).toLocaleDateString()}</p>
              <p><strong>Responsibilities:</strong></p>
              <p>{selectedInternship.details}</p>
            </div>
            
            <label>Cover Letter</label>
            <textarea
              placeholder="Write a short cover letter explaining why you fit this role..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows="5"
            />
            
            {message && <div className="error-message">{message}</div>}
            
            <div className="modal-buttons">
              <button className="submit-btn" onClick={applyForInternship}>Submit Application</button>
              <button className="cancel-btn" onClick={() => setSelectedInternship(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Internships;