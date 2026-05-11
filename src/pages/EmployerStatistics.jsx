import { useState, useEffect } from "react";

function EmployerStatistics() {
  const [internships, setInternships] = useState([]);
  const [completedInternships, setCompletedInternships] = useState([]);
  const [internshipHistory, setInternshipHistory] = useState([]);
  const [applications, setApplications] = useState({});
  const currentUser = localStorage.getItem("currentUserEmail");

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    const allInternships = JSON.parse(localStorage.getItem("internships")) || [];
    const myInternships = allInternships.filter(i => i.companyEmail === currentUser);
    setInternships(myInternships);

    // Load applications
    const allApplications = JSON.parse(localStorage.getItem("internshipApplicants")) || {};
    setApplications(allApplications);

    // Calculate completed internships (students who were accepted)
    const completed = [];
    const history = [];
    
    Object.entries(allApplications).forEach(([internshipId, applicants]) => {
      const internship = myInternships.find(i => i.id == internshipId);
      if (internship) {
        Object.entries(applicants).forEach(([studentEmail, data]) => {
          if (data.status === "accepted") {
            completed.push({ ...internship, studentEmail, appliedAt: data.appliedAt });
          }
        });
        history.push({
          title: internship.title,
          date: internship.createdAt,
          applicantCount: Object.keys(applicants).length,
          status: internship.status
        });
      }
    });
    
    setCompletedInternships(completed);
    setInternshipHistory(history);
  }

  const acceptedCount = completedInternships.length;
  const totalOffered = internships.length;
  const totalApplicants = Object.values(applications).reduce((sum, app) => sum + Object.keys(app).length, 0);

  return (
    <div className="statistics-container">
      <h1>Company Statistics</h1>
      
      <div className="stats-grid-2col">
        <div className="stat-card">
          <div className="stat-number-large">{totalOffered}</div>
          <p>Total Internships Offered</p>
        </div>
        <div className="stat-card">
          <div className="stat-number-large">{acceptedCount}</div>
          <p>Students Completed Internships</p>
        </div>
        <div className="stat-card">
          <div className="stat-number-large">{totalApplicants}</div>
          <p>Total Applications Received</p>
        </div>
        <div className="stat-card">
          <div className="stat-number-large">{Math.round(totalApplicants / (totalOffered || 1))}</div>
          <p>Average Applicants per Internship</p>
        </div>
      </div>

      {/* Internship History Chart */}
      <div className="stat-card">
        <h2>📈 Internships Over Time</h2>
        <div className="history-chart">
          {internshipHistory.sort((a, b) => new Date(a.date) - new Date(b.date)).map((item, idx) => (
            <div key={idx} className="history-item">
              <div className="history-label">{new Date(item.date).toLocaleDateString()}</div>
              <div className="history-bar-container">
                <div 
                  className="history-bar" 
                  style={{ width: `${(item.applicantCount / (totalApplicants || 1)) * 100}%` }}
                ></div>
              </div>
              <div className="history-value">{item.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Internships List */}
      <div className="stat-card">
        <h2>✅ Students Who Completed Internships</h2>
        {completedInternships.length === 0 ? (
          <p>No completed internships yet.</p>
        ) : (
          <div className="students-list">
            {completedInternships.map((item, idx) => (
              <div key={idx} className="student-item">
                <strong>{item.studentEmail}</strong> - {item.title}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployerStatistics;