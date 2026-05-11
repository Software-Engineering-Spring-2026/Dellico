import { useState, useEffect } from "react";

function StudentWorkspace() {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [draggedTaskIndex, setDraggedTaskIndex] = useState(null);
  
  const currentUser = localStorage.getItem("currentUserEmail");
  const role = localStorage.getItem("role");
  
  const isProjectCreator = project?.studentEmail === currentUser;

  useEffect(() => {
    loadProject();
  }, []);

  function loadProject() {
    const selected = JSON.parse(localStorage.getItem("selectedProject"));
    if (selected) {
      setProject(selected);
      setTasks(selected.tasks || []);
    } else {
      const created = JSON.parse(localStorage.getItem("createdProject"));
      setProject(created);
      setTasks(created?.tasks || []);
    }
  }

  function saveTasks(updatedTasks) {
    setTasks(updatedTasks);
    
    // Update in localStorage
    const allProjects = JSON.parse(localStorage.getItem("allProjects")) || [];
    const updatedProjects = allProjects.map(p => {
      if (p.id === project.id) {
        return { ...p, tasks: updatedTasks };
      }
      return p;
    });
    localStorage.setItem("allProjects", JSON.stringify(updatedProjects));
    localStorage.setItem("selectedProject", JSON.stringify({ ...project, tasks: updatedTasks }));
  }

  function updateTaskStatus(taskId, newStatus) {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    saveTasks(updatedTasks);
    setMessage(`Task status updated to ${newStatus}`);
    setTimeout(() => setMessage(""), 2000);
  }

  // ✅ Req 34: Reorder tasks (drag and drop)
  function handleDragStart(index) {
    setDraggedTaskIndex(index);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(targetIndex) {
    if (draggedTaskIndex === null) return;
    if (!isProjectCreator) {
      setMessage("Only the project creator can reorder tasks");
      setTimeout(() => setMessage(""), 2000);
      return;
    }
    
    const reorderedTasks = [...tasks];
    const [draggedTask] = reorderedTasks.splice(draggedTaskIndex, 1);
    reorderedTasks.splice(targetIndex, 0, draggedTask);
    
    saveTasks(reorderedTasks);
    setDraggedTaskIndex(null);
    setMessage("Task order updated");
    setTimeout(() => setMessage(""), 2000);
  }

  function moveTaskUp(index) {
    if (!isProjectCreator) return;
    if (index === 0) return;
    
    const reorderedTasks = [...tasks];
    [reorderedTasks[index - 1], reorderedTasks[index]] = [reorderedTasks[index], reorderedTasks[index - 1]];
    saveTasks(reorderedTasks);
    setMessage("Task moved up");
    setTimeout(() => setMessage(""), 2000);
  }

  function moveTaskDown(index) {
    if (!isProjectCreator) return;
    if (index === tasks.length - 1) return;
    
    const reorderedTasks = [...tasks];
    [reorderedTasks[index], reorderedTasks[index + 1]] = [reorderedTasks[index + 1], reorderedTasks[index]];
    saveTasks(reorderedTasks);
    setMessage("Task moved down");
    setTimeout(() => setMessage(""), 2000);
  }

  function getTaskStatusColor(status) {
    switch(status) {
      case "completed": return "green";
      case "in-progress": return "blue";
      case "postponed": return "orange";
      default: return "gray";
    }
  }

  if (!project) {
    return (
      <div className="project-form-card">
        <h2>Project Workspace</h2>
        <p>No project selected. Go to My Projects and click View Details.</p>
        <button className="primary" onClick={() => window.location.href = "/my-projects"}>
          Go to My Projects
        </button>
      </div>
    );
  }

  return (
    <div className="project-form-card">
      <h2>Project Workspace: {project.title}</h2>
      <p><strong>Course:</strong> {project.course}</p>
      
      {isProjectCreator && (
        <div className="info-text">
          👑 You are the project creator - you can reorder tasks by dragging or using the arrows
        </div>
      )}
      {!isProjectCreator && (
        <div className="info-text">👥 You are a collaborator - you can only update task status</div>
      )}

      {message && <p className="success-text">{message}</p>}

      <h3>Tasks {isProjectCreator && <span className="reorder-hint">(Drag to reorder)</span>}</h3>
      
      {tasks.length === 0 ? (
        <p>No tasks added to this project yet.</p>
      ) : (
        <div className="tasks-list">
          {tasks.map((task, index) => (
            <div 
              key={task.id || index} 
              className={`task-card ${draggedTaskIndex === index ? "dragging" : ""}`}
              draggable={isProjectCreator}
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
            >
              <div className="task-order">
                <span className="task-number">{index + 1}</span>
                {isProjectCreator && (
                  <div className="task-order-controls">
                    <button 
                      className="order-btn" 
                      onClick={() => moveTaskUp(index)}
                      disabled={index === 0}
                      title="Move Up"
                    >
                      ↑
                    </button>
                    <button 
                      className="order-btn" 
                      onClick={() => moveTaskDown(index)}
                      disabled={index === tasks.length - 1}
                      title="Move Down"
                    >
                      ↓
                    </button>
                  </div>
                )}
              </div>
              
              <div className="task-content">
                <div className="task-header">
                  <h4>{task.name}</h4>
                  <span className={`task-status status-${task.status}`}>
                    {task.status === "pending" && "⏳ Pending"}
                    {task.status === "in-progress" && "🔄 In Progress"}
                    {task.status === "postponed" && "📅 Postponed"}
                    {task.status === "completed" && "✅ Completed"}
                  </span>
                </div>
                <p><strong>Description:</strong> {task.description}</p>
                <p><strong>Assigned to:</strong> {task.assignedTo}</p>
                <p><strong>Deadline:</strong> {task.deadline || "No deadline"}</p>
                
                {(isProjectCreator || task.assignedTo === currentUser) && (
                  <div className="status-update">
                    <label>Update Status:</label>
                    <select 
                      value={task.status} 
                      onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="in-progress">🔄 In Progress</option>
                      <option value="postponed">📅 Postponed</option>
                      <option value="completed">✅ Completed</option>
                    </select>
                  </div>
                )}
              </div>
              
              {isProjectCreator && <div className="drag-handle">⋮⋮</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentWorkspace;