import React, { useState } from "react";

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

  return (
    <div className="project-form-card">
      <h2>Student Portfolio</h2>

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
        placeholder="https://linkedin.com/in/yourname"
      />

      <label>Upload Profile Picture</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      <div className="button-row">
        <button className="primary" onClick={addOrUpdatePortfolio}>Add / Update</button>
        <button className="secondary-btn" onClick={viewSavedPortfolio}>View</button>
        <button className="secondary-btn" onClick={removePortfolio}>Remove</button>
      </div>

      {message && <p className="success-text">{message}</p>}

      {viewPortfolio && (
        <section className="profile-section">
          <h3>Saved Portfolio Information</h3>
          <p><strong>Major:</strong> {portfolio.major}</p>
          <p><strong>Skills:</strong> {portfolio.skills}</p>
          <p><strong>LinkedIn:</strong> <a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer">{portfolio.linkedin}</a></p>
          <p><strong>Profile Picture:</strong> {portfolio.pictureName || "No picture uploaded"}</p>
        </section>
      )}
    </div>
  );
}

export default StudentProfile;