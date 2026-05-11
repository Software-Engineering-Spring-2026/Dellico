function StudentInstructorFeedback() {
  const savedFeedback = JSON.parse(localStorage.getItem("instructorFeedback"));

  return (
    <div className="project-form-card">
      <h2>Instructor Feedback</h2>
      <p>View instructor feedback and rating for your project.</p>

      {savedFeedback ? (
        <section className="profile-section">
          <p><strong>Project:</strong> {savedFeedback.projectName}</p>
          <p><strong>Student / Team:</strong> {savedFeedback.studentName}</p>
          <p><strong>Task:</strong> {savedFeedback.taskName}</p>
          <p><strong>Task Feedback:</strong> {savedFeedback.taskFeedback}</p>
          <p><strong>General Project Feedback:</strong> {savedFeedback.generalFeedback}</p>
          <p><strong>Rating:</strong> {savedFeedback.rating}</p>
        </section>
      ) : (
        <p>No instructor feedback yet.</p>
      )}
    </div>
  );
}

export default StudentInstructorFeedback;