import { useState } from "react";

function InstructorInvitations() {
  const [invitations, setInvitations] = useState([
    {
      id: 1,
      project: "Bachelor Project Collaboration",
      from: "Student Team Dellico",
      status: "Pending",
    },
    {
      id: 2,
      project: "Software Engineering Website",
      from: "Student Team 4",
      status: "Pending",
    },
  ]);

  function updateStatus(id, status) {
    setInvitations(
      invitations.map((inv) =>
        inv.id === id ? { ...inv, status } : inv
      )
    );
  }

  return (
    <div className="invitations-container-modern">
      <h1>Project Invitations</h1>

      {invitations.length === 0 ? (
        <div className="no-invitations">
          <p>No pending invitations</p>
        </div>
      ) : (
        <div className="invitations-list-modern">
          {invitations.map((inv) => (
            <div key={inv.id} className="invitation-card">
              <div className="invitation-badge">📩 New Invitation</div>
              <div className="invitation-content">
                <div className="invitation-row">
                  <span className="label">Project:</span>
                  <span className="value">{inv.project}</span>
                </div>
                <div className="invitation-row">
                  <span className="label">From:</span>
                  <span className="value">{inv.from}</span>
                </div>
                <div className="invitation-row">
                  <span className="label">Status:</span>
                  <span className="status-pending">{inv.status}</span>
                </div>
              </div>
              <div className="invitation-actions">
                <button 
                  className="accept-btn" 
                  onClick={() => updateStatus(inv.id, "Accepted")}
                >
                  ✓ Accept
                </button>
                <button 
                  className="reject-btn" 
                  onClick={() => updateStatus(inv.id, "Rejected")}
                >
                  ✗ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InstructorInvitations;