function Profile() {
  return (
    <div className="page-card wide-card">
      <h2>Course Instructor Search</h2>
      <p>Search for course instructors by name or course and view full profile details.</p>

      <section className="profile-section">
        <input placeholder="Search by instructor name or course" />
        <button className="primary">Search</button>

        <div className="list-card">
          <h4>Dr. Aya Salama</h4>
          <p><b>Linked Courses:</b> Software Engineering, Bachelor Project</p>
          <p><b>Biography:</b> Software engineering instructor.</p>
          <p><b>Research Interests:</b> Requirements engineering, architecture.</p>
          <p><b>Education:</b> PhD in Computer Science.</p>
          <button className="secondary-btn">Select and View Full Profile</button>
        </div>
      </section>
    </div>
  );
}

export default Profile;