import { useState, useEffect } from "react";

function InstructorCourses() {
  const saved = JSON.parse(localStorage.getItem("instructorCourses"));
  const [courses, setCourses] = useState(saved || ["Bachelor Project"]);
  const [course, setCourse] = useState("");
  const [message, setMessage] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);
  const currentUser = localStorage.getItem("currentUserEmail");

  useEffect(() => {
    const allRequests = JSON.parse(localStorage.getItem("linkingRequests")) || [];
    setPendingRequests(allRequests.filter(r => r.instructorEmail === currentUser && r.status === "pending"));
  }, []);

  function saveCourses(updatedCourses) {
    setCourses(updatedCourses);
    localStorage.setItem("instructorCourses", JSON.stringify(updatedCourses));
  }

  function requestLinkCourse() {
    if (!course.trim()) {
      setMessage("Please enter a course name.");
      return;
    }

    if (courses.includes(course)) {
      setMessage("You are already linked to this course.");
      return;
    }

    const existingRequests = JSON.parse(localStorage.getItem("linkingRequests")) || [];
    const alreadyRequested = existingRequests.some(
      r => r.instructorEmail === currentUser && r.courseName === course && r.status === "pending"
    );

    if (alreadyRequested) {
      setMessage("You already have a pending request for this course.");
      return;
    }

    const newRequest = {
      id: Date.now(),
      instructorEmail: currentUser,
      courseName: course,
      type: "link",
      status: "pending",
      requestedAt: new Date().toISOString()
    };

    existingRequests.push(newRequest);
    localStorage.setItem("linkingRequests", JSON.stringify(existingRequests));
    
    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.push({
      id: Date.now(),
      to: "admin@guc.edu.eg",
      message: `📚 Course linking request from ${currentUser} for "${course}"`,
      read: false,
      createdAt: new Date().toISOString(),
      type: "linking_request"
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));

    setMessage(`✅ Linking request sent to admin for course "${course}". Waiting for approval.`);
    setCourse("");
    
    setTimeout(() => setMessage(""), 3000);
  }

  function requestUnlinkCourse(selectedCourse) {
    if (selectedCourse === "Bachelor Project") {
      setMessage("Bachelor Project is automatic and cannot be unlinked.");
      return;
    }

    const existingRequests = JSON.parse(localStorage.getItem("linkingRequests")) || [];
    const alreadyRequested = existingRequests.some(
      r => r.instructorEmail === currentUser && r.courseName === selectedCourse && r.status === "pending"
    );

    if (alreadyRequested) {
      setMessage("You already have a pending unlink request for this course.");
      return;
    }

    const newRequest = {
      id: Date.now(),
      instructorEmail: currentUser,
      courseName: selectedCourse,
      type: "unlink",
      status: "pending",
      requestedAt: new Date().toISOString()
    };

    existingRequests.push(newRequest);
    localStorage.setItem("linkingRequests", JSON.stringify(existingRequests));
    
    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.push({
      id: Date.now(),
      to: "admin@guc.edu.eg",
      message: `🔗 Course unlinking request from ${currentUser} for "${selectedCourse}"`,
      read: false,
      createdAt: new Date().toISOString(),
      type: "linking_request"
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));

    setMessage(`✅ Unlinking request sent to admin for course "${selectedCourse}".`);
    
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <div className="courses-container-modern">
      <h1>My Linked Courses</h1>
      
      <div className="info-banner">
        <span>ℹ️</span>
        <p>All course instructors are automatically linked to Bachelor Project. To link to other courses, submit a request for admin approval.</p>
      </div>

      {/* Request Form */}
      <div className="request-form-card">
        <h3>Request to Link a New Course</h3>
        <div className="request-form">
          <input
            type="text"
            placeholder="Enter course name (e.g., Software Engineering)"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
          <button className="primary" onClick={requestLinkCourse}>
            Request to Link Course
          </button>
        </div>
        {message && <p className="success-message">{message}</p>}
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="pending-requests-card">
          <h3>Pending Requests</h3>
          <div className="pending-list">
            {pendingRequests.map(req => (
              <div key={req.id} className="pending-item">
                <div className="pending-info">
                  <span className="request-type">
                    {req.type === "link" ? "🔗 Link Request" : "🔓 Unlink Request"}
                  </span>
                  <span className="request-course">{req.courseName}</span>
                </div>
                <span className="pending-badge">Waiting for Admin</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Currently Linked Courses */}
      <div className="linked-courses-card">
        <h3>Currently Linked Courses</h3>
        <div className="courses-list-modern">
          {courses.map((c) => (
            <div key={c} className="course-item">
              <div className="course-info">
                <span className="course-icon">📘</span>
                <span className="course-name">{c}</span>
              </div>
              {c !== "Bachelor Project" ? (
                <button 
                  className="unlink-btn"
                  onClick={() => requestUnlinkCourse(c)}
                >
                  Request to Unlink
                </button>
              ) : (
                <span className="auto-badge">🔒 Automatically linked</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InstructorCourses;