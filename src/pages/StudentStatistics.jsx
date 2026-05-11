import { useState, useEffect } from "react";

function StudentStatistics() {
  const [projects, setProjects] = useState([]);
  const [languageStats, setLanguageStats] = useState({});
  const [collaborators, setCollaborators] = useState({});
  const [completedInternships, setCompletedInternships] = useState([]);
  const currentUser = localStorage.getItem("currentUserEmail");

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    // Load projects
    const allProjects = JSON.parse(localStorage.getItem("allProjects")) || [];
    const myProjects = allProjects.filter(p => p.studentEmail === currentUser);
    setProjects(myProjects);

    // Calculate language statistics
    const langCount = {};
    myProjects.forEach(project => {
      if (project.programmingLanguages) {
        const langs = project.programmingLanguages.split(/[,，]/);
        langs.forEach(lang => {
          const cleanLang = lang.trim();
          if (cleanLang) {
            langCount[cleanLang] = (langCount[cleanLang] || 0) + 1;
          }
        });
      }
    });
    setLanguageStats(langCount);

    // Calculate top collaborators
    const collabCount = {};
    myProjects.forEach(project => {
      if (project.collaborator && project.collaborator !== currentUser) {
        collabCount[project.collaborator] = (collabCount[project.collaborator] || 0) + 1;
      }
    });
    setCollaborators(collabCount);

    // Load completed internships
    const applications = JSON.parse(localStorage.getItem("internshipApplications")) || {};
    const myApplications = applications[currentUser] || [];
    const completed = myApplications.filter(app => app.status === "accepted");
    setCompletedInternships(completed);
  }

  const totalLanguages = Object.values(languageStats).reduce((a, b) => a + b, 0);

  return (
    <div className="statistics-container">
      <h1>My Statistics</h1>
      
      {/* Project Stats */}
      <div className="stat-card">
        <h2>📊 Project Overview</h2>
        <div className="stat-number-large">{projects.length}</div>
        <p>Total Projects Created</p>
      </div>

      {/* Language Distribution */}
      {Object.keys(languageStats).length > 0 && (
        <div className="stat-card">
          <h2>💻 Programming Languages Used</h2>
          <div className="language-stats">
            {Object.entries(languageStats).map(([lang, count]) => (
              <div key={lang} className="language-item">
                <div className="language-name">{lang}</div>
                <div className="language-bar-container">
                  <div 
                    className="language-bar" 
                    style={{ width: `${(count / totalLanguages) * 100}%` }}
                  ></div>
                </div>
                <div className="language-percentage">{Math.round((count / totalLanguages) * 100)}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Collaborators */}
      {Object.keys(collaborators).length > 0 && (
        <div className="stat-card">
          <h2>👥 Top Collaborators</h2>
          <div className="collaborators-list">
            {Object.entries(collaborators)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([email, count]) => (
                <div key={email} className="collaborator-item">
                  <span>{email}</span>
                  <span className="collab-count">{count} project{count > 1 ? 's' : ''}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Completed Internships */}
      <div className="stat-card">
        <h2>✅ Completed Internships</h2>
        {completedInternships.length === 0 ? (
          <p>No completed internships yet.</p>
        ) : (
          <div className="internships-list">
            {completedInternships.map((internship, idx) => (
              <div key={idx} className="internship-item">
                <strong>{internship.title}</strong> at {internship.companyName}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentStatistics;