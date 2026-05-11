import { useState } from "react";

function InstructorFeedback() {
    const createdProject = JSON.parse(localStorage.getItem("createdProject"));
  const saved = JSON.parse(localStorage.getItem("instructorFeedback"));

  const [feedback, setFeedback] = useState(
    saved || {
      projectName: "",
      studentName: "",
      taskName: "",
      taskFeedback: "",
      generalFeedback: "",
      rating: "",
    }
  );

  const [message, setMessage] = useState("");

  function handleChange(e) {
    setFeedback({
      ...feedback,
      [e.target.name]: e.target.value,
    });
  }

  function saveFeedback() {
    if (
      !feedback.projectName ||
      !feedback.studentName ||
      !feedback.taskName ||
      !feedback.taskFeedback ||
      !feedback.generalFeedback ||
      !feedback.rating
    ) {
      setMessage("Please fill project, student, task feedback, general feedback, and rating.");
      return;
    }

    localStorage.setItem("instructorFeedback", JSON.stringify(feedback));
    setMessage("Feedback saved for the selected student project.");
  }

  function removeFeedback() {
    localStorage.removeItem("instructorFeedback");

    setFeedback({
      projectName: "",
      studentName: "",
      taskName: "",
      taskFeedback: "",
      generalFeedback: "",
      rating: "",
    });

    setMessage("Feedback removed successfully.");
  }

  return (
    <div className="project-form-card">
      <h2>Feedback and Rating</h2>
      <p>Add, edit, or remove feedback for a specific student project.</p>

      <label>Project</label>

<select
  name="projectName"
  value={feedback.projectName}
  onChange={handleChange}
>
  <option value="">Select project</option>

  {createdProject && (
    <option value={createdProject.title}>
      {createdProject.title} - {createdProject.course}
    </option>
  )}
</select>

      <label>Student / Team</label>

<input
  name="studentName"
  value={feedback.studentName}
  onChange={handleChange}
  placeholder="Example: Team Dellico"
/>

      <label>Task</label>
      <select name="taskName" value={feedback.taskName} onChange={handleChange}>
        <option value="">Select task</option>
        <option>Setup UI</option>
        <option>API Integration</option>
        <option>Project Report</option>
        <option>Thesis Draft</option>
      </select>

      <label>Feedback on Selected Task</label>
      <textarea
        name="taskFeedback"
        value={feedback.taskFeedback}
        onChange={handleChange}
        placeholder="Write feedback on the selected task"
      />

      <label>General Project Feedback</label>
      <textarea
        name="generalFeedback"
        value={feedback.generalFeedback}
        onChange={handleChange}
        placeholder="Write general feedback including thesis drafts"
      />

      <label>Project Rating out of 5</label>
      <select name="rating" value={feedback.rating} onChange={handleChange}>
        <option value="">Select rating</option>
        <option>1/5</option>
        <option>2/5</option>
        <option>3/5</option>
        <option>4/5</option>
        <option>5/5</option>
      </select>

      <div className="button-row">
        <button className="primary" type="button" onClick={saveFeedback}>
          Add / Edit Feedback
        </button>

        <button className="secondary-btn" type="button" onClick={removeFeedback}>
          Remove Feedback
        </button>
      </div>

      {message && <p className="success-text">{message}</p>}
    </div>
  );
}

export default InstructorFeedback;