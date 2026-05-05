import { NavLink } from "react-router-dom";

const menus = {
  student: [
    {
      title: "Student",
      items: [
        { path: "/student-profile", label: "My Portfolio" },
        { path: "/profile", label: "Search Instructors" },
        { path: "/internships", label: "Internships" },
        { path: "/settings", label: "Notification Settings" },
      ],
    },
  ],

  instructor: [
    {
      title: "Course Instructor",
      items: [
        { path: "/instructor-profile", label: "My Profile" },
        { path: "/profile", label: "Search Instructors" },
        { path: "/settings", label: "Notification Settings" },
      ],
    },
  ],

  employer: [
    {
      title: "Employer",
      items: [
        { path: "/employer-profile", label: "Company Profile" },
        { path: "/profile", label: "Search Instructors" },
        { path: "/settings", label: "Notification Settings" },
      ],
    },
  ],

  admin: [
    {
      title: "Administrator",
      items: [
        { path: "/admin", label: "Platform Statistics" },
        { path: "/profile", label: "Search Instructors" },
        { path: "/settings", label: "Notification Settings" },
      ],
    },
  ],
};

function Sidebar() {
  const role = localStorage.getItem("role") || "student";
  const menuSections = menus[role] || menus.student;

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">D</div>
        <div>
          <h2>Dellico</h2>
          <p>{role.charAt(0).toUpperCase() + role.slice(1)} View</p>
        </div>
      </div>

      <nav className="menu">
        {menuSections.map((section) => (
          <div className="menu-section" key={section.title}>
            <p className="menu-title">{section.title}</p>

            <div className="menu-group">
              {section.items.map((item) => (
                <NavLink key={item.path} to={item.path}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;