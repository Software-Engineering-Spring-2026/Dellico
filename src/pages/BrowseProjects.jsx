import { useState } from "react";

export default function BrowseProjects() {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [techFilter, setTechFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const MOCK_PROJECTS = [
    { id: 1, title: "E-Commerce App", course: "CSEN401", type: "Web", tech: "React" },
    { id: 2, title: "Chat System", course: "CSEN702", type: "Mobile", tech: "Flutter" },
    { id: 3, title: "Library System", course: "CSEN401", type: "Web", tech: "React" },
  ];

  const filtered = MOCK_PROJECTS
    .filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) &&
      (courseFilter === "All" || p.course === courseFilter) &&
      (typeFilter === "All" || p.type === typeFilter) &&
      (techFilter === "All" || p.tech === techFilter)
    )
    .sort((a, b) =>
      sortBy === "newest" ? b.id - a.id : a.id - b.id
    );

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Browse Projects</h1>

      <input
        placeholder="Search projects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginRight: "1rem", padding: "0.5rem" }}
      />

      <select onChange={(e) => setCourseFilter(e.target.value)} style={{ marginRight: "1rem" }}>
        <option value="All">All Courses</option>
        <option value="CSEN401">CSEN401</option>
        <option value="CSEN702">CSEN702</option>
      </select>

      <select onChange={(e) => setTypeFilter(e.target.value)} style={{ marginRight: "1rem" }}>
        <option value="All">All Types</option>
        <option value="Web">Web</option>
        <option value="Mobile">Mobile</option>
      </select>

      <select onChange={(e) => setTechFilter(e.target.value)} style={{ marginRight: "1rem" }}>
        <option value="All">All Technologies</option>
        <option value="React">React</option>
        <option value="Flutter">Flutter</option>
      </select>

      <select onChange={(e) => setSortBy(e.target.value)}>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>

      {filtered.length === 0 ? (
        <p style={{ marginTop: "2rem" }}>No projects found.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "2rem" }}>
          {filtered.map((project) => (
            <div key={project.id} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
              <h3>{project.title}</h3>
              <p>Course: {project.course}</p>
              <p>Type: {project.type}</p>
              <p>Tech: {project.tech}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}