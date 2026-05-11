import React, { useState, useEffect } from "react";

function StudentProfile() {
  const savedPortfolio = JSON.parse(localStorage.getItem("studentPortfolio"));

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
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState(() => {
    const saved = localStorage.getItem("visibleProjects");
    return saved ? JSON.parse(saved) : [];
  });

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
  }

  // Load projects from localStorage
  useEffect(() => {
    const allProjects = JSON.parse(localStorage.getItem("allProjects")) || [];
    const currentUserEmail = localStorage.getItem("currentUserEmail");
    const myProjects = allProjects.filter(p => p.studentEmail === currentUserEmail);
    setProjects(myProjects);
  }, []);

  function toggleProjectVisibility(projectId) {
    let updated;
    if (selectedProjects.includes(projectId)) {
      updated = selectedProjects.filter(id => id !== projectId);
    } else {
      updated = [...selectedProjects, projectId];
    }
    setSelectedProjects(updated);
    localStorage.setItem("visibleProjects", JSON.stringify(updated));
    setMessage("Project visibility updated!");
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <div className="project-form-card">
      <h2>Student Portfolio</h2>

      <p>
        Add, view, update, and remove portfolio information.
        LinkedIn link acts as the CV.
      </p>

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
        <button
          className="primary"
          type="button"
          onClick={addOrUpdatePortfolio}
        >
          Add / Update
        </button>

        <button
          className="secondary-btn"
          type="button"
          onClick={viewSavedPortfolio}
        >
          View
        </button>

        <button
          className="secondary-btn"
          type="button"
          onClick={removePortfolio}
        >
          Remove
        </button>
      </div>

      {message && (
        <p className="success-text">
          {message}
        </p>
      )}

      {viewPortfolio && (
        <section className="profile-section">
          <h3>Saved Portfolio Information</h3>
          <p><strong>Major:</strong> {portfolio.major}</p>
          <p><strong>Skills:</strong> {portfolio.skills}</p>
          <p><strong>LinkedIn / CV:</strong> {portfolio.linkedin}</p>
          <p><strong>Profile Picture:</strong> {portfolio.pictureName || "No picture uploaded"}</p>
        </section>
      )}

      {/* Projects Section - Req 21, 22 */}
      {projects.length > 0 && (
        <section className="profile-section">
          <h3>My Projects ({projects.length})</h3>
          <p>Select which projects to show on your portfolio:</p>
          {projects.map(project => (
            <div key={project.id} className="list-card">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectedProjects.includes(project.id)}
                  onChange={() => toggleProjectVisibility(project.id)}
                />
                <strong>{project.title}</strong> - {project.course}
              </label>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default StudentProfile;