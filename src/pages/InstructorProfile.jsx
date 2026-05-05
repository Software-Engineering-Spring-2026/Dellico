function InstructorProfile() {
  return (
    <div className="page-card wide-card">
      <h2>Course Instructor Profile</h2>
      <p>Manage instructor profile information and linked courses.</p>

      <section className="profile-section">
        <h3>Instructor Information</h3>
        <textarea placeholder="Short biography" />
        <input placeholder="Research interests" />
        <input placeholder="Education background" />
        <label>Upload profile picture</label>
        <input type="file" accept="image/*" />
        <input placeholder="Linked courses" />

        <button className="primary">Add / View / Update Profile</button>
        <button className="secondary-btn">Remove Selected Information</button>
        <button className="secondary-btn">Link Myself to Course</button>
        <button className="secondary-btn">Unlink Myself from Course</button>
      </section>

      <section className="profile-section">
        <h3>Search Course Instructors</h3>
        <input placeholder="Search by instructor name or course" />
        <button className="primary">Search</button>

        <div className="list-card">
          <h4>Eng. Nada Ibrahim</h4>
          <p><b>Linked Courses:</b> Software Engineering Lab</p>
          <p><b>Biography:</b> Teaching assistant supporting software engineering projects.</p>
          <p><b>Research Interests:</b> UI/UX, frontend development, software testing.</p>
          <p><b>Education:</b> MSc Candidate in Software Engineering.</p>
          <button className="secondary-btn">Select and View Full Profile</button>
        </div>
      </section>
    </div>
  );
}

export default InstructorProfile;