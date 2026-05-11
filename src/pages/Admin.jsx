import { useState, useEffect } from "react";

function Admin() {
  const [activeTab, setActiveTab] = useState("statistics");
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [flaggedProjects, setFlaggedProjects] = useState([]);
  const [appeals, setAppeals] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [message, setMessage] = useState("");
  const [linkingRequests, setLinkingRequests] = useState([]);
  
  // Course form state
  const [courseForm, setCourseForm] = useState({ name: "", code: "" });
  const [editingCourse, setEditingCourse] = useState(null);
  
  // Admin creation
  const [newAdmin, setNewAdmin] = useState({ username: "", password: "" });

  // Load all data on mount
  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    // Load users from registration
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    
    // Add default admin if not exists
    const hasAdmin = registeredUsers.some(u => u.email === "admin@guc.edu.eg");
    if (!hasAdmin) {
      registeredUsers.push({
        email: "admin@guc.edu.eg",
        password: "Admin@123",
        role: "admin",
        firstName: "System",
        lastName: "Admin",
        isActive: true
      });
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
    }
    setUsers(registeredUsers);
    
    // Load courses
    const savedCourses = JSON.parse(localStorage.getItem("courses")) || [];
    setCourses(savedCourses);
    
    // ✅ FIX: Separate companies - ALL employers and PENDING employers only
    const allEmployers = registeredUsers.filter(u => u.role === "employer");
    setAllCompanies(allEmployers);
    
    // Only show employers with "Pending" status in Company Verification tab
    const pendingOnly = allEmployers.filter(u => u.verificationStatus === "Pending");
    setPendingCompanies(pendingOnly);
    
    // Load flagged projects
    const flagged = JSON.parse(localStorage.getItem("flaggedProjects")) || [];
    setFlaggedProjects(flagged);
    
    // Load appeals
    const allAppeals = JSON.parse(localStorage.getItem("appeals")) || [];
    setAppeals(allAppeals);
    
    // Load linking requests
    const requests = JSON.parse(localStorage.getItem("linkingRequests")) || [];
    setLinkingRequests(requests);
  }

  function saveUsers(updatedUsers) {
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    
    // Update companies lists
    const allEmployers = updatedUsers.filter(u => u.role === "employer");
    setAllCompanies(allEmployers);
    const pendingOnly = allEmployers.filter(u => u.verificationStatus === "Pending");
    setPendingCompanies(pendingOnly);
  }

  // Req 52: View list of all users
  function toggleUserStatus(email) {
    const updatedUsers = users.map(user => 
      user.email === email ? { ...user, isActive: !user.isActive } : user
    );
    saveUsers(updatedUsers);
    setMessage(`User ${email} ${updatedUsers.find(u => u.email === email).isActive ? "activated" : "deactivated"}`);
    setTimeout(() => setMessage(""), 3000);
  }

  // Req 53: Create other admin accounts
  function createAdmin() {
    if (!newAdmin.username || !newAdmin.password) {
      setMessage("Please enter both username and password");
      return;
    }
    
    if (users.some(u => u.email === newAdmin.username)) {
      setMessage("Admin with this email already exists");
      return;
    }
    
    const newAdminUser = {
      email: newAdmin.username,
      password: newAdmin.password,
      role: "admin",
      firstName: "Admin",
      lastName: "User",
      isActive: true
    };
    
    saveUsers([...users, newAdminUser]);
    setNewAdmin({ username: "", password: "" });
    setMessage(`New admin account created: ${newAdmin.username}`);
    setTimeout(() => setMessage(""), 3000);
  }

  // Req 55: Create/Edit/Delete courses
  function addOrUpdateCourse() {
    if (!courseForm.name || !courseForm.code) {
      setMessage("Please enter both course name and code");
      return;
    }
    
    let updatedCourses;
    if (editingCourse) {
      updatedCourses = courses.map(c => 
        c.code === editingCourse.code ? { ...courseForm } : c
      );
      setMessage(`Course ${courseForm.name} updated successfully`);
    } else {
      if (courses.some(c => c.code === courseForm.code)) {
        setMessage("Course code already exists");
        return;
      }
      updatedCourses = [...courses, { ...courseForm }];
      setMessage(`Course ${courseForm.name} created successfully`);
    }
    
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
    setCourses(updatedCourses);
    setCourseForm({ name: "", code: "" });
    setEditingCourse(null);
    
    setTimeout(() => setMessage(""), 3000);
  }

  function deleteCourse(courseCode) {
    const updatedCourses = courses.filter(c => c.code !== courseCode);
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
    setCourses(updatedCourses);
    setMessage("Course deleted successfully");
    setTimeout(() => setMessage(""), 3000);
  }

  function editCourse(course) {
    setCourseForm({ name: course.name, code: course.code });
    setEditingCourse(course);
  }

  // Req 14-18: Company verification
  function viewCompanyDetails(company) {
    setSelectedCompany(company);
  }

  function verifyCompany(companyEmail, status) {
    const updatedUsers = users.map(user => {
      if (user.email === companyEmail) {
        return { ...user, verificationStatus: status };
      }
      return user;
    });
    saveUsers(updatedUsers);
    setSelectedCompany(null);
    setMessage(`Company ${status} successfully`);
    
    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.push({
      id: Date.now(),
      to: companyEmail,
      message: `Your company application has been ${status}`,
      read: false,
      createdAt: new Date().toISOString(),
      type: "company_verification"
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));
    
    setTimeout(() => setMessage(""), 3000);
  }

  // Req 57-58: Handle linking requests
  function handleLinkingRequest(request, action) {
    const updatedRequests = linkingRequests.map(req => 
      req.id === request.id ? { ...req, status: action } : req
    );
    localStorage.setItem("linkingRequests", JSON.stringify(updatedRequests));
    setLinkingRequests(updatedRequests);
    
    if (action === "approved") {
      if (request.type === "link") {
        const instructorCourses = JSON.parse(localStorage.getItem("instructorCourses")) || ["Bachelor Project"];
        if (!instructorCourses.includes(request.courseName)) {
          const updatedCourses = [...instructorCourses, request.courseName];
          localStorage.setItem("instructorCourses", JSON.stringify(updatedCourses));
        }
      } else if (request.type === "unlink") {
        const instructorCourses = JSON.parse(localStorage.getItem("instructorCourses")) || ["Bachelor Project"];
        const updatedCourses = instructorCourses.filter(c => c !== request.courseName);
        localStorage.setItem("instructorCourses", JSON.stringify(updatedCourses));
      }
      
      const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
      notifications.push({
        id: Date.now(),
        to: request.instructorEmail,
        message: `Your request to ${request.type} course "${request.courseName}" has been ${action}`,
        read: false,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }
    
    setMessage(`Request ${action} for ${request.courseName}`);
    setTimeout(() => setMessage(""), 3000);
  }

  // Req 59-64: Flagging system
  function viewFlaggedProject(project) {
    setSelectedProject(project);
  }

  function deactivateProject(projectId) {
    const updatedFlags = flaggedProjects.map(p => 
      p.id === projectId ? { ...p, isActive: false } : p
    );
    localStorage.setItem("flaggedProjects", JSON.stringify(updatedFlags));
    setFlaggedProjects(updatedFlags);
    setMessage("Project deactivated");
    
    const project = flaggedProjects.find(p => p.id === projectId);
    if (project) {
      const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
      notifications.push({
        id: Date.now(),
        to: project.studentEmail,
        message: `Your project "${project.title}" has been deactivated due to policy violation`,
        read: false,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }
    setTimeout(() => setMessage(""), 3000);
  }

  function activateProject(projectId) {
    const updatedFlags = flaggedProjects.map(p => 
      p.id === projectId ? { ...p, isActive: true } : p
    );
    localStorage.setItem("flaggedProjects", JSON.stringify(updatedFlags));
    setFlaggedProjects(updatedFlags);
    setMessage("Project activated");
    setTimeout(() => setMessage(""), 3000);
  }

  function viewAppeal(appeal) {
    alert(`Student: ${appeal.studentEmail}\n\nProject: ${appeal.projectTitle}\n\nAppeal Message:\n${appeal.message}`);
  }

  // Req 73: Statistics
  function getStatistics() {
    const students = users.filter(u => u.role === "student");
    const instructors = users.filter(u => u.role === "instructor");
    const verifiedEmployers = users.filter(u => u.role === "employer" && u.verificationStatus === "Accepted");
    const allProjects = JSON.parse(localStorage.getItem("allProjects")) || [];
    
    return {
      totalStudents: students.length,
      totalInstructors: instructors.length,
      totalEmployers: verifiedEmployers.length,
      totalProjects: allProjects.length,
      totalCourses: courses.length,
      pendingCompanies: pendingCompanies.length,
      flaggedProjects: flaggedProjects.length
    };
  }

  const stats = getStatistics();

  return (
    <div className="admin-dashboard">
      {/* Admin Tabs */}
      <div className="admin-tabs">
        <button className={activeTab === "statistics" ? "active-tab tab" : "tab"} onClick={() => setActiveTab("statistics")}>
          📊 Statistics
        </button>
        <button className={activeTab === "users" ? "active-tab tab" : "tab"} onClick={() => setActiveTab("users")}>
          👥 User Management
        </button>
        <button className={activeTab === "companies" ? "active-tab tab" : "tab"} onClick={() => setActiveTab("companies")}>
          🏢 Company Verification
        </button>
        <button className={activeTab === "courses" ? "active-tab tab" : "tab"} onClick={() => setActiveTab("courses")}>
          📚 Course Management
        </button>
        <button className={activeTab === "linkRequests" ? "active-tab tab" : "tab"} onClick={() => setActiveTab("linkRequests")}>
          🔗 Linking Requests
        </button>
        <button className={activeTab === "flags" ? "active-tab tab" : "tab"} onClick={() => setActiveTab("flags")}>
          🚩 Flagged Projects
        </button>
        <button className={activeTab === "appeals" ? "active-tab tab" : "tab"} onClick={() => setActiveTab("appeals")}>
          📝 Appeals
        </button>
      </div>

      {message && <div className="success-text">{message}</div>}

      {/* Req 73: Statistics Dashboard */}
      {activeTab === "statistics" && (
        <div className="stats-dashboard">
          <h2>Platform Statistics</h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.totalStudents}</div>
              <div className="stat-label">Total Students</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">{stats.totalInstructors}</div>
              <div className="stat-label">Course Instructors</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">{stats.totalEmployers}</div>
              <div className="stat-label">Verified Employers</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">{stats.totalProjects}</div>
              <div className="stat-label">Total Projects</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">{stats.totalCourses}</div>
              <div className="stat-label">Active Courses</div>
            </div>
            
            <div className="stat-card warning">
              <div className="stat-number">{stats.pendingCompanies}</div>
              <div className="stat-label">Pending Verifications</div>
            </div>
            
            <div className="stat-card danger">
              <div className="stat-number">{stats.flaggedProjects}</div>
              <div className="stat-label">Flagged Projects</div>
            </div>
          </div>
        </div>
      )}

      {/* Req 52, 54: User Management - Shows ALL users */}
      {activeTab === "users" && (
        <div className="admin-section">
          <h2>User Management</h2>
          
          <div className="create-admin-section">
            <h3>Create New Administrator</h3>
            <div className="create-admin-form">
              <input
                placeholder="Admin Email"
                value={newAdmin.username}
                onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
              />
              <button className="primary" onClick={createAdmin}>Create Admin Account</button>
            </div>
          </div>
          
          <div className="user-list-modern">
            <h3>All Users ({users.length})</h3>
            <div className="users-table-container">
              <table className="users-table-modern">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr key={idx}>
                      <td data-label="Name">
                        <div className="user-name-cell">
                          <span className="user-avatar">
                            {user.role === "admin" ? "👑" : 
                             user.role === "student" ? "🎓" : 
                             user.role === "instructor" ? "👨‍🏫" : "🏢"}
                          </span>
                          {user.firstName} {user.lastName}
                        </div>
                      </td>
                      <td data-label="Email">{user.email}</td>
                      <td data-label="Role">
                        <span className={`role-badge ${user.role}`}>
                          {user.role === "admin" ? "Admin" : 
                           user.role === "student" ? "Student" :
                           user.role === "instructor" ? "Instructor" : "Employer"}
                        </span>
                      </td>
                      <td data-label="Status">
                        <span className={`status-badge ${user.isActive !== false ? "active" : "inactive"}`}>
                          {user.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td data-label="Action">
                        <button 
                          className={`action-btn ${user.isActive !== false ? "deactivate" : "activate"}`}
                          onClick={() => toggleUserStatus(user.email)}
                        >
                          {user.isActive !== false ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Req 14-18: Company Verification - Shows ONLY PENDING employers */}
      {activeTab === "companies" && (
        <div className="admin-section">
          <h2>Company Verification</h2>
          <p>Review employer applications and verify their documents</p>
          
          <div className="companies-list">
            {pendingCompanies.length === 0 ? (
              <p>No pending company applications</p>
            ) : (
              pendingCompanies.map((company, idx) => (
                <div key={idx} className="list-card">
                  <h3>{company.companyName || company.firstName}</h3>
                  <p><strong>Email:</strong> {company.email}</p>
                  <p><strong>Document:</strong> {company.documentName || "Tax certificate.pdf"}</p>
                  <div className="button-row">
                    <button className="primary" onClick={() => viewCompanyDetails(company)}>
                      View Details & Documents
                    </button>
                    <button className="secondary-btn" onClick={() => verifyCompany(company.email, "Accepted")}>
                      ✅ Accept
                    </button>
                    <button className="secondary-btn" onClick={() => verifyCompany(company.email, "Rejected")}>
                      ❌ Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {selectedCompany && (
            <div className="modal-overlay" onClick={() => setSelectedCompany(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Company Details</h3>
                <p><strong>Company Name:</strong> {selectedCompany.companyName || selectedCompany.firstName}</p>
                <p><strong>Email:</strong> {selectedCompany.email}</p>
                <p><strong>Verification Document:</strong> {selectedCompany.documentName || "Tax certificate.pdf"}</p>
                
                <button 
                  className="secondary-btn" 
                  onClick={() => {
                    const content = `COMPANY VERIFICATION DOCUMENT\n================================\n\nCompany Name: ${selectedCompany.companyName || selectedCompany.firstName}\nEmail: ${selectedCompany.email}\nDocument: ${selectedCompany.documentName || "Tax certificate.pdf"}\nDownload Date: ${new Date().toLocaleString()}\n\n----------------------------------------\nThis document verifies that the above company has applied to use the Dellico platform.\n\nVerification Status: Pending Admin Review\n\nThis is an official verification document generated by Dellico Platform.`;
                    
                    const blob = new Blob([content], { type: 'application/pdf' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = selectedCompany.documentName || "verification-document.pdf";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    
                    setMessage(`Downloading ${selectedCompany.documentName || "document"}`);
                    setTimeout(() => setMessage(""), 2000);
                  }}
                >
                  📥 Download Document
                </button>
                
                <button className="primary" onClick={() => setSelectedCompany(null)}>Close</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Req 55-58: Course Management */}
      {activeTab === "courses" && (
        <div className="admin-section">
          <h2>Course Management</h2>
          
          <div className="course-form">
            <h3>{editingCourse ? "Edit Course" : "Add New Course"}</h3>
            <input
              placeholder="Course Name"
              value={courseForm.name}
              onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
            />
            <input
              placeholder="Course Code"
              value={courseForm.code}
              onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
            />
            <div className="button-row">
              <button className="primary" onClick={addOrUpdateCourse}>
                {editingCourse ? "Update Course" : "Add Course"}
              </button>
              {editingCourse && (
                <button className="secondary-btn" onClick={() => {
                  setEditingCourse(null);
                  setCourseForm({ name: "", code: "" });
                }}>
                  Cancel
                </button>
              )}
            </div>
          </div>
          
          <div className="courses-list">
            <h3>All Courses ({courses.length})</h3>
            {courses.map((course, idx) => (
              <div key={idx} className="list-card">
                <p><strong>{course.name}</strong> ({course.code})</p>
                <div className="button-row">
                  <button className="secondary-btn" onClick={() => editCourse(course)}>Edit</button>
                  <button className="secondary-btn" onClick={() => deleteCourse(course.code)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Req 57-58: Linking Requests */}
      {activeTab === "linkRequests" && (
        <div className="admin-section">
          <h2>Course Linking Requests</h2>
          <p>Review and approve/deny instructor requests to link/unlink courses.</p>
          
          {linkingRequests.filter(r => r.status === "pending").length === 0 ? (
            <p>No pending linking requests</p>
          ) : (
            linkingRequests.filter(r => r.status === "pending").map((request, idx) => (
              <div key={idx} className="list-card">
                <h3>{request.type === "link" ? "🔗 Link Request" : "🔓 Unlink Request"}</h3>
                <p><strong>Instructor:</strong> {request.instructorEmail}</p>
                <p><strong>Course:</strong> {request.courseName}</p>
                <p><strong>Requested:</strong> {new Date(request.requestedAt).toLocaleString()}</p>
                <div className="button-row">
                  <button className="primary" onClick={() => handleLinkingRequest(request, "approved")}>
                    ✅ Approve
                  </button>
                  <button className="secondary-btn" onClick={() => handleLinkingRequest(request, "rejected")}>
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Req 59-64: Flagged Projects */}
      {activeTab === "flags" && (
        <div className="admin-section">
          <h2>Flagged Projects</h2>
          
          {flaggedProjects.length === 0 ? (
            <p>No flagged projects</p>
          ) : (
            flaggedProjects.map((project, idx) => (
              <div key={idx} className="list-card">
                <h3>{project.title}</h3>
                <p><strong>Student:</strong> {project.studentEmail}</p>
                <p><strong>Reason:</strong> {project.reason || "Policy violation - plagiarism detected"}</p>
                <p><strong>Status:</strong> {project.isActive !== false ? "Active" : "Deactivated"}</p>
                <div className="button-row">
                  <button className="secondary-btn" onClick={() => viewFlaggedProject(project)}>
                    View Details
                  </button>
                  {project.isActive !== false ? (
                    <button className="secondary-btn" onClick={() => deactivateProject(project.id)}>
                      Deactivate Project
                    </button>
                  ) : (
                    <button className="primary" onClick={() => activateProject(project.id)}>
                      Reactivate Project
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Req 62-63: Appeals */}
      {activeTab === "appeals" && (
        <div className="admin-section">
          <h2>Student Appeals</h2>
          
          {appeals.length === 0 ? (
            <p>No pending appeals</p>
          ) : (
            appeals.map((appeal, idx) => (
              <div key={idx} className="list-card">
                <h3>Appeal for: {appeal.projectTitle}</h3>
                <p><strong>Student:</strong> {appeal.studentEmail}</p>
                <p><strong>Message:</strong> {appeal.message}</p>
                <div className="button-row">
                  <button className="primary" onClick={() => viewAppeal(appeal)}>
                    Review Appeal
                  </button>
                  <button className="secondary-btn" onClick={() => {
                    const updatedAppeals = appeals.filter(a => a.id !== appeal.id);
                    localStorage.setItem("appeals", JSON.stringify(updatedAppeals));
                    setAppeals(updatedAppeals);
                    setMessage("Appeal marked as reviewed");
                    setTimeout(() => setMessage(""), 3000);
                  }}>
                    Mark as Resolved
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Admin;