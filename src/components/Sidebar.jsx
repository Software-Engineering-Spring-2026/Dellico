import { useState } from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const role = localStorage.getItem("role") || "student";
  const [projectsOpen, setProjectsOpen] = useState(true);

  const menus = {
    student: [
  { path: "/student-profile", label: "My Portfolio", icon: "👩‍🎓" },
  { path: "/profile", label: "Search Instructors", icon: "👨‍🏫" },
  { path: "/internships", label: "Internships", icon: "💼" },
  { path: "/project-collaborators", label: "Collaborators", icon: "👥" },  // ← ADD THIS
  { path: "/settings", label: "Settings", icon: "⚙️" },
  {
  label: "Projects",
  icon: "📁",
  children: [
    { path: "/my-projects", label: "My Projects" },  // Changed from Create Project
    { path: "/create", label: "Create New Project" },
    { path: "/student-workspace", label: "Project Tasks" },
  ],
},
  { path: "/student-feedback", label: "Instructor Feedback", icon: "⭐" },
],

    instructor: [
  { path: "/instructor-profile", label: "My Profile", icon: "👨‍🏫" },
  { path: "/instructor-courses", label: "My Courses", icon: "📚" },
  { path: "/instructor-invitations", label: "Invitations", icon: "📩" },
  { path: "/project-collaborators", label: "Collaborators", icon: "👥" },  // ← ADD THIS
  { path: "/instructor-feedback", label: "Feedback", icon: "⭐" },
  { path: "/profile", label: "Search Instructors", icon: "🔎" },
  { path: "/settings", label: "Settings", icon: "⚙️" },
],

    employer: [
      { path: "/employer-profile", label: "Company Profile", icon: "🏢" },
      { path: "/employer", label: "Manage Internships", icon: "💼" },
      { path: "/profile", label: "Search Instructors", icon: "🔎" },
      { path: "/settings", label: "Settings", icon: "⚙️" },
    ],

    admin: [
  { path: "/admin", label: "Admin Dashboard", icon: "📊" },
  
  { path: "/profile", label: "Search Instructors", icon: "🔎" },
  { path: "/settings", label: "Settings", icon: "⚙️" },
],
  };

  const items = menus[role] || menus.student;

  return (
    <aside className="template-sidebar">
      <div className="sidebar-brand">
        
        
      </div>

      <nav className="sidebar-nav">
        {items.map((item) =>
          item.children ? (
            <div className="sidebar-dropdown" key={item.label}>
              <button
                type="button"
                className="template-link dropdown-button"
                onClick={() => setProjectsOpen(!projectsOpen)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                <span className="dropdown-arrow">
                  {projectsOpen ? "▾" : "▸"}
                </span>
              </button>

              {projectsOpen && (
                <div className="sidebar-submenu">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className="sidebar-child-link"
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <NavLink key={item.path} to={item.path} className="template-link">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          )
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;