import { useState, useEffect } from "react";

function Internships() {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [message, setMessage] = useState("");
  const [myApplications, setMyApplications] = useState([]);
  
  // Filters
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
        i.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
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
    
    // Notify employer
    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.push({
      id: Date.now(),
      to: selectedInternship.companyEmail,
      message: `New application received for "${selectedInternship.title}" from ${currentUser}`,
      read: false,
      createdAt: new Date().toISOString(),
      type: "internship_application"
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));
    
    setMessage("Application submitted successfully!");
    setCoverLetter("");
    setSelectedInternship(null);
    loadMyApplications();
    setTimeout(() => setMessage(""), 3000);
  }

  function getDurationOptions() {
    const durations = [...new Set(internships.map(i => i.duration).filter(d => d))];
    return durations;
  }

  function getCompanyOptions() {
    const companies = [...new Set(internships.map(i => i.companyEmail))];
    return companies;
  }

  const hasApplied = (internshipId) => {
    return myApplications.some(a => a.internshipId === internshipId);
  };

  const getApplicationStatus = (internshipId) => {
    const app = myApplications.find(a => a.internshipId === internshipId);
    return app?.status;
  };

  return (
    <div className="internships-container">
      <h1>Internship Opportunities</h1>
      
      {/* Search and Filters */}
      <div className="filter-section">
        <input
          type="text"
          placeholder="Search by internship title or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <div className="filter-row">
          <select value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)}>
            <option value="">All Companies</option>
            {getCompanyOptions().map(company => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>
          
          <select value={filterDuration} onChange={(e) => setFilterDuration(e.target.value)}>
            <option value="">All Durations</option>
            {getDurationOptions().map(duration => (
              <option key={duration} value={duration}>{duration}</option>
            ))}
          </select>
          
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-count">
        Found {filteredInternships.length} internships
      </div>

      {/* Internships List */}
      <div className="internships-grid">
        {filteredInternships.map(internship => (
          <div key={internship.id} className="internship-card-student">
            <h3>{internship.title}</h3>
            <p className="company">{internship.companyEmail}</p>
            <div className="internship-details">
              <span>📅 {internship.duration || "Not specified"}</span>
              <span>⏰ Deadline: {new Date(internship.deadline).toLocaleDateString()}</span>
            </div>
            <p className="skills">💻 {internship.skills || "No skills specified"}</p>
            <p className="description">{internship.details?.substring(0, 100)}...</p>
            
            {hasApplied(internship.id) ? (
              <div className="applied-status">
                <span className={`status-${getApplicationStatus(internship.id)}`}>
                  {getApplicationStatus(internship.id) === "pending" && "⏳ Application Pending"}
                  {getApplicationStatus(internship.id) === "nominated" && "⭐ Nominated"}
                  {getApplicationStatus(internship.id) === "accepted" && "✅ Accepted"}
                  {getApplicationStatus(internship.id) === "rejected" && "❌ Not Selected"}
                </span>
              </div>
            ) : (
              <button className="primary" onClick={() => setSelectedInternship(internship)}>
                Apply Now
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Application Modal */}
      {selectedInternship && (
        <div className="modal-overlay" onClick={() => setSelectedInternship(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Apply for {selectedInternship.title}</h2>
            <p><strong>Company:</strong> {selectedInternship.companyEmail}</p>
            <p><strong>Duration:</strong> {selectedInternship.duration}</p>
            <p><strong>Skills Required:</strong> {selectedInternship.skills}</p>
            <p><strong>Responsibilities:</strong></p>
            <p>{selectedInternship.details}</p>
            
            <label>Cover Letter</label>
            <textarea
              placeholder="Write a short cover letter explaining why you fit this role..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows="6"
            />
            
            {message && <p className="error-text">{message}</p>}
            
            <div className="button-row">
              <button className="primary" onClick={applyForInternship}>Submit Application</button>
              <button className="secondary-btn" onClick={() => setSelectedInternship(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Internships;