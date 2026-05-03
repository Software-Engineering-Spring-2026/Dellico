import { useState } from "react";

export default function BrowsePortfolios() {
  const [search, setSearch] = useState("");
  const [majorFilter, setMajorFilter] = useState("All");
  const [skillFilter, setSkillFilter] = useState("All");

  const MOCK_PORTFOLIOS = [
    { id: 1, name: "Ahmed Ali", major: "CS", skills: "React, Node" },
    { id: 2, name: "Sara Mohamed", major: "BI", skills: "Python, SQL" },
    { id: 3, name: "Omar Hassan", major: "CS", skills: "Flutter, Firebase" },
  ];

  const filtered = MOCK_PORTFOLIOS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (majorFilter === "All" || p.major === majorFilter) &&
    (skillFilter === "All" || p.skills.includes(skillFilter))
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Browse Portfolios</h1>
      <input
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginRight: "1rem", padding: "0.5rem" }}
      />
      <select onChange={(e) => setMajorFilter(e.target.value)} style={{ marginRight: "1rem" }}>
        <option value="All">All Majors</option>
        <option value="CS">CS</option>
        <option value="BI">BI</option>
      </select>
      <select onChange={(e) => setSkillFilter(e.target.value)}>
        <option value="All">All Skills</option>
        <option value="React">React</option>
        <option value="Python">Python</option>
        <option value="Flutter">Flutter</option>
      </select>

      {filtered.length === 0 ? (
        <p style={{ marginTop: "2rem" }}>No portfolios found.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "2rem" }}>
          {filtered.map((person) => (
            <div key={person.id} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
              <h3>{person.name}</h3>
              <p>Major: {person.major}</p>
              <p>Skills: {person.skills}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}