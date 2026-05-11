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
    <div className="project-form-card">
      <h2>Project Invitations</h2>
      <p>Receive, view, accept, or reject project invitations.</p>

      {invitations.map((inv) => (
        <section className="profile-section" key={inv.id}>
          <p><strong>Notification:</strong> New project invitation received.</p>
          <p><strong>Project:</strong> {inv.project}</p>
          <p><strong>From:</strong> {inv.from}</p>
          <p><strong>Status:</strong> {inv.status}</p>

          <div className="button-row">
            <button
              className="primary"
              type="button"
              onClick={() => updateStatus(inv.id, "Accepted")}
            >
              Accept
            </button>

            <button
              className="secondary-btn"
              type="button"
              onClick={() => updateStatus(inv.id, "Rejected")}
            >
              Reject
            </button>
          </div>
        </section>
      ))}
    </div>
  );
}

export default InstructorInvitations;