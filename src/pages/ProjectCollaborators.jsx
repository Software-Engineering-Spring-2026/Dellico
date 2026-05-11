import { useState, useEffect } from "react";

function ProjectCollaborators() {
  const [project, setProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("collaborators");
  
  const currentUser = localStorage.getItem("currentUserEmail");
  const role = localStorage.getItem("role");

  useEffect(() => {
    loadProject();
    loadInvitations();
    loadCollaborators();
  }, []);

  function loadProject() {
    const savedProject = JSON.parse(localStorage.getItem("createdProject"));
    setProject(savedProject);
  }

  function loadInvitations() {
    const allInvitations = JSON.parse(localStorage.getItem("projectInvitations")) || [];
    const userInvitations = allInvitations.filter(inv => 
      (inv.inviteeEmail === currentUser || inv.inviterEmail === currentUser)
    );
    setInvitations(userInvitations);
  }

  function loadCollaborators() {
    const allCollaborators = JSON.parse(localStorage.getItem("projectCollaborators")) || [];
    const projectCollabs = allCollaborators.filter(c => c.projectId === project?.id);
    setCollaborators(projectCollabs);
  }

  // Req 25: Search for collaborators/instructors by email or name
  function searchUsers() {
    if (!searchQuery.trim()) {
      setMessage("Please enter a name or email to search");
      return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    
    const results = registeredUsers.filter(user => 
      (user.email !== currentUser) &&
      (user.role === "student" || user.role === "instructor") &&
      (user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
       user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setSearchResults(results);
    setMessage(`Found ${results.length} users`);
  }

  // Req 26: Send invitation
  function sendInvitation(invitee) {
    const existingInvitations = JSON.parse(localStorage.getItem("projectInvitations")) || [];
    
    // Check if invitation already exists
    const alreadyInvited = existingInvitations.some(inv => 
      inv.projectId === project.id && 
      inv.inviteeEmail === invitee.email &&
      inv.status === "pending"
    );

    if (alreadyInvited) {
      setMessage("Invitation already sent to this user");
      return;
    }

    // Check if already a collaborator
    const alreadyCollaborator = collaborators.some(c => c.email === invitee.email);
    if (alreadyCollaborator) {
      setMessage("User is already a collaborator on this project");
      return;
    }

    const newInvitation = {
      id: Date.now(),
      projectId: project.id,
      projectTitle: project.title,
      inviterEmail: currentUser,
      inviteeEmail: invitee.email,
      inviteeName: `${invitee.firstName || ""} ${invitee.lastName || ""}`,
      status: "pending",
      sentAt: new Date().toISOString(),
      role: "collaborator"
    };

    existingInvitations.push(newInvitation);
    localStorage.setItem("projectInvitations", JSON.stringify(existingInvitations));
    
    // Req 28: Send notification to invitee (notification system)
    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
notifications.push({
  id: Date.now(),
  to: invitee.email,
  message: `${currentUser} invited you to collaborate on project "${project.title}"`,
  read: false,
  createdAt: new Date().toISOString(),
  type: "invitation",
  invitationId: newInvitation.id
});
localStorage.setItem("notifications", JSON.stringify(notifications));
// In acceptInvitation function
notifications.push({
  id: Date.now(),
  to: invitation.inviterEmail,
  message: `${currentUser} accepted your invitation to collaborate on "${invitation.projectTitle}"`,
  read: false,
  createdAt: new Date().toISOString(),
  type: "invitation"
});

    setMessage(`Invitation sent to ${invitee.email}`);
    loadInvitations();
    setTimeout(() => setMessage(""), 3000);
  }

  // Req 26: Cancel invitation
  function cancelInvitation(invitationId) {
    const allInvitations = JSON.parse(localStorage.getItem("projectInvitations")) || [];
    const updatedInvitations = allInvitations.filter(inv => inv.id !== invitationId);
    localStorage.setItem("projectInvitations", JSON.stringify(updatedInvitations));
    
    setMessage("Invitation cancelled");
    loadInvitations();
    setTimeout(() => setMessage(""), 3000);
  }

  // Req 30: Accept invitation
  function acceptInvitation(invitation) {
    const allInvitations = JSON.parse(localStorage.getItem("projectInvitations")) || [];
    const updatedInvitations = allInvitations.map(inv => 
      inv.id === invitation.id ? { ...inv, status: "accepted" } : inv
    );
    localStorage.setItem("projectInvitations", JSON.stringify(updatedInvitations));
    
    // Add to collaborators list
    const allCollaborators = JSON.parse(localStorage.getItem("projectCollaborators")) || [];
    const newCollaborator = {
      id: Date.now(),
      projectId: invitation.projectId,
      projectTitle: invitation.projectTitle,
      email: currentUser,
      name: invitation.inviteeName,
      invitedBy: invitation.inviterEmail,
      joinedAt: new Date().toISOString(),
      status: "active"
    };
    allCollaborators.push(newCollaborator);
    localStorage.setItem("projectCollaborators", JSON.stringify(allCollaborators));
    
    // Send notification to inviter
    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.push({
      id: Date.now(),
      to: invitation.inviterEmail,
      message: `${currentUser} accepted your invitation to collaborate on "${invitation.projectTitle}"`,
      read: false,
      createdAt: new Date().toISOString(),
      type: "invitation_response"
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));
    
    setMessage("Invitation accepted!");
    loadInvitations();
    loadCollaborators();
    setTimeout(() => setMessage(""), 3000);
  }

  // Req 30: Reject invitation
  function rejectInvitation(invitation) {
    const allInvitations = JSON.parse(localStorage.getItem("projectInvitations")) || [];
    const updatedInvitations = allInvitations.map(inv => 
      inv.id === invitation.id ? { ...inv, status: "rejected" } : inv
    );
    localStorage.setItem("projectInvitations", JSON.stringify(updatedInvitations));
    
    setMessage("Invitation rejected");
    loadInvitations();
    setTimeout(() => setMessage(""), 3000);
  }

  // Req 31: Remove collaborator
  function removeCollaborator(collaborator) {
    const allCollaborators = JSON.parse(localStorage.getItem("projectCollaborators")) || [];
    const updatedCollaborators = allCollaborators.filter(c => c.id !== collaborator.id);
    localStorage.setItem("projectCollaborators", JSON.stringify(updatedCollaborators));
    
    setMessage(`Removed ${collaborator.name || collaborator.email} from project`);
    loadCollaborators();
    setTimeout(() => setMessage(""), 3000);
  }

  if (!project) {
    return (
      <div className="project-form-card">
        <h2>Project Collaborators</h2>
        <p>No project selected. Please create a project first.</p>
      </div>
    );
  }

  const pendingInvitations = invitations.filter(inv => inv.status === "pending" && inv.inviteeEmail === currentUser);
  const sentInvitations = invitations.filter(inv => inv.status === "pending" && inv.inviterEmail === currentUser);
  const acceptedInvitations = invitations.filter(inv => inv.status === "accepted");
  const rejectedInvitations = invitations.filter(inv => inv.status === "rejected");

  return (
    <div className="project-form-card">
      <h2>Project Collaborators: {project.title}</h2>
      
      <div className="collaborator-tabs">
        <button className={activeTab === "collaborators" ? "active-tab tab" : "tab"} onClick={() => setActiveTab("collaborators")}>
          👥 Collaborators ({collaborators.length})
        </button>
        <button className={activeTab === "invitations" ? "active-tab tab" : "tab"} onClick={() => setActiveTab("invitations")}>
          📩 Pending Invites ({sentInvitations.length})
        </button>
        {(role === "student" || role === "instructor") && (
          <button className={activeTab === "received" ? "active-tab tab" : "tab"} onClick={() => setActiveTab("received")}>
            📨 Received ({pendingInvitations.length})
          </button>
        )}
        <button className={activeTab === "search" ? "active-tab tab" : "tab"} onClick={() => setActiveTab("search")}>
          🔍 Find Collaborators
        </button>
      </div>

      {message && <p className="success-text">{message}</p>}

      {/* Req 27: View collaborators list */}
      {activeTab === "collaborators" && (
        <section className="profile-section">
          <h3>Project Collaborators</h3>
          {collaborators.length === 0 ? (
            <p>No collaborators yet. Invite people to join your project.</p>
          ) : (
            collaborators.map((collab, idx) => (
              <div key={idx} className="list-card">
                <p><strong>Name:</strong> {collab.name || collab.email}</p>
                <p><strong>Email:</strong> {collab.email}</p>
                <p><strong>Invited by:</strong> {collab.invitedBy}</p>
                <p><strong>Joined:</strong> {new Date(collab.joinedAt).toLocaleDateString()}</p>
                {currentUser === project.studentEmail && (
                  <button className="secondary-btn danger-btn" onClick={() => removeCollaborator(collab)}>
                    Remove Collaborator
                  </button>
                )}
              </div>
            ))
          )}
        </section>
      )}

      {/* Req 26: Sent invitations status */}
      {activeTab === "invitations" && (
        <section className="profile-section">
          <h3>Sent Invitations</h3>
          {sentInvitations.length === 0 ? (
            <p>No pending invitations sent.</p>
          ) : (
            sentInvitations.map((inv, idx) => (
              <div key={idx} className="list-card">
                <p><strong>Invited:</strong> {inv.inviteeName || inv.inviteeEmail}</p>
                <p><strong>Sent:</strong> {new Date(inv.sentAt).toLocaleString()}</p>
                <p><strong>Status:</strong> <span className="status-pending">Pending</span></p>
                <button className="secondary-btn" onClick={() => cancelInvitation(inv.id)}>
                  Cancel Invitation
                </button>
              </div>
            ))
          )}
        </section>
      )}

      {/* Req 29-30: Received invitations */}
      {activeTab === "received" && (
        <section className="profile-section">
          <h3>Project Invitations Received</h3>
          {pendingInvitations.length === 0 ? (
            <p>No pending invitations.</p>
          ) : (
            pendingInvitations.map((inv, idx) => (
              <div key={idx} className="list-card">
                <p><strong>Project:</strong> {inv.projectTitle}</p>
                <p><strong>From:</strong> {inv.inviterEmail}</p>
                <p><strong>Sent:</strong> {new Date(inv.sentAt).toLocaleString()}</p>
                <div className="button-row">
                  <button className="primary" onClick={() => acceptInvitation(inv)}>
                    Accept
                  </button>
                  <button className="secondary-btn" onClick={() => rejectInvitation(inv)}>
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Accepted/Rejected history */}
          {acceptedInvitations.length > 0 && (
            <>
              <h3>Accepted Invitations</h3>
              {acceptedInvitations.map((inv, idx) => (
                <div key={idx} className="list-card">
                  <p><strong>{inv.projectTitle}</strong> - Accepted</p>
                </div>
              ))}
            </>
          )}
        </section>
      )}

      {/* Req 25: Search for collaborators */}
      {activeTab === "search" && (
        <section className="profile-section">
          <h3>Find Collaborators or Course Instructors</h3>
          <p>Search by email or name</p>
          
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <button className="primary" onClick={searchUsers}>
            Search
          </button>

          {searchResults.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h4>Search Results</h4>
              {searchResults.map((user, idx) => (
                <div key={idx} className="list-card">
                  <p><strong>{user.firstName} {user.lastName}</strong></p>
                  <p>Email: {user.email}</p>
                  <p>Role: {user.role === "student" ? "🎓 Student" : "👨‍🏫 Course Instructor"}</p>
                  <button className="primary" onClick={() => sendInvitation(user)}>
                    Send Invitation
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default ProjectCollaborators;