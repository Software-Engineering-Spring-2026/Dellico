import { useState, useEffect } from "react";

function ManageInternships() {
  const [internships, setInternships] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingInternship, setEditingInternship] = useState(null);
  const [message, setMessage] = useState("");
  const [applicants, setApplicants] = useState({});
  const [selectedInternship, setSelectedInternship] = useState(null);
  
  const currentUser = localStorage.getItem("currentUserEmail");

  const [formData, setFormData] = useState({
    title: "",
    details: "",
    responsibilities: "",
    skills: "",
    duration: "",
    deadline: "",
    programmingLanguages: "",
    status: "hiring"
  });

  useEffect(() => {
    loadInternships();
    loadApplicants();
  }, []);

  function loadInternships() {
    const allInternships = JSON.parse(localStorage.getItem("internships")) || [];
    const companyInternships = allInternships.filter(i => i.companyEmail === currentUser);
    setInternships(companyInternships);
  }

  function loadApplicants() {
    const allApplicants = JSON.parse(localStorage.getItem("internshipApplicants")) || {};
    setApplicants(allApplicants);
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  function createInternship() {
    if (!formData.title || !formData.details || !formData.deadline) {
      setMessage("Please fill in all required fields");
      return;
    }

    const allInternships = JSON.parse(localStorage.getItem("internships")) || [];
    
    const newInternship = {
      id: Date.now(),
      ...formData,
      companyEmail: currentUser,
      createdAt: new Date().toISOString(),
      status: "hiring"
    };

    if (editingInternship) {
      // Update existing
      const updated = allInternships.map(i => 
        i.id === editingInternship.id ? { ...newInternship, id: editingInternship.id } : i
      );
      localStorage.setItem("internships", JSON.stringify(updated));
      setMessage("Internship updated successfully");
    } else {
      // Create new
      allInternships.push(newInternship);
      localStorage.setItem("internships", JSON.stringify(allInternships));
      setMessage("Internship created successfully");
    }

    setFormData({
      title: "",
      details: "",
      responsibilities: "",
      skills: "",
      duration: "",
      deadline: "",
      programmingLanguages: "",
      status: "hiring"
    });
    setEditingInternship(null);
    setShowForm(false);
    loadInternships();
    setTimeout(() => setMessage(""), 3000);
  }

  function editInternship(internship) {
    setFormData(internship);
    setEditingInternship(internship);
    setShowForm(true);
  }

  function deleteInternship(id) {
    if (window.confirm("Are you sure you want to delete this internship?")) {
      const allInternships = JSON.parse(localStorage.getItem("internships")) || [];
      const updated = allInternships.filter(i => i.id !== id);
      localStorage.setItem("internships", JSON.stringify(updated));
      loadInternships();
      setMessage("Internship deleted");
      setTimeout(() => setMessage(""), 2000);
    }
  }

  function updateInternshipStatus(id, newStatus) {
    const allInternships = JSON.parse(localStorage.getItem("internships")) || [];
    const updated = allInternships.map(i => 
      i.id === id ? { ...i, status: newStatus } : i
    );
    localStorage.setItem("internships", JSON.stringify(updated));
    loadInternships();
    setMessage(`Internship marked as ${newStatus}`);
    setTimeout(() => setMessage(""), 2000);
  }

  function archiveInternship(id) {
    const allInternships = JSON.parse(localStorage.getItem("internships")) || [];
    const internship = allInternships.find(i => i.id === id);
    
    if (new Date(internship.deadline) > new Date()) {
      setMessage("Cannot archive internship before deadline passes");
      return;
    }
    
    const updated = allInternships.map(i => 
      i.id === id ? { ...i, archived: true } : i
    );
    localStorage.setItem("internships", JSON.stringify(updated));
    loadInternships();
    setMessage("Internship archived");
    setTimeout(() => setMessage(""), 2000);
  }

  function viewApplicants(internship) {
    setSelectedInternship(internship);
  }

  function updateApplicantStatus(internshipId, studentEmail, status) {
    const allApplicants = JSON.parse(localStorage.getItem("internshipApplicants")) || {};
    if (!allApplicants[internshipId]) {
      allApplicants[internshipId] = {};
    }
    allApplicants[internshipId][studentEmail] = {
      ...allApplicants[internshipId][studentEmail],
      status: status,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem("internshipApplicants", JSON.stringify(allApplicants));
    loadApplicants();
    
    // Notify student
    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.push({
      id: Date.now(),
      to: studentEmail,
      message: `Your application for internship "${internship?.title}" has been ${status}`,
      read: false,
      createdAt: new Date().toISOString(),
      type: "internship"
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));
    
    setMessage(`Applicant ${status}`);
    setTimeout(() => setMessage(""), 2000);
  }

  const getApplicantsForInternship = (internshipId) => {
    return applicants[internshipId] ? Object.entries(applicants[internshipId]) : [];
  };

  return (
    <div className="manage-internships">
      <div className="internships-header">
        <h1>Manage Internships</h1>
        <button className="primary" onClick={() => { setShowForm(!showForm); setEditingInternship(null); setFormData({ title: "", details: "", responsibilities: "", skills: "", duration: "", deadline: "", programmingLanguages: "", status: "hiring" }); }}>
          {showForm ? "Cancel" : "+ Post New Internship"}
        </button>
      </div>

      {message && <p className="success-text">{message}</p>}

      {/* Create/Edit Form */}
      {showForm && (
        <div className="internship-form">
          <h2>{editingInternship ? "Edit Internship" : "Create New Internship"}</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Internship Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Frontend Developer Intern" />
            </div>
            <div className="form-group">
              <label>Duration</label>
              <input name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g., 3 months" />
            </div>
          </div>

          <div className="form-group">
            <label>Internship Details / Responsibilities *</label>
            <textarea name="details" value={formData.details} onChange={handleChange} rows="3" placeholder="Describe the role and responsibilities..." />
          </div>

          <div className="form-group">
            <label>Required Skills</label>
            <input name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g., React, Python, SQL" />
          </div>

          <div className="form-group">
            <label>Programming Languages</label>
            <input name="programmingLanguages" value={formData.programmingLanguages} onChange={handleChange} placeholder="e.g., JavaScript, Python" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Application Deadline *</label>
              <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="hiring">Currently Hiring</option>
                <option value="filled">Position Filled</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button className="primary" onClick={createInternship}>
              {editingInternship ? "Update Internship" : "Post Internship"}
            </button>
            <button className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Internships List */}
      {internships.length === 0 && !showForm ? (
        <div className="empty-internships">
          <p>No internships posted yet.</p>
          <button className="primary" onClick={() => setShowForm(true)}>Post Your First Internship</button>
        </div>
      ) : (
        <div className="internships-list">
          {internships.map(internship => (
            <div key={internship.id} className="internship-card">
              <div className="internship-header">
                <h3>{internship.title}</h3>
                <span className={`status-badge ${internship.status === "hiring" ? "hiring" : "filled"}`}>
                  {internship.status === "hiring" ? "🟢 Hiring" : "🔴 Filled"}
                </span>
              </div>
              
              <div className="internship-details">
                <p><strong>📅 Duration:</strong> {internship.duration || "Not specified"}</p>
                <p><strong>📝 Details:</strong> {internship.details}</p>
                <p><strong>💻 Skills:</strong> {internship.skills || "Not specified"}</p>
                <p><strong>⏰ Deadline:</strong> {new Date(internship.deadline).toLocaleDateString()}</p>
                <p><strong>👥 Applicants:</strong> {getApplicantsForInternship(internship.id).length}</p>
              </div>

              <div className="internship-actions">
                <button className="secondary-btn" onClick={() => editInternship(internship)}>Edit</button>
                <button className="secondary-btn" onClick={() => viewApplicants(internship)}>View Applicants</button>
                <button className="secondary-btn" onClick={() => updateInternshipStatus(internship.id, internship.status === "hiring" ? "filled" : "hiring")}>
                  {internship.status === "hiring" ? "Mark as Filled" : "Mark as Hiring"}
                </button>
                {new Date(internship.deadline) < new Date() && !internship.archived && (
                  <button className="secondary-btn" onClick={() => archiveInternship(internship.id)}>Archive</button>
                )}
                <button className="danger-btn" onClick={() => deleteInternship(internship.id)}>Delete</button>
              </div>

              {/* Applicants Modal */}
              {selectedInternship?.id === internship.id && (
                <div className="modal-overlay" onClick={() => setSelectedInternship(null)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h3>Applicants for {internship.title}</h3>
                    {getApplicantsForInternship(internship.id).length === 0 ? (
                      <p>No applicants yet.</p>
                    ) : (
                      <table className="applicants-table">
                        <thead>
                          <tr>
                            <th>Student</th>
                            <th>Cover Letter</th>
                            <th>Applied On</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getApplicantsForInternship(internship.id).map(([email, data]) => (
                            <tr key={email}>
                              <td>{email}</td>
                              <td>{data.coverLetter?.substring(0, 50)}...</td>
                              <td>{new Date(data.appliedAt).toLocaleDateString()}</td>
                              <td>
                                <span className={`applicant-status ${data.status || "pending"}`}>
                                  {data.status || "Pending"}
                                </span>
                              </td>
                              <td>
                                <select onChange={(e) => updateApplicantStatus(internship.id, email, e.target.value)} value={data.status || "pending"}>
                                  <option value="pending">⏳ Pending</option>
                                  <option value="nominated">⭐ Nominated</option>
                                  <option value="accepted">✅ Accepted</option>
                                  <option value="rejected">❌ Rejected</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    <button className="primary" onClick={() => setSelectedInternship(null)}>Close</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageInternships;