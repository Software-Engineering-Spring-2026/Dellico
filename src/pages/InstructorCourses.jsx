import { useState, useEffect } from "react";

function InstructorCourses() {
  const saved = JSON.parse(localStorage.getItem("instructorCourses"));
  const [courses, setCourses] = useState(saved || ["Bachelor Project"]);
  const [course, setCourse] = useState("");
  const [message, setMessage] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);
  const currentUser = localStorage.getItem("currentUserEmail");

  useEffect(() => {
    // Load pending requests for this instructor
    const allRequests = JSON.parse(localStorage.getItem("linkingRequests")) || [];
    setPendingRequests(allRequests.filter(r => r.instructorEmail === currentUser && r.status === "pending"));
  }, []);

  function saveCourses(updatedCourses) {
    setCourses(updatedCourses);
    localStorage.setItem("instructorCourses", JSON.stringify(updatedCourses));
  }

  // Req 57: Instructor sends link request to admin
  function requestLinkCourse() {
    if (!course.trim()) {
      setMessage("Please enter a course name.");
      return;
    }

    if (courses.includes(course)) {
      setMessage("You are already linked to this course.");
      return;
    }

    // Check if request already exists
    const existingRequests = JSON.parse(localStorage.getItem("linkingRequests")) || [];
    const alreadyRequested = existingRequests.some(
      r => r.instructorEmail === currentUser && r.courseName === course && r.status === "pending"
    );

    if (alreadyRequested) {
      setMessage("You already have a pending request for this course.");
      return;
    }

    // Create new linking request
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
    
    // Req 58: Admin receives notification
    // Notify admin
const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
notifications.push({
  id: Date.now(),
  to: "admin@guc.edu.eg",
  message: `${currentUser} requested to ${type} course "${courseName}"`,
  read: false,
  createdAt: new Date().toISOString(),
  type: "linking_request"
});
localStorage.setItem("notifications", JSON.stringify(notifications));

    setMessage(`Linking request sent to admin for course "${course}". Waiting for approval.`);
    setCourse("");
    
    setTimeout(() => setMessage(""), 3000);
  }

  // Request to unlink a course
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
    
    // Notify admin
    // Notify admin
const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
notifications.push({
  id: Date.now(),
  to: "admin@guc.edu.eg",
  message: `${currentUser} requested to ${type} course "${courseName}"`,
  read: false,
  createdAt: new Date().toISOString(),
  type: "linking_request"
});
localStorage.setItem("notifications", JSON.stringify(notifications));

    setMessage(`Unlinking request sent to admin for course "${selectedCourse}".`);
    
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <div className="project-form-card">
      <h2>My Linked Courses</h2>
      <p>All course instructors are automatically linked to Bachelor Project.</p>
      
      <p className="info-text">📌 To link to a course, submit a request. Admin must approve it.</p>

      <label>Course Name to Request</label>
      <input
        value={course}
        onChange={(e) => setCourse(e.target.value)}
        placeholder="Example: Software Engineering"
      />

      <button className="primary" type="button" onClick={requestLinkCourse}>
        Request to Link Course
      </button>

      {message && <p className="success-text">{message}</p>}

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <section className="profile-section">
          <h3>Pending Requests ({pendingRequests.length})</h3>
          {pendingRequests.map(req => (
            <div key={req.id} className="list-card">
              <p><strong>{req.type === "link" ? "🔗 Link Request" : "🔓 Unlink Request"}</strong></p>
              <p>Course: {req.courseName}</p>
              <p>Status: <span className="status-pending">Pending Admin Approval</span></p>
            </div>
          ))}
        </section>
      )}

      {/* Currently Linked Courses */}
      <section className="profile-section">
        <h3>Currently Linked Courses</h3>
        {courses.map((c) => (
          <div className="list-card" key={c}>
            <p><strong>{c}</strong></p>
            {c !== "Bachelor Project" && (
              <button
                className="secondary-btn"
                type="button"
                onClick={() => requestUnlinkCourse(c)}
              >
                Request to Unlink
              </button>
            )}
            {c === "Bachelor Project" && (
              <p className="info-text">🔒 Automatically linked - cannot be removed</p>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

export default InstructorCourses;