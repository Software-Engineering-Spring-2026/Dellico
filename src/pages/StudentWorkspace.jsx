import { useState } from "react";

function StudentWorkspace() {
  const createdProject = JSON.parse(localStorage.getItem("createdProject"));

  const [tasks, setTasks] = useState(createdProject?.tasks || []);

  function handleStatusChange(index, newStatus) {
    const updatedTasks = [...tasks];
    updatedTasks[index].status = newStatus;
    setTasks(updatedTasks);

    if (createdProject) {
      const updatedProject = {
        ...createdProject,
        tasks: updatedTasks,
      };
      localStorage.setItem("createdProject", JSON.stringify(updatedProject));
    }
  }

  function getStatusColor(status) {
    if (status === "Pending") return "orange";
    if (status === "In Progress") return "blue";
    if (status === "Done") return "green";
    return "black";
  }

  return (
    <div className="project-form-card">
      <h2>Project Tasks</h2>
      <p>View the task list and task details entered by the project creator.</p>

      {!createdProject ? (
        <p>No project created yet.</p>
      ) : (
        <>
          <p><strong>Project:</strong> {createdProject.title}</p>
          <p><strong>Course:</strong> {createdProject.course}</p>

          {tasks.length === 0 ? (
            <p>No tasks added to this project yet.</p>
          ) : (
            <section className="profile-section">
              {tasks.map((task, index) => (
                <div className="list-card" key={index}>
                  <p><strong>Task Name:</strong> {task.name}</p>
                  <p><strong>Task Details:</strong> {task.details}</p>

                  <label>Status</label>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(index, e.target.value)}
                    style={{
                      color: getStatusColor(task.status),
                      fontWeight: "bold",
                    }}
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                </div>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default StudentWorkspace;