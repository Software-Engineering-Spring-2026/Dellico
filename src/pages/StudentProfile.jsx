import React, { useState, useEffect } from "react";

function StudentProfile() {
  const savedPortfolio = JSON.parse(localStorage.getItem("studentPortfolio"));
  const currentUser = localStorage.getItem("currentUserEmail");

  const [portfolio, setPortfolio] = useState(
    savedPortfolio || {
      major: "",
      skills: "",
      linkedin: "",
      pictureName: "",
    }
  );

  const [viewPortfolio, setViewPortfolio] = useState(false);
  const [message, setMessage] = useState("");
  const [allProjects, setAllProjects] = useState([]);
  const [visibleProjects, setVisibleProjects] = useState([]);
  const [showProjectSelector, setShowProjectSelector] = useState(false);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
    loadVisibleProjects();
  }, []);

  function loadProjects() {
  // Get all projects from localStorage
  const projects = JSON.parse(localStorage.getItem("allProjects")) || [];
  // Filter projects belonging to current student
  const myProjects = projects.filter(p => p.studentEmail === currentUser);
  setAllProjects(myProjects);
}

  function loadVisibleProjects() {
    // Load which projects are visible on portfolio
    const savedVisible = JSON.parse(localStorage.getItem(`visibleProjects_${currentUser}`)) || [];
    setVisibleProjects(savedVisible);
  }

  function saveVisibleProjects(projectIds) {
    localStorage.setItem(`visibleProjects_${currentUser}`, JSON.stringify(projectIds));
    setVisibleProjects(projectIds);
  }

  function handleChange(e) {
    setPortfolio({
      ...portfolio,
      [e.target.name]: e.target.value,
    });
  }

  function handleFileChange(e) {
    setPortfolio({
      ...portfolio,
      pictureName: e.target.files[0]?.name || "",
    });
  }

  function validatePortfolio() {
    if (!portfolio.major.trim()) return "Please enter your major.";
    if (!portfolio.skills.trim()) return "Please enter your skills.";
    if (!portfolio.linkedin.trim()) return "Please enter your LinkedIn link.";
    if (!portfolio.linkedin.startsWith("https://")) {
      return "LinkedIn link must start with https://";
    }
    return "";
  }

  function addOrUpdatePortfolio() {
    const error = validatePortfolio();

    if (error) {
      setMessage(error);
      return;
    }

    localStorage.setItem("studentPortfolio", JSON.stringify(portfolio));
    setMessage("Portfolio information saved successfully.");
    setViewPortfolio(true);
    setTimeout(() => setMessage(""), 3000);
  }

  function removePortfolio() {
    localStorage.removeItem("studentPortfolio");

    setPortfolio({
      major: "",
      skills: "",
      linkedin: "",
      pictureName: "",
    });

    setViewPortfolio(false);
    setMessage("Portfolio information removed successfully.");
    setTimeout(() => setMessage(""), 3000);
  }

  function viewSavedPortfolio() {
    const saved = JSON.parse(localStorage.getItem("studentPortfolio"));

    if (!saved) {
      setMessage("No portfolio information saved yet.");
      setViewPortfolio(false);
      return;
    }

    setPortfolio(saved);
    setViewPortfolio(true);
    setMessage("Viewing saved portfolio information.");
    setTimeout(() => setMessage(""), 3000);
  }

  // Req 20 & 22: Set project visibility on portfolio
  function toggleProjectVisibility(projectId) {
    let updated;
    if (visibleProjects.includes(projectId)) {
      updated = visibleProjects.filter(id => id !== projectId);
      setMessage("Project removed from portfolio");
    } else {
      updated = [...visibleProjects, projectId];
      setMessage("Project added to portfolio");
    }
    saveVisibleProjects(updated);
    
    // Also update the project's individual visibility setting
    const allProjs = JSON.parse(localStorage.getItem("allProjects")) || [];
    const updatedProjects = allProjs.map(p => {
      if (p.id === projectId) {
        return { ...p, visibility: updated.includes(projectId) ? "Public" : "Private" };
      }
      return p;
    });
    localStorage.setItem("allProjects", JSON.stringify(updatedProjects));
    
    setTimeout(() => setMessage(""), 2000);
  }

  // Req 20: Update individual project visibility
  function updateProjectVisibility(projectId, newVisibility) {
    const allProjs = JSON.parse(localStorage.getItem("allProjects")) || [];
    const updatedProjects = allProjs.map(p => {
      if (p.id === projectId) {
        return { ...p, visibility: newVisibility };
      }
      return p;
    });
    localStorage.setItem("allProjects", JSON.stringify(updatedProjects));
    
    // If setting to Public, ensure it's in visible projects
    if (newVisibility === "Public") {
      if (!visibleProjects.includes(projectId)) {
        saveVisibleProjects([...visibleProjects, projectId]);
      }
    } else {
      // If setting to Private, remove from visible projects
      if (visibleProjects.includes(projectId)) {
        saveVisibleProjects(visibleProjects.filter(id => id !== projectId));
      }
    }
    
    loadProjects();
    loadVisibleProjects();
    setMessage(`Project visibility set to ${newVisibility}`);
    setTimeout(() => setMessage(""), 2000);
  }

  // Get visible project details
  function getVisibleProjects() {
    return allProjects.filter(p => visibleProjects.includes(p.id));
  }

  // Get hidden projects
  function getHiddenProjects() {
    return allProjects.filter(p => !visibleProjects.includes(p.id));
  }

  return (
    <div className="project-form-card">
      <h2>Student Portfolio</h2>

      <p>
        Add, view, update, and remove portfolio information.
        LinkedIn link acts as the CV.
      </p>

      {/* Portfolio Form */}
      <label>Major</label>
      <input
        name="major"
        value={portfolio.major}
        onChange={handleChange}
        placeholder="Example: Computer Science"
      />

      <label>Skills</label>
      <input
        name="skills"
        value={portfolio.skills}
        onChange={handleChange}
        placeholder="Example: Communication, SQL, React"
      />

      <label>LinkedIn Link / CV</label>
      <input
        name="linkedin"
        value={portfolio.linkedin}
        onChange={handleChange}
        placeholder="Example: https://linkedin.com/in/yourname"
      />

      <label>Upload Profile Picture</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      <div className="button-row">
        <button className="primary" type="button" onClick={addOrUpdatePortfolio}>
          Add / Update
        </button>
        <button className="secondary-btn" type="button" onClick={viewSavedPortfolio}>
          View
        </button>
        <button className="secondary-btn" type="button" onClick={removePortfolio}>
          Remove
        </button>
      </div>

      {message && <p className="success-text">{message}</p>}

      {/* Saved Portfolio Display */}
      {viewPortfolio && (
        <section className="profile-section">
          <h3>Saved Portfolio Information</h3>
          <p><strong>Major:</strong> {portfolio.major}</p>
          <p><strong>Skills:</strong> {portfolio.skills}</p>
          <p><strong>LinkedIn / CV:</strong> <a href={portfolio.linkedin} target="_blank">{portfolio.linkedin}</a></p>
          <p><strong>Profile Picture:</strong> {portfolio.pictureName || "No picture uploaded"}</p>
        </section>
      )}

      {/* Req 21: View all my projects */}
      {allProjects.length > 0 && (
        <section className="profile-section">
          <h3>My Projects ({allProjects.length})</h3>
          
          <div className="projects-visibility-controls">
            <button 
              className="secondary-btn" 
              onClick={() => setShowProjectSelector(!showProjectSelector)}
            >
              {showProjectSelector ? "Hide Project Selector" : "Manage Portfolio Visibility"}
            </button>
          </div>

          {/* Project Selector for Portfolio Visibility */}
          {showProjectSelector && (
            <div className="project-selector">
              <h4>Select Projects for Your Portfolio</h4>
              <p>Choose which projects will be visible to others on your portfolio:</p>
              
              {allProjects.map(project => (
                <div key={project.id} className="project-visibility-item">
                  <label className="visibility-checkbox">
                    <input
                      type="checkbox"
                      checked={visibleProjects.includes(project.id)}
                      onChange={() => toggleProjectVisibility(project.id)}
                    />
                    <strong>{project.title}</strong> - {project.course}
                  </label>
                  
                  <select
                    value={project.visibility || "Private"}
                    onChange={(e) => updateProjectVisibility(project.id, e.target.value)}
                    className="visibility-select"
                  >
                    <option value="Private">🔒 Private</option>
                    <option value="Public">🌍 Public</option>
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* Req 22: Projects visible on portfolio */}
          <h4>Projects on Your Portfolio ({getVisibleProjects().length})</h4>
          {getVisibleProjects().length === 0 ? (
            <p className="info-text">No projects are visible on your portfolio. Use the selector above to add projects.</p>
          ) : (
            getVisibleProjects().map(project => (
              <div key={project.id} className="list-card">
                <p><strong>{project.title}</strong></p>
                <p>Course: {project.course}</p>
                <p>Created: {project.creationDate || new Date(project.createdAt).toLocaleDateString()}</p>
                <span className="visibility-badge public">🌍 Public</span>
              </div>
            ))
          )}

          {/* Hidden Projects */}
          {getHiddenProjects().length > 0 && (
            <>
              <h4>Private Projects (Not on Portfolio)</h4>
              {getHiddenProjects().map(project => (
                <div key={project.id} className="list-card private">
                  <p><strong>{project.title}</strong></p>
                  <p>Course: {project.course}</p>
                  <p>Created: {project.creationDate || new Date(project.createdAt).toLocaleDateString()}</p>
                  <span className="visibility-badge private">🔒 Private</span>
                </div>
              ))}
            </>
          )}
        </section>
      )}

      {allProjects.length === 0 && (
        <section className="profile-section">
          <h3>My Projects</h3>
          <p>You haven't created any projects yet. Go to Create Project to get started.</p>
        </section>
      )}
    </div>
  );
}

export default StudentProfile;