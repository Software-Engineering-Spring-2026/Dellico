import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const role = localStorage.getItem("role") || "student";
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const currentUser = localStorage.getItem("currentUserEmail");

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 5000);
    return () => clearInterval(interval);
  }, []);

  function loadUnreadCount() {
    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    const unread = notifications.filter(n => n.to === currentUser && !n.read).length;
    setUnreadCount(unread);
  }

  const menus = {
    student: [
  // Profile & Portfolio
  { path: "/student-profile", label: "My Portfolio", icon: "👩‍🎓" },
  
  // Projects (Dropdown)
  {
    label: "Projects",
    icon: "📁",
    children: [
      { path: "/my-projects", label: "My Projects" },
      { path: "/create", label: "Create Project" },
      { path: "/student-workspace", label: "Project Tasks" },
      { path: "/project-details", label: "Project Details" },
    ],
  },
  
  // Collaboration
  { path: "/project-collaborators", label: "Collaborators", icon: "👥" },
  { path: "/student-feedback", label: "Feedback", icon: "⭐" },
  
  // Opportunities
  { path: "/internships", label: "Internships", icon: "💼" },
  { path: "/browse-projects", label: "Browse Projects", icon: "🔍" },
  { path: "/browse-portfolios", label: "Browse Portfolios", icon: "📁" },
  
  // Communication
  { path: "/profile", label: "Search Instructors", icon: "👨‍🏫" },
  { 
    path: "/notifications", 
    label: "Notifications", 
    icon: "🔔",
    badge: unreadCount > 0 ? unreadCount : null
  },
  { path: "/messages", label: "Messages", icon: "💬" },
  
  // Recommendations & Analytics
  { path: "/recommended", label: "Recommended", icon: "💡" },
  { path: "/student-statistics", label: "Statistics", icon: "📊" },
  
  // Settings
  { path: "/settings", label: "Settings", icon: "⚙️" },
],

    instructor: [
      { path: "/instructor-profile", label: "My Profile", icon: "👨‍🏫" },
      { path: "/instructor-courses", label: "My Courses", icon: "📚" },
      { path: "/instructor-invitations", label: "Invitations", icon: "📩" },
      { path: "/project-collaborators", label: "Collaborators", icon: "👥" },
      { path: "/instructor-feedback", label: "Feedback", icon: "⭐" },
      { path: "/browse-projects", label: "Browse Projects", icon: "🔍" },
      { path: "/browse-portfolios", label: "Browse Portfolios", icon: "📁" },
      { path: "/profile", label: "Search Instructors", icon: "🔎" },
      { 
        path: "/notifications", 
        label: "Notifications", 
        icon: "🔔",
        badge: unreadCount > 0 ? unreadCount : null
      },
      { path: "/recommended", label: "Recommended", icon: "💡" },
      { path: "/messages", label: "Messages", icon: "💬" },
      { path: "/settings", label: "Settings", icon: "⚙️" },
    ],

    employer: [
      { path: "/employer-profile", label: "Company Profile", icon: "🏢" },
      { path: "/manage-internships", label: "Manage Internships", icon: "💼" },
      { path: "/browse-projects", label: "Browse Projects", icon: "🔍" },
      { path: "/browse-portfolios", label: "Browse Portfolios", icon: "📁" },
      { path: "/profile", label: "Search Instructors", icon: "🔎" },
      { 
        path: "/notifications", 
        label: "Notifications", 
        icon: "🔔",
        badge: unreadCount > 0 ? unreadCount : null
      },
      { path: "/recommended", label: "Recommended", icon: "💡" },
      { path: "/messages", label: "Messages", icon: "💬" },
      { path: "/employer-statistics", label: "Statistics", icon: "📊" },
      { path: "/settings", label: "Settings", icon: "⚙️" },
    ],

    admin: [
      { path: "/admin", label: "Dashboard", icon: "📊" },
      { path: "/browse-projects", label: "Browse Projects", icon: "🔍" },
      { path: "/browse-portfolios", label: "Browse Portfolios", icon: "📁" },
      { path: "/profile", label: "Search Instructors", icon: "🔎" },
      { 
        path: "/notifications", 
        label: "Notifications", 
        icon: "🔔",
        badge: unreadCount > 0 ? unreadCount : null
      },
      { path: "/recommended", label: "Recommended", icon: "💡" },
      { path: "/messages", label: "Messages", icon: "💬" },
      { path: "/settings", label: "Settings", icon: "⚙️" },
    ],
  };

  const items = menus[role] || menus.student;

  return (
    <aside className="template-sidebar">
      <div className="sidebar-brand">
        <h2>Dellico</h2>
        <p>Portfolio Platform</p>
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
                <span className="dropdown-arrow">{projectsOpen ? "▾" : "▸"}</span>
              </button>

              {projectsOpen && (
                <div className="sidebar-submenu">
                  {item.children.map((child) => (
                    <NavLink key={child.path} to={child.path} className="sidebar-child-link">
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
              {item.badge && <span className="notification-badge">{item.badge}</span>}
            </NavLink>
          )
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;