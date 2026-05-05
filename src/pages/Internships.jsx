import { useState } from "react";

function Internships() {
  const [showResults, setShowResults] = useState(false);
  const [selected, setSelected] = useState(null);

  const internships = [
    {
      id: 1,
      title: "Frontend React Intern",
      company: "Dell",
      duration: "3 months",
      responsibilities: "Build UI components and dashboards.",
      skills: "React, CSS, Git",
      deadline: "30 May",
    },
    {
      id: 2,
      title: "Data Analyst Intern",
      company: "CIB",
      duration: "2 months",
      responsibilities: "Analyze financial data.",
      skills: "Excel, SQL, Power BI",
      deadline: "25 May",
    },
  ];

  return (
    <div className="page-card wide-card">
      <h2>Student Internships</h2>
      <p>Search, filter, view, select, and apply for internships.</p>

      {/* SEARCH */}
      <section className="profile-section">
        <h3>Search and Filter Internships</h3>

        <input placeholder="Search by title or company" />

        <select>
          <option>Filter by company</option>
          <option>Dell</option>
          <option>CIB</option>
        </select>

        <select>
          <option>Filter by duration</option>
          <option>2 months</option>
          <option>3 months</option>
        </select>

        <select>
          <option>Sort by posting date</option>
          <option>Newest first</option>
        </select>

        <button className="primary" onClick={() => setShowResults(true)}>
          Search Internships
        </button>
      </section>

      {/* RESULTS */}
      {showResults && (
        <section className="profile-section">
          <h3>Internship Results</h3>

          {internships.map((job) => (
            <div className="list-card" key={job.id}>
              <h4>{job.title}</h4>
              <p>{job.company}</p>

              <button
                className="secondary-btn"
                onClick={() => setSelected(job)}
              >
                Select Internship
              </button>
            </div>
          ))}
        </section>
      )}

      {/* SELECTED INTERNSHIP DETAILS */}
      {selected && (
        <section className="profile-section">
          <h3>Selected Internship Details</h3>

          <div className="list-card">
            <h4>{selected.title}</h4>
            <p>Company: {selected.company}</p>
            <p>Duration: {selected.duration}</p>
            <p>Responsibilities: {selected.responsibilities}</p>
            <p>Skills: {selected.skills}</p>
            <p>Deadline: {selected.deadline}</p>

            <button className="primary">Apply for Role</button>
          </div>
        </section>
      )}
    </div>
  );
}

export default Internships;