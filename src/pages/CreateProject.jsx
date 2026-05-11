import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateProject() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("currentUserEmail");

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
    visibility: "Private",
    creationDate: new Date().toLocaleDateString(),
    tasks: [],
    collaborators: [],
  });

  const [task, setTask] = useState({
    name: "",
    description: "",
    assignedTo: "",
    status: "pending",
    deadline: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);

  const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
  const potentialCollaborators = registeredUsers.filter(u => 
    u.role === "student" || u.role === "instructor"
  );

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

  function isValidURL(value) {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  function addOrUpdateTask() {
    const newErrors = {};
    
    if (!task.name.trim()) newErrors.taskName = "Please enter task name";
    if (!task.description.trim()) newErrors.taskDesc = "Please enter task description";
    if (!task.assignedTo) newErrors.assignedTo = "Please select a collaborator";
    if (!task.deadline) newErrors.deadline = "Please select a deadline date";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingTaskIndex !== null) {
      // Edit existing task
      const updatedTasks = [...project.tasks];
      updatedTasks[editingTaskIndex] = { ...task, id: Date.now() };
      setProject({ ...project, tasks: updatedTasks });
      setEditingTaskIndex(null);
      setErrors({});
    } else {
      // Add new task
      const newTask = {
        ...task,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      setProject({
        ...project,
        tasks: [...project.tasks, newTask],
      });
    }
    
    // Reset task form
    setTask({
      name: "",
      description: "",
      assignedTo: "",
      status: "pending",
      deadline: "",
    });
    
    setErrors({});
  }

  function editTask(index) {
    setTask(project.tasks[index]);
    setEditingTaskIndex(index);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteTask(index) {
    const updatedTasks = project.tasks.filter((_, i) => i !== index);
    setProject({ ...project, tasks: updatedTasks });
    if (editingTaskIndex === index) {
      setEditingTaskIndex(null);
      setTask({
        name: "",
        description: "",
        assignedTo: "",
        status: "pending",
        deadline: "",
      });
    }
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

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const allProjects = JSON.parse(localStorage.getItem("allProjects")) || [];
      
      const newProject = {
        ...project,
        id: Date.now(),
        studentEmail: currentUser,
        createdAt: new Date().toISOString(),
        visibility: project.visibility || "Private"
      };
      
      allProjects.push(newProject);
      localStorage.setItem("allProjects", JSON.stringify(allProjects));
      localStorage.setItem("createdProject", JSON.stringify(newProject));
      
      // Send notifications to assigned collaborators
      const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
      const uniqueAssignees = [...new Set(project.tasks.map(t => t.assignedTo))];
      
      uniqueAssignees.forEach(assigneeEmail => {
        if (assigneeEmail !== currentUser) {
          notifications.push({
            id: Date.now(),
            to: assigneeEmail,
            message: `You have been assigned tasks in project "${project.title}"`,
            read: false,
            createdAt: new Date().toISOString(),
            type: "task_assignment",
            projectId: newProject.id,
          });
        }
      });
      localStorage.setItem("notifications", JSON.stringify(notifications));
      
      setSuccess(true);
      
      setTimeout(() => {
        navigate("/my-projects");
      }, 1500);
    }
  }

  return (
    <div className="project-form-card">
      <h2>{editingTaskIndex !== null ? "Edit Task" : "Create New Project"}</h2>

      {!editingTaskIndex && (
        <>
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
          <input name="github" value={project.github} onChange={handleChange} placeholder="https://github.com/username/project" />
          {errors.github && <p className="error-text">{errors.github}</p>}

          <label>Programming Languages Used</label>
          <input name="programmingLanguages" value={project.programmingLanguages} onChange={handleChange} />
          {errors.programmingLanguages && <p className="error-text">{errors.programmingLanguages}</p>}

          <label>Project Report</label>
          <textarea name="report" value={project.report} onChange={handleChange} placeholder="Write the project report here" />
          {errors.report && <p className="error-text">{errors.report}</p>}

          <label>Demo Video Link</label>
          <input name="demo" value={project.demo} onChange={handleChange} placeholder="https://youtube.com/..." />
          {errors.demo && <p className="error-text">{errors.demo}</p>}

          {project.course === "Bachelor Project" && (
            <>
              <label>Upload Thesis Drafts</label>
              <input type="file" multiple onChange={handleThesisDrafts} />
              {project.thesisDrafts.length > 0 && (
                <>
                  <label>Select Final Draft</label>
                  <select name="finalDraft" value={project.finalDraft} onChange={handleChange}>
                    <option value="">Select final draft</option>
                    {project.thesisDrafts.map((draft) => (
                      <option key={draft} value={draft}>{draft}</option>
                    ))}
                  </select>
                </>
              )}
            </>
          )}

          <label>Supervisor</label>
          <select name="supervisor" value={project.supervisor} onChange={handleChange}>
            <option value="">Select Supervisor</option>
            <option>Dr. Smith</option>
            <option>Dr. Ahmed</option>
          </select>

          <label>Visibility</label>
          <select name="visibility" value={project.visibility} onChange={handleChange}>
            <option>Private</option>
            <option>Public</option>
          </select>
        </>
      )}

      {/* Task Management Section */}
      <section className="task-management-section">
        <h3>{editingTaskIndex !== null ? "Edit Task" : "Add Task to Project"}</h3>
        
        <label>Task Name</label>
        <input name="name" value={task.name} onChange={handleTaskChange} placeholder="e.g., Design Login Page" />
        {errors.taskName && <p className="error-text">{errors.taskName}</p>}

        <label>Task Description</label>
        <textarea name="description" value={task.description} onChange={handleTaskChange} placeholder="Brief description of the task" rows="2" />
        {errors.taskDesc && <p className="error-text">{errors.taskDesc}</p>}

        <label>Assign to Collaborator</label>
        <select name="assignedTo" value={task.assignedTo} onChange={handleTaskChange}>
          <option value="">Select collaborator</option>
          <option value={currentUser}>Myself</option>
          {potentialCollaborators.map(user => (
            <option key={user.email} value={user.email}>
              {user.firstName} {user.lastName} ({user.email})
            </option>
          ))}
        </select>
        {errors.assignedTo && <p className="error-text">{errors.assignedTo}</p>}

        <label>Task Status</label>
        <select name="status" value={task.status} onChange={handleTaskChange}>
          <option value="pending">⏳ Pending</option>
          <option value="in-progress">🔄 In Progress</option>
          <option value="postponed">📅 Postponed</option>
          <option value="completed">✅ Completed</option>
        </select>

        <label>Task Deadline</label>
        <input type="date" name="deadline" value={task.deadline} onChange={handleTaskChange} />
        {errors.deadline && <p className="error-text">{errors.deadline}</p>}

        <div className="button-row">
          <button type="button" className="primary" onClick={addOrUpdateTask}>
            {editingTaskIndex !== null ? "Update Task" : "Add Task"}
          </button>
          {editingTaskIndex !== null && (
            <button type="button" className="secondary-btn" onClick={() => {
              setEditingTaskIndex(null);
              setTask({ name: "", description: "", assignedTo: "", status: "pending", deadline: "" });
            }}>
              Cancel Edit
            </button>
          )}
        </div>
      </section>

      {/* Task List */}
      {project.tasks.length > 0 && (
        <section className="task-list-section">
          <h3>Project Tasks ({project.tasks.length})</h3>
          {project.tasks.map((t, index) => (
            <div key={index} className="task-card">
              <div className="task-header">
                <h4>{t.name}</h4>
                <span className={`task-status status-${t.status}`}>
                  {t.status === "pending" && "⏳ Pending"}
                  {t.status === "in-progress" && "🔄 In Progress"}
                  {t.status === "postponed" && "📅 Postponed"}
                  {t.status === "completed" && "✅ Completed"}
                </span>
              </div>
              <p><strong>Description:</strong> {t.description}</p>
              <p><strong>Assigned to:</strong> {t.assignedTo}</p>
              <p><strong>Deadline:</strong> {t.deadline || "No deadline"}</p>
              <div className="task-actions">
                <button className="secondary-btn" onClick={() => editTask(index)}>Edit</button>
                <button className="danger-btn" onClick={() => deleteTask(index)}>Delete</button>
              </div>
            </div>
          ))}
        </section>
      )}

      {!editingTaskIndex && (
        <>
          <p><strong>Creation Date:</strong> {project.creationDate}</p>
          <button className="primary" type="button" onClick={handleSubmit}>
            Create Project
          </button>
        </>
      )}

      {success && <p className="success-text">Project created! Redirecting...</p>}
    </div>
  );
}

export default CreateProject;