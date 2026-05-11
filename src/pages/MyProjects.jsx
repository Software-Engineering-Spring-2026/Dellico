import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MyProjects() {
  const [allProjects, setAllProjects] = useState([]);
  const [visibleProjects, setVisibleProjects] = useState([]);
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("currentUserEmail");

  useEffect(() => {
    loadProjects();
    loadVisibleProjects();
  }, []);

  function loadProjects() {
    const projects = JSON.parse(localStorage.getItem("allProjects")) || [];
    const myProjects = projects.filter(p => p.studentEmail === currentUser);
    setAllProjects(myProjects);
  }

  function loadVisibleProjects() {
    const savedVisible = JSON.parse(localStorage.getItem(`visibleProjects_${currentUser}`)) || [];
    setVisibleProjects(savedVisible);
  }

  function saveVisibleProjects(projectIds) {
    localStorage.setItem(`visibleProjects_${currentUser}`, JSON.stringify(projectIds));
    setVisibleProjects(projectIds);
  }

  function toggleProjectVisibility(projectId) {
    let updated;
    if (visibleProjects.includes(projectId)) {
      updated = visibleProjects.filter(id => id !== projectId);
    } else {
      updated = [...visibleProjects, projectId];
    }
    saveVisibleProjects(updated);
    
    const allProjs = JSON.parse(localStorage.getItem("allProjects")) || [];
    const updatedProjects = allProjs.map(p => {
      if (p.id === projectId) {
        return { ...p, visibility: updated.includes(projectId) ? "Public" : "Private" };
      }
      return p;
    });
    localStorage.setItem("allProjects", JSON.stringify(updatedProjects));
    loadProjects();
  }

  function viewProjectDetails(project) {
    localStorage.setItem("selectedProject", JSON.stringify(project));
    navigate("/project-details");
  }

  function deleteProject(projectId) {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const allProjs = JSON.parse(localStorage.getItem("allProjects")) || [];
      const updatedProjects = allProjs.filter(p => p.id !== projectId);
      localStorage.setItem("allProjects", JSON.stringify(updatedProjects));
      loadProjects();
    }
  }

  return (
    <div className="my-projects-container">
      <h2>My Projects</h2>

      {allProjects.length === 0 ? (
        <div className="empty-state">
          <p>You haven't created any projects yet.</p>
        </div>
      ) : (
        <div className="projects-list">
          {allProjects.map(project => (
            <div key={project.id} className="project-card">
              <h3>{project.title}</h3>
              <p><strong>Course:</strong> {project.course}</p>
              <p><strong>Created:</strong> {project.creationDate || new Date(project.createdAt).toLocaleDateString()}</p>
              
              <div className="project-visibility-row">
                <label className="visibility-checkbox">
                  <input
                    type="checkbox"
                    checked={visibleProjects.includes(project.id)}
                    onChange={() => toggleProjectVisibility(project.id)}
                  />
                  Show on Portfolio
                </label>
                <span className={`visibility-badge ${visibleProjects.includes(project.id) ? "public" : "private"}`}>
                  {visibleProjects.includes(project.id) ? "🌍 Public" : "🔒 Private"}
                </span>
              </div>
              
              <div className="project-actions">
                <button className="secondary-btn" onClick={() => viewProjectDetails(project)}>
                  View Details
                </button>
                <button className="danger-btn" onClick={() => deleteProject(project.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyProjects;