import { useState, useEffect } from "react";

function ProjectDetails() {
  const [project, setProject] = useState(null);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [appealMessage, setAppealMessage] = useState("");
  const [message, setMessage] = useState("");
  
  const role = localStorage.getItem("role");
  const currentUser = localStorage.getItem("currentUserEmail");

  useEffect(() => {
    // Load selected project from localStorage
    const selected = JSON.parse(localStorage.getItem("selectedProject"));
    if (selected) {
      setProject(selected);
    } else {
      // Fallback to created project
      const created = JSON.parse(localStorage.getItem("createdProject"));
      setProject(created);
    }
  }, []);

  // Check if this project is flagged
  const flaggedProjects = JSON.parse(localStorage.getItem("flaggedProjects")) || [];
  const isFlagged = flaggedProjects.some(p => p.id === project?.id);
  const flagData = flaggedProjects.find(p => p.id === project?.id);

  // Check if student has already appealed
  const appeals = JSON.parse(localStorage.getItem("appeals")) || [];
  const hasAppealed = appeals.some(a => a.projectId === project?.id);

  if (!project) {
    return (
      <div className="project-form-card">
        <h2>Project Details</h2>
        <p>No project selected. Go to "My Projects" to view a project.</p>
        <button className="primary" onClick={() => window.location.href = "/my-projects"}>
          View My Projects
        </button>
      </div>
    );
  }

  function handleFlagProject() {
    if (!flagReason.trim()) {
      setMessage("Please provide a reason for flagging");
      return;
    }

    const flaggedProjects = JSON.parse(localStorage.getItem("flaggedProjects")) || [];
    
    const newFlag = {
      id: project.id,
      title: project.title,
      studentEmail: project.studentEmail,
      reason: flagReason,
      flaggedBy: currentUser,
      flaggedAt: new Date().toISOString(),
      isActive: true
    };
    
    flaggedProjects.push(newFlag);
    localStorage.setItem("flaggedProjects", JSON.stringify(flaggedProjects));
    
    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.push({
      id: Date.now(),
      to: project.studentEmail,
      message: `Your project "${project.title}" has been flagged for: ${flagReason}`,
      read: false,
      createdAt: new Date().toISOString(),
      type: "flag"
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));
    
    setMessage("Project flagged successfully. Admin will review.");
    setShowFlagModal(false);
    setFlagReason("");
    
    setTimeout(() => setMessage(""), 3000);
  }

  function handleSendAppeal() {
    if (!appealMessage.trim()) {
      setMessage("Please write an appeal message explaining your point of view");
      return;
    }

    const appeals = JSON.parse(localStorage.getItem("appeals")) || [];
    
    const newAppeal = {
      id: Date.now(),
      projectId: project.id,
      projectTitle: project.title,
      studentEmail: currentUser,
      message: appealMessage,
      submittedAt: new Date().toISOString(),
      status: "pending"
    };
    
    appeals.push(newAppeal);
    localStorage.setItem("appeals", JSON.stringify(appeals));
    
    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.push({
      id: Date.now(),
      to: "admin@guc.edu.eg",
      message: `New appeal submitted for project "${project.title}" by ${currentUser}`,
      read: false,
      createdAt: new Date().toISOString(),
      type: "appeal"
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));
    
    setMessage("Appeal sent successfully. Admin will review.");
    setShowAppealModal(false);
    setAppealMessage("");
    
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <div className="project-form-card">
      <h2>{project.title}</h2>
      
      {isFlagged && (
        <div className="alert-box warning">
          <strong>⚠️ Project Flagged:</strong> {flagData?.reason}
          {role === "student" && currentUser === project.studentEmail && !hasAppealed && (
            <button className="secondary-btn" onClick={() => setShowAppealModal(true)} style={{ marginTop: "10px" }}>
              📝 Submit Appeal
            </button>
          )}
          {role === "student" && currentUser === project.studentEmail && hasAppealed && (
            <p className="success-text">✅ Appeal submitted. Admin will review.</p>
          )}
        </div>
      )}
      
      <p><strong>Course:</strong> {project.course}</p>
      <p><strong>GitHub Link:</strong> <a href={project.github} target="_blank" rel="noopener noreferrer">{project.github}</a></p>
      <p><strong>Programming Languages:</strong> {project.programmingLanguages}</p>
      <p><strong>Project Report:</strong> {project.report}</p>
      <p><strong>Demo Video:</strong> <a href={project.demo} target="_blank" rel="noopener noreferrer">{project.demo}</a></p>
      <p><strong>Visibility:</strong> 
        <span className={`visibility-badge ${project.visibility === "Public" ? "public" : "private"}`}>
          {project.visibility === "Public" ? "🌍 Public" : "🔒 Private"}
        </span>
      </p>
      <p><strong>Creation Date:</strong> {project.creationDate}</p>
      
      {project.course === "Bachelor Project" && (
        <>
          <p><strong>Thesis Drafts:</strong> {project.thesisDrafts?.join(", ")}</p>
          <p><strong>Final Draft:</strong> {project.finalDraft || "Not selected"}</p>
        </>
      )}
      
      <p><strong>Supervisor:</strong> {project.supervisor}</p>
      <p><strong>Collaborator Email:</strong> {project.collaborator}</p>
      <p><strong>Collaborator Role:</strong> {project.role}</p>
      
      {role !== "student" || currentUser !== project.studentEmail ? (
        <button 
          className="danger-btn" 
          onClick={() => setShowFlagModal(true)}
          disabled={isFlagged}
          style={{ marginTop: "20px" }}
        >
          🚩 Flag as Inappropriate
        </button>
      ) : (
        <p className="info-text">📝 As the project owner, you cannot flag your own project</p>
      )}
      
      {project.tasks?.length > 0 && (
        <>
          <h3>Tasks</h3>
          {project.tasks.map((task, idx) => (
            <div key={idx} className="list-card">
              <p><strong>{task.name}</strong> - {task.status}</p>
              <p>{task.details}</p>
            </div>
          ))}
        </>
      )}

      <button className="secondary-btn" onClick={() => window.location.href = "/my-projects"} style={{ marginTop: "20px" }}>
        ← Back to My Projects
      </button>

      {/* Flag Modal */}
      {showFlagModal && (
        <div className="modal-overlay" onClick={() => setShowFlagModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>🚩 Flag Project: {project.title}</h3>
            <textarea
              placeholder="Reason for flagging..."
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              rows="4"
              style={{ width: "100%", margin: "10px 0", padding: "10px" }}
            />
            <div className="button-row">
              <button className="primary danger-btn" onClick={handleFlagProject}>Submit Flag</button>
              <button className="secondary-btn" onClick={() => setShowFlagModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Appeal Modal */}
      {showAppealModal && (
        <div className="modal-overlay" onClick={() => setShowAppealModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>📝 Submit Appeal</h3>
            <textarea
              placeholder="Explain why your project should be unflagged..."
              value={appealMessage}
              onChange={(e) => setAppealMessage(e.target.value)}
              rows="5"
              style={{ width: "100%", margin: "10px 0", padding: "10px" }}
            />
            <div className="button-row">
              <button className="primary" onClick={handleSendAppeal}>Send Appeal</button>
              <button className="secondary-btn" onClick={() => setShowAppealModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {message && <p className="success-text">{message}</p>}
    </div>
  );
}

export default ProjectDetails;