import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("student");

  function loginAs(role, path) {
    localStorage.setItem("role", role);
    navigate(path);
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-wide">
        <div className="auth-logo">D</div>
        <h1>Welcome to Dellico</h1>
        <p>GUC Project Portfolio Platform</p>

        <div className="auth-tabs">
          <button className={tab === "student" ? "tab active-tab" : "tab"} onClick={() => setTab("student")}>Student Login</button>
          <button className={tab === "instructor" ? "tab active-tab" : "tab"} onClick={() => setTab("instructor")}>Instructor Login</button>
          <button className={tab === "employer" ? "tab active-tab" : "tab"} onClick={() => setTab("employer")}>Employer Login</button>
          <button className={tab === "admin" ? "tab active-tab" : "tab"} onClick={() => setTab("admin")}>Admin Login</button>
          <button className={tab === "register" ? "tab active-tab" : "tab"} onClick={() => setTab("register")}>Register</button>
          <button className={tab === "otp" ? "tab active-tab" : "tab"} onClick={() => setTab("otp")}>Forgot Password</button>
        </div>

        {tab === "student" && (
          <form className="auth-form" onSubmit={(e) => { e.preventDefault(); loginAs("student", "/student-profile"); }}>
            <h2>Student Login</h2>
            <p>Students log in using GUC email and password.</p>
            <input placeholder="Student GUC email" />
            <input type="password" placeholder="Password" />
            <button className="primary">Login as Student</button>
            
          </form>
        )}

        {tab === "instructor" && (
          <form className="auth-form" onSubmit={(e) => { e.preventDefault(); loginAs("instructor", "/instructor-profile"); }}>
            <h2>Course Instructor Login</h2>
            <p>Course instructors log in using GUC email and password.</p>
            <input placeholder="Instructor GUC email" />
            <input type="password" placeholder="Password" />
            <button className="primary">Login as Instructor</button>
            
          </form>
        )}

        {tab === "employer" && (
          <form className="auth-form" onSubmit={(e) => { e.preventDefault(); loginAs("employer", "/employer-profile"); }}>
            <h2>Employer Login</h2>
            <p>Employers log in using external company email and password.</p>
            <input placeholder="Company email" />
            <input type="password" placeholder="Password" />
            <button className="primary">Login as Employer</button>
            
          </form>
        )}

        {tab === "admin" && (
          <form className="auth-form" onSubmit={(e) => { e.preventDefault(); loginAs("admin", "/admin"); }}>
            <h2>Administrator Login</h2>
            <p>Administrators log in using GUC email. Admins do not register.</p>
            <input placeholder="Admin GUC email" />
            <input type="password" placeholder="Password" />
            <button className="primary">Login as Admin</button>
           
          </form>
        )}

        {tab === "register" && (
          <div className="auth-grid two">
            <form>
              <h2>Student / Instructor Registration</h2>
              <input placeholder="First name" />
              <input placeholder="Last name" />
              <input placeholder="GUC email" />
              <input type="password" placeholder="Password" />
              <select>
                <option>Student</option>
                <option>Course Instructor</option>
              </select>
              <button className="primary" type="button">Register</button>
            </form>

            <form>
              <h2>Employer Registration</h2>
              <input placeholder="Company name" />
              <input placeholder="Company email" />
              <input type="password" placeholder="Password" />
              <label>Upload PDF documents such as tax certificate</label>
              <input type="file" accept=".pdf" />
              <button className="primary" type="button">Register Company</button>
            </form>
          </div>
        )}

        {tab === "otp" && (
          <form className="auth-form">
            <h2>Forgot Password Using OTP</h2>
            <input placeholder="Email address" />
            <button className="primary" type="button">Send OTP</button>
            <input placeholder="OTP code" />
            <input type="password" placeholder="New password" />
            <input type="password" placeholder="Confirm new password" />
            <button className="primary" type="button">Update Password</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Auth;