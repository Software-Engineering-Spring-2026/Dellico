function EmployerProfile() {
  return (
    <div className="page-card wide-card">
      <h2>Employer Company Profile</h2>
      <p>Manage company profile, location, logo, verification documents, internships, and applicants.</p>

      <section className="profile-section">
        <h3>Company Information</h3>
        <textarea placeholder="Short company biography" />
        <input placeholder="Company address" />
        <input placeholder="Contact information" />
        <input placeholder="Google Maps location link" />
        <label>Upload company logo</label>
        <input type="file" accept="image/*" />
        <label>Upload PDF documents such as tax certificate</label>
        <input type="file" accept=".pdf" />

        <button className="primary">Add / View / Update Company Profile</button>
        <button className="secondary-btn">Set Google Maps Location</button>
        <button className="secondary-btn">Remove Selected Information</button>
      </section>

      <section className="profile-section">
        <h3>Create Internship Details</h3>
        <input placeholder="Internship title" />
        <textarea placeholder="Responsibilities" />
        <input placeholder="Required skills" />
        <input placeholder="Duration" />
        <input type="date" />
        <button className="primary">Post Internship</button>
      </section>

      <section className="profile-section">
        <h3>My Offered Internships</h3>
        <div className="list-card">
          <h4>Frontend React Intern</h4>
          <p>Status: Currently Hiring</p>
          <button className="secondary-btn">Set Currently Hiring</button>
          <button className="secondary-btn">Set Position Filled</button>
          <button className="secondary-btn">Archive</button>
          <button className="secondary-btn">Unarchive</button>
        </div>
      </section>

      <section className="profile-section">
        <h3>Student Applications</h3>
        <select>
          <option>Sort applications by top contributors</option>
          <option>Highest contributors first</option>
        </select>

        <div className="list-card">
          <h4>Lily Abdelaziz</h4>
          <p>Applied for: Frontend React Intern</p>
          <p>Top contributor score: 95%</p>
          <select>
            <option>Nominated</option>
            <option>Accepted</option>
            <option>Rejected</option>
          </select>
          <button className="primary">Save Applicant Status</button>
        </div>
      </section>

      <section className="profile-section">
        <h3>Search Course Instructors</h3>
        <input placeholder="Search by instructor name or course" />
        <button className="primary">Search</button>
        <div className="list-card">
          <h4>Dr. Mervat Abuelkheir</h4>
          <p><b>Linked Courses:</b> Software Engineering, Bachelor Project</p>
          <button className="secondary-btn">Select and View Full Profile</button>
        </div>
      </section>
    </div>
  );
}

export default EmployerProfile;