import { useState } from "react";

function Internships() {
  const [showResults, setShowResults] = useState(false);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [applicationMessage, setApplicationMessage] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    company: "",
    duration: "",
    sort: "",
    coverLetter: "",
  });

  const internships = [
    {
      id: 1,
      title: "Frontend React Intern",
      company: "Dell",
      duration: "3 months",
      responsibilities: "Build UI components and dashboards.",
      skills: "React, CSS, Git",
      deadline: "30 May",
      date: "2026-05-01",
    },
    {
      id: 2,
      title: "Data Analyst Intern",
      company: "CIB",
      duration: "2 months",
      responsibilities: "Analyze financial data and dashboards.",
      skills: "Excel, SQL, Power BI",
      deadline: "25 May",
      date: "2026-04-20",
    },
  ];

  function handleChange(e) {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  }

  function handleSearch() {
    setShowResults(true);
    setSelected(null);
    setApplicationMessage("");
  }

  let filteredInternships = internships.filter((job) => {
    const matchesSearch =
      !filters.search ||
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.search.toLowerCase());

    const matchesCompany = !filters.company || job.company === filters.company;
    const matchesDuration =
      !filters.duration || job.duration === filters.duration;

    return matchesSearch && matchesCompany && matchesDuration;
  });

  if (filters.sort === "Newest first") {
    filteredInternships = [...filteredInternships].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }

  if (filters.sort === "Oldest first") {
    filteredInternships = [...filteredInternships].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }

  function applyForInternship() {
    if (!filters.coverLetter.trim()) {
      setApplicationMessage("Please write a short cover letter before applying.");
      return;
    }

    setApplicationMessage(
      `Application submitted for ${selected.title}. Status: Applied.`
    );
  }

  return (
    <div className="project-form-card">
      <h2>Student Internships</h2>
      <p>Search, filter, view, select, and apply for internships.</p>

      <label>Search by Internship Title or Company Name</label>
      <input
        name="search"
        value={filters.search}
        onChange={handleChange}
        placeholder="Example: React or Dell"
      />

      <label>Filter by Company Name</label>
      <select name="company" value={filters.company} onChange={handleChange}>
        <option value="">All companies</option>
        <option>Dell</option>
        <option>CIB</option>
      </select>

      <label>Filter by Duration</label>
      <select name="duration" value={filters.duration} onChange={handleChange}>
        <option value="">All durations</option>
        <option>2 months</option>
        <option>3 months</option>
      </select>

      <label>Sort by Posting Date</label>
      <select name="sort" value={filters.sort} onChange={handleChange}>
        <option value="">Default order</option>
        <option>Newest first</option>
        <option>Oldest first</option>
      </select>

      <button className="primary" type="button" onClick={handleSearch}>
        Search Internships
      </button>

      {message && <p className="error-text">{message}</p>}

      {showResults && (
        <section className="profile-section">
          <h3>Internship Results Based on Search / Filtration</h3>

          {filteredInternships.length === 0 ? (
            <p>No internships found.</p>
          ) : (
            filteredInternships.map((job) => (
              <div className="list-card" key={job.id}>
                <h4>{job.title}</h4>
                <p>
                  <strong>Company:</strong> {job.company}
                </p>
                <p>
                  <strong>Duration:</strong> {job.duration}
                </p>

                <button
                  className="secondary-btn"
                  type="button"
                  onClick={() => {
                    setSelected(job);
                    setApplicationMessage("");
                  }}
                >
                  Select Internship
                </button>
              </div>
            ))
          )}
        </section>
      )}

      {selected && (
        <section className="profile-section">
          <h3>Selected Internship Details</h3>

          <p>
            <strong>Title:</strong> {selected.title}
          </p>
          <p>
            <strong>Company:</strong> {selected.company}
          </p>
          <p>
            <strong>Duration:</strong> {selected.duration}
          </p>
          <p>
            <strong>Responsibilities:</strong> {selected.responsibilities}
          </p>
          <p>
            <strong>Skills:</strong> {selected.skills}
          </p>
          <p>
            <strong>Deadline:</strong> {selected.deadline}
          </p>

          <label>Short Cover Letter</label>
          <textarea
            name="coverLetter"
            value={filters.coverLetter}
            onChange={handleChange}
            placeholder="Write a short cover letter explaining why you fit this internship"
          />

          <button className="primary" type="button" onClick={applyForInternship}>
            Apply for Internship
          </button>

          {applicationMessage && (
            <p className="success-text">{applicationMessage}</p>
          )}
        </section>
      )}
    </div>
  );
}

export default Internships;