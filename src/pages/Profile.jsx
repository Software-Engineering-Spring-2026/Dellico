import { useState } from "react";

function Profile() {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [message, setMessage] = useState("");

  const instructors = [
    {
      id: 1,
      name: "Dr. Aya Salama",
      courses: "Software Engineering, Bachelor Project",
      biography: "Software engineering instructor.",
      research: "Requirements engineering and architecture.",
      education: "PhD in Computer Science.",
    },
  ];

  function handleSearch() {
    if (!query.trim()) {
      setMessage("Please enter an instructor name or course to search.");
      setShowResults(false);
      setSelectedInstructor(null);
      return;
    }

    setMessage("");
    setShowResults(true);
    setSelectedInstructor(null);
  }

  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.name.toLowerCase().includes(query.toLowerCase()) ||
      instructor.courses.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="project-form-card">
      <h2>Course Instructor Search</h2>
      <p>Search for course instructors by name or course and view full profile details.</p>

      <label>Search by Instructor Name or Course</label>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Example: Dr. Aya or Software Engineering"
      />

      <button className="primary" type="button" onClick={handleSearch}>
        Search
      </button>

      {message && <p className="error-text">{message}</p>}

      {showResults && (
        <section className="profile-section">
          <h3>Search Results</h3>

          {filteredInstructors.length === 0 ? (
            <p>No instructors found.</p>
          ) : (
            filteredInstructors.map((instructor) => (
              <div className="list-card" key={instructor.id}>
                <h4>{instructor.name}</h4>
                <p><strong>Linked Courses:</strong> {instructor.courses}</p>

                <button
                  className="secondary-btn"
                  type="button"
                  onClick={() => setSelectedInstructor(instructor)}
                >
                  Select and View Full Profile
                </button>
              </div>
            ))
          )}
        </section>
      )}

      {selectedInstructor && (
        <section className="profile-section">
          <h3>Selected Instructor Full Profile</h3>
          <p><strong>Name:</strong> {selectedInstructor.name}</p>
          <p><strong>Linked Courses:</strong> {selectedInstructor.courses}</p>
          <p><strong>Biography:</strong> {selectedInstructor.biography}</p>
          <p><strong>Research Interests:</strong> {selectedInstructor.research}</p>
          <p><strong>Education:</strong> {selectedInstructor.education}</p>
        </section>
      )}
    </div>
  );
}

export default Profile;