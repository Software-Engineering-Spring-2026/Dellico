import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateProject() {
  const navigate = useNavigate();

  const [project, setProject] = useState({
    title: "",
    course: "",
    github: "",
    programmingLanguages: "",
    report: "",
    demo: "",
    thesisDrafts: [],
    finalDraft: "",
    supervisor: "",
    collaborator: "",
    role: "Viewer",
    visibility: "Private",
    creationDate: new Date().toLocaleDateString(),
    tasks: [],
  });

  const [task, setTask] = useState({
    name: "",
    details: "",
    status: "Pending",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    setProject({
      ...project,
      [e.target.name]: e.target.value,
    });
  }

  function handleTaskChange(e) {
    setTask({
      ...task,
      [e.target.name]: e.target.value,
    });
  }

  function addTask() {
    if (!task.name.trim() || !task.details.trim()) {
      setErrors({ ...errors, task: "Please enter task name and task details." });
      return;
    }

    setProject({
      ...project,
      tasks: [...project.tasks, task],
    });

    setTask({
      name: "",
      details: "",
      status: "Pending",
    });

    setErrors({ ...errors, task: "" });
  }

  function deleteTask(index) {
    const updatedTasks = project.tasks.filter((_, i) => i !== index);
    setProject({ ...project, tasks: updatedTasks });
  }

  function isValidURL(value) {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  function isValidEmail(value) {
    return value.includes("@") && value.includes(".");
  }

  function handleThesisDrafts(e) {
    const drafts = Array.from(e.target.files).map((file) => file.name);

    setProject({
      ...project,
      thesisDrafts: drafts,
      finalDraft: "",
    });
  }

 function handleSubmit() {
  const newErrors = {};

  if (!project.title.trim()) newErrors.title = "Please enter project title.";
  if (!project.course) newErrors.course = "Please select a course.";
  if (!project.github || !isValidURL(project.github)) {
    newErrors.github = "Please write GitHub link in correct URL format.";
  }
  if (!project.programmingLanguages.trim()) {
    newErrors.programmingLanguages = "Please enter the programming languages used.";
  }
  if (!project.report.trim()) newErrors.report = "Please write the project report.";
  if (!project.demo || !isValidURL(project.demo)) {
    newErrors.demo = "Please write short demo video link in correct URL format.";
  }
  if (project.tasks.length === 0) {
    newErrors.task = "Please add at least one project task.";
  }
  if (project.course === "Bachelor Project" && project.thesisDrafts.length === 0) {
    newErrors.thesisDrafts = "Please upload at least one thesis draft for Bachelor Project.";
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
    // Get existing projects
    const allProjects = JSON.parse(localStorage.getItem("allProjects")) || [];
    
    // Create new project with unique ID
    const newProject = {
      ...project,
      id: Date.now(),
      studentEmail: localStorage.getItem("currentUserEmail"),
      createdAt: new Date().toISOString(),
      visibility: project.visibility || "Private"
    };
    
    // Add to existing projects
    allProjects.push(newProject);
    localStorage.setItem("allProjects", JSON.stringify(allProjects));
    
    // Also store as current project for details view
    localStorage.setItem("createdProject", JSON.stringify(newProject));
    
    setSuccess(true);
    
    // Reset form
    setProject({
      title: "",
      course: "",
      github: "",
      programmingLanguages: "",
      report: "",
      demo: "",
      thesisDrafts: [],
      finalDraft: "",
      supervisor: "",
      collaborator: "",
      role: "Viewer",
      visibility: "Private",
      creationDate: new Date().toLocaleDateString(),
      tasks: [],
    });
    setTask({
      name: "",
      details: "",
      status: "Pending",
    });
    setErrors({});
    
    setTimeout(() => {
      navigate("/student-profile");
    }, 1500);
  }
}

  return (
    <div className="project-form-card">
      <h2>Create Project</h2>

      <label>Project Title</label>
      <input name="title" value={project.title} onChange={handleChange} />
      {errors.title && <p className="error-text">{errors.title}</p>}

      <label>Course</label>
      <select name="course" value={project.course} onChange={handleChange}>
        <option value="">Select course</option>
        <option>Software Engineering</option>
        <option>Database Systems</option>
        <option>Web Development</option>
        <option>Human Computer Interaction</option>
        <option>Bachelor Project</option>
      </select>
      {errors.course && <p className="error-text">{errors.course}</p>}

      <label>GitHub Link</label>
      <input
        name="github"
        value={project.github}
        onChange={handleChange}
        placeholder="https://github.com/username/project"
      />
      {errors.github && <p className="error-text">{errors.github}</p>}

      <label>Programming Languages Used</label>
      <input
        name="programmingLanguages"
        value={project.programmingLanguages}
        onChange={handleChange}
        placeholder="Example: JavaScript, React, CSS"
      />
      {errors.programmingLanguages && <p className="error-text">{errors.programmingLanguages}</p>}

      <label>Project Report</label>
      <textarea
        name="report"
        value={project.report}
        onChange={handleChange}
        placeholder="Write the project report here. This is not uploaded as a file."
      />
      {errors.report && <p className="error-text">{errors.report}</p>}

      <label>Short Demo Video Link</label>
      <input
        name="demo"
        value={project.demo}
        onChange={handleChange}
        placeholder="https://youtube.com/..."
      />
      {errors.demo && <p className="error-text">{errors.demo}</p>}

      {project.course === "Bachelor Project" && (
        <>
          <label>Upload Thesis Drafts</label>
          <input type="file" multiple onChange={handleThesisDrafts} />
          {errors.thesisDrafts && <p className="error-text">{errors.thesisDrafts}</p>}

          {project.thesisDrafts.length > 0 && (
            <>
              <label>Select Final Draft</label>
              <select name="finalDraft" value={project.finalDraft} onChange={handleChange}>
                <option value="">Select final draft</option>
                {project.thesisDrafts.map((draft) => (
                  <option key={draft} value={draft}>
                    {draft}
                  </option>
                ))}
              </select>
              {errors.finalDraft && <p className="error-text">{errors.finalDraft}</p>}

              <p className="success-text">
                Once a final draft is selected, all other thesis drafts become private.
                Only the final draft is public.
              </p>
            </>
          )}
        </>
      )}

      <section className="profile-section">
        <h3>Project Tasks</h3>
        <p>Enter the task list and task details for this project.</p>

        <label>Task Name</label>
        <input
          name="name"
          value={task.name}
          onChange={handleTaskChange}
          placeholder="Example: Design login page"
        />

        <label>Task Details</label>
        <textarea
          name="details"
          value={task.details}
          onChange={handleTaskChange}
          placeholder="Write task details entered by the project creator"
        />

        <button className="secondary-btn" type="button" onClick={addTask}>
          Add Task
        </button>

        {errors.task && <p className="error-text">{errors.task}</p>}

        {project.tasks.length > 0 && (
          <div>
            <h4>Added Tasks</h4>
            {project.tasks.map((t, index) => (
              <div className="list-card" key={index}>
                <p><strong>Task:</strong> {t.name}</p>
                <p><strong>Details:</strong> {t.details}</p>
                <button className="secondary-btn" type="button" onClick={() => deleteTask(index)}>
                  Delete Task
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <label>Supervisor</label>
      <select name="supervisor" value={project.supervisor} onChange={handleChange}>
        <option value="">Select Supervisor</option>
        <option>Dr. Smith</option>
        <option>Dr. Ahmed</option>
      </select>
      {errors.supervisor && <p className="error-text">{errors.supervisor}</p>}

      <label>Collaborator Email</label>
      <input
        name="collaborator"
        value={project.collaborator}
        onChange={handleChange}
        placeholder="collaborator@example.com"
      />
      {errors.collaborator && <p className="error-text">{errors.collaborator}</p>}

      <label>Collaborator Role</label>
      <select name="role" value={project.role} onChange={handleChange}>
        <option>Viewer</option>
        <option>Editor</option>
        <option>Co-owner</option>
      </select>

      <label>Visibility</label>
      <select name="visibility" value={project.visibility} onChange={handleChange}>
        <option>Private</option>
        <option>Public</option>
        <option>Submit for Review</option>
      </select>

      <p><strong>Creation Date:</strong> {project.creationDate}</p>

      <button className="primary" type="button" onClick={handleSubmit}>
        Create Project
      </button>

      {success && <p className="success-text">Project created! Opening project details...</p>}
    </div>
  );
}

export default CreateProject;