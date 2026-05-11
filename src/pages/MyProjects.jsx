import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("currentUserEmail");

  useEffect(() => {
    loadProjects();
  }, []);

  function loadProjects() {
    const allProjects = JSON.parse(localStorage.getItem("allProjects")) || [];
    const myProjects = allProjects.filter(p => p.studentEmail === currentUser);
    setProjects(myProjects);
  }

  function viewProjectDetails(project) {
    // Store selected project for details page
    localStorage.setItem("selectedProject", JSON.stringify(project));
    navigate("/project-details");
  }

  function editProject(project) {
    localStorage.setItem("editingProject", JSON.stringify(project));
    navigate("/create-project");
  }

  function deleteProject(projectId) {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const allProjects = JSON.parse(localStorage.getItem("allProjects")) || [];
      const updatedProjects = allProjects.filter(p => p.id !== projectId);
      localStorage.setItem("allProjects", JSON.stringify(updatedProjects));
      loadProjects();
    }
  }

  function toggleVisibility(project) {
    const allProjects = JSON.parse(localStorage.getItem("allProjects")) || [];
    const newVisibility = project.visibility === "Public" ? "Private" : "Public";
    const updatedProjects = allProjects.map(p => 
      p.id === project.id ? { ...p, visibility: newVisibility } : p
    );
    localStorage.setItem("allProjects", JSON.stringify(updatedProjects));
    
    // Also update visible projects list
    const visibleProjects = JSON.parse(localStorage.getItem(`visibleProjects_${currentUser}`)) || [];
    if (newVisibility === "Public") {
      if (!visibleProjects.includes(project.id)) {
        visibleProjects.push(project.id);
        localStorage.setItem(`visibleProjects_${currentUser}`, JSON.stringify(visibleProjects));
      }
    } else {
      const updatedVisible = visibleProjects.filter(id => id !== project.id);
      localStorage.setItem(`visibleProjects_${currentUser}`, JSON.stringify(updatedVisible));
    }
    
    loadProjects();
  }

  return (
    <div className="my-projects-container">
      <h2>My Projects</h2>
      <p>View, edit, and manage all your projects</p>

      <button className="primary" onClick={() => navigate("/create-project")}>
        + Create New Project
      </button>

      {projects.length === 0 ? (
        <div className="empty-state">
          <p>You haven't created any projects yet.</p>
          <p>Click "Create New Project" to get started.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project.id} className="project-card">
              <h3>{project.title}</h3>
              <p><strong>Course:</strong> {project.course}</p>
              <p><strong>Created:</strong> {project.creationDate || new Date(project.createdAt).toLocaleDateString()}</p>
              <p><strong>Visibility:</strong> 
                <span className={`visibility-badge ${project.visibility === "Public" ? "public" : "private"}`}>
                  {project.visibility === "Public" ? "🌍 Public" : "🔒 Private"}
                </span>
              </p>
              
              <div className="project-actions">
                <button className="secondary-btn" onClick={() => viewProjectDetails(project)}>
                  View Details
                </button>
                <button className="secondary-btn" onClick={() => editProject(project)}>
                  Edit
                </button>
                <button className="secondary-btn" onClick={() => toggleVisibility(project)}>
                  {project.visibility === "Public" ? "Make Private" : "Make Public"}
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