function Admin() {
  return (
    <div className="page-card wide-card">
      <h2>Administrator Dashboard</h2>
      <p>View platform statistics and search course instructor profiles.</p>

      <section className="profile-section">
        <h3>Platform Statistics</h3>
        <div className="mini-stats">
          <div><h4>35</h4><p>Total employers</p></div>
          <div><h4>420</h4><p>Total students</p></div>
          <div><h4>28</h4><p>Total course instructors</p></div>
          <div><h4>186</h4><p>Total projects</p></div>
        </div>
      </section>

      <section className="profile-section">
        <h3>Search Course Instructors</h3>
        <input placeholder="Search by instructor name or course" />
        <button className="primary">Search</button>

        <div className="list-card">
          <h4>Dr. Aya Salama</h4>
          <p><b>Linked Courses:</b> Software Engineering, Bachelor Project</p>
          <p><b>Biography:</b> Software engineering instructor.</p>
          <p><b>Education:</b> PhD in Computer Science.</p>
          <button className="secondary-btn">Select and View Full Profile</button>
        </div>
      </section>
    </div>
  );
}

export default Admin;