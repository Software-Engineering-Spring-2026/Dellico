function StudentProfile() {
  return (
    <div className="page-card wide-card">
      <h2>Student Portfolio</h2>
      <p>Manage portfolio information, instructor search, statistics, and completed internships.</p>

      <section className="profile-section">
        <h3>Portfolio Information</h3>
        <input placeholder="Major" />
        <input placeholder="Skills" />
        <input placeholder="LinkedIn link acting as CV" />
        <label>Upload profile picture</label>
        <input type="file" accept="image/*" />

        <button className="primary">Add / View / Update Portfolio</button>
        <button className="secondary-btn">Remove Selected Information</button>
      </section>

      <section className="profile-section">
        <h3>Search Course Instructors</h3>
        <input placeholder="Search by instructor name or course" />
        <button className="primary">Search</button>

        <div className="list-card">
          <h4>Dr. Aya Salama</h4>
          <p><b>Linked Courses:</b> Software Engineering, Bachelor Project</p>
          <p><b>Biography:</b> Software engineering instructor.</p>
          <p><b>Research Interests:</b> Requirements engineering and architecture.</p>
          <p><b>Education:</b> PhD in Computer Science.</p>
          <button className="secondary-btn">Select and View Full Profile</button>
        </div>
      </section>

      <section className="profile-section">
        <h3>Programming Language Statistics</h3>
        <div className="mini-stats">
          <div><h4>JavaScript</h4><p>Most used language</p></div>
          <div><h4>72%</h4><p>JavaScript usage</p></div>
          <div><h4>18%</h4><p>Python usage</p></div>
          <div><h4>10%</h4><p>Java usage</p></div>
        </div>
      </section>

      <section className="profile-section">
        <h3>Completed Internships</h3>
        <div className="list-card">Frontend Intern — Dell Technologies</div>
        <div className="list-card">Data Analytics Intern — Coca-Cola HBC</div>
      </section>
    </div>
  );
}

export default StudentProfile;