import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [registerRole, setRegisterRole] = useState("student");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const [login, setLogin] = useState({ email: "", password: "" });

  const [register, setRegister] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    password: "",
    document: null,
  });

  const [reset, setReset] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const adminAccount = {
    email: "admin@guc.edu.eg",
    password: "Admin@123",
    role: "admin",
  };

  function getUsers() {
    const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const oldUser = JSON.parse(localStorage.getItem("registeredUser"));

    if (oldUser && !users.some((u) => u.email === oldUser.email)) {
      users.push(oldUser);
      localStorage.setItem("registeredUsers", JSON.stringify(users));
    }

    return users;
  }

  function saveUsers(users) {
    localStorage.setItem("registeredUsers", JSON.stringify(users));
  }

  function isStrongPassword(password) {
    return password.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }

  function handleRegisterChange(e) {
    const { name, value, files } = e.target;
    setRegister({
      ...register,
      [name]: files ? files[0] : value,
    });
  }

  function registerAccount() {
    setError("");
    setMessage("");

    if (!register.email || !register.password) {
      setError("Please enter email and password.");
      return;
    }

    if (!isStrongPassword(register.password)) {
      setError("Password must be at least 8 characters and include a special character.");
      return;
    }

    if (registerRole === "student" && !register.email.endsWith("@student.guc.edu.eg")) {
      setError("Student email must be like example@student.guc.edu.eg");
      return;
    }

    if (registerRole === "instructor" && !register.email.endsWith("@guc.edu.eg")) {
      setError("Course instructor email must be like example@guc.edu.eg");
      return;
    }

    if (
      registerRole === "employer" &&
      !(
        register.email.endsWith("@gmail.com") ||
        register.email.endsWith("@hotmail.com") ||
        register.email.endsWith("@yahoo.com")
      )
    ) {
      setError("Employer email must be Gmail, Hotmail, or Yahoo.");
      return;
    }

    if (registerRole === "employer" && !register.document) {
      setError("Employer must upload PDF verification document.");
      return;
    }

    const users = getUsers();

    if (users.some((u) => u.email === register.email)) {
      setError("This email is already registered.");
      return;
    }

    const newUser = {
      firstName: register.firstName,
      lastName: register.lastName,
      companyName: register.companyName,
      email: register.email,
      password: register.password,
      role: registerRole,
      documentName: register.document?.name || "",
      verificationStatus: registerRole === "employer" ? "Pending" : "Accepted",
    };

    saveUsers([...users, newUser]);
    localStorage.setItem("registeredUser", JSON.stringify(newUser));

    setMessage("Account registered successfully. You can now login.");
    setMode("login");
  }

  function handleLogin() {
    setError("");
    setMessage("");

    if (login.email === adminAccount.email && login.password === adminAccount.password) {
      localStorage.setItem("role", "admin");
      localStorage.setItem("currentUserEmail", login.email);
      navigate("/admin");
      return;
    }

    const users = getUsers();
    const found = users.find(
      (u) => u.email === login.email && u.password === login.password
    );

    if (!found) {
      setError("Email or password is incorrect, or account is not registered.");
      return;
    }

    localStorage.setItem("role", found.role);
    localStorage.setItem("currentUserEmail", found.email);

    if (found.role === "student") navigate("/student-profile");
    if (found.role === "instructor") navigate("/instructor-profile");
    if (found.role === "employer") navigate("/employer-profile");
  }

  function sendOtp() {
    setError("");
    const users = getUsers();
    const found = users.find((u) => u.email === reset.email);

    if (!found && reset.email !== adminAccount.email) {
      setError("Email is not registered.");
      return;
    }

    const code = "123456";
    setGeneratedOtp(code);
    setMessage(`OTP sent successfully. Prototype OTP is: ${code}`);
  }

  function resetPassword() {
    setError("");

    if (reset.otp !== generatedOtp) {
      setError("Wrong OTP.");
      return;
    }

    if (!isStrongPassword(reset.newPassword)) {
      setError("Password must be at least 8 characters and include a special character.");
      return;
    }

    const users = getUsers();
    const updatedUsers = users.map((u) =>
      u.email === reset.email ? { ...u, password: reset.newPassword } : u
    );

    saveUsers(updatedUsers);
    setMessage("Password updated successfully. You can login now.");
    setMode("login");
  }

  return (
    <div className="auth-page-modern">
      <div className="auth-container">
        <div className="auth-card-modern">
          <div className="auth-logo">
            <h1>Dellico</h1>
            <p>GUC Project Portfolio Platform</p>
          </div>

          {mode === "login" && (
            <div className="auth-form-modern">
              <h2>Welcome Back</h2>
              <p className="auth-subtitle">Login to access your dashboard</p>

              <input
                type="email"
                placeholder="Email Address"
                value={login.email}
                onChange={(e) => setLogin({ ...login, email: e.target.value })}
              />

              <input
                type="password"
                placeholder="Password"
                value={login.password}
                onChange={(e) => setLogin({ ...login, password: e.target.value })}
              />

              <button className="auth-btn-primary" onClick={handleLogin}>
                Login
              </button>

              <button className="auth-link-btn" onClick={() => setMode("forgot")}>
                Forgot your password?
              </button>

              <div className="auth-divider">
                <span>Don't have an account?</span>
              </div>

              <button className="auth-btn-secondary" onClick={() => setMode("register")}>
                Create New Account
              </button>
            </div>
          )}

          {mode === "register" && (
            <div className="auth-form-modern">
              <h2>Create Account</h2>
              <p className="auth-subtitle">Join Dellico platform</p>

              <div className="auth-role-buttons-modern">
                <button
                  className={registerRole === "student" ? "role-active" : "role-btn"}
                  onClick={() => setRegisterRole("student")}
                >
                  🎓 Student
                </button>
                <button
                  className={registerRole === "instructor" ? "role-active" : "role-btn"}
                  onClick={() => setRegisterRole("instructor")}
                >
                  👨‍🏫 Instructor
                </button>
                <button
                  className={registerRole === "employer" ? "role-active" : "role-btn"}
                  onClick={() => setRegisterRole("employer")}
                >
                  🏢 Employer
                </button>
              </div>

              {registerRole !== "employer" ? (
                <>
                  <div className="form-row-modern">
                    <input name="firstName" placeholder="First Name" onChange={handleRegisterChange} />
                    <input name="lastName" placeholder="Last Name" onChange={handleRegisterChange} />
                  </div>
                  <input
                    name="email"
                    placeholder={registerRole === "student" ? "student@student.guc.edu.eg" : "name@guc.edu.eg"}
                    onChange={handleRegisterChange}
                  />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password (min 8 chars + special character)"
                    onChange={handleRegisterChange}
                  />
                </>
              ) : (
                <>
                  <input name="companyName" placeholder="Company Name" onChange={handleRegisterChange} />
                  <input name="email" placeholder="company@gmail.com" onChange={handleRegisterChange} />
                  <input name="password" type="password" placeholder="Password" onChange={handleRegisterChange} />
                  <div className="file-upload-modern">
                    <label>Verification Document (PDF)</label>
                    <input name="document" type="file" accept="application/pdf" onChange={handleRegisterChange} />
                  </div>
                </>
              )}

              <button className="auth-btn-primary" onClick={registerAccount}>
                Register
              </button>

              <div className="auth-divider">
                <span>Already have an account?</span>
              </div>

              <button className="auth-btn-secondary" onClick={() => setMode("login")}>
                Back to Login
              </button>
            </div>
          )}

          {mode === "forgot" && (
            <div className="auth-form-modern">
              <h2>Reset Password</h2>
              <p className="auth-subtitle">We'll send you an OTP to reset your password</p>

              <input
                placeholder="Enter your registered email"
                value={reset.email}
                onChange={(e) => setReset({ ...reset, email: e.target.value })}
              />

              <button className="auth-btn-secondary" onClick={sendOtp}>
                Send OTP
              </button>

              <input
                placeholder="Enter OTP"
                value={reset.otp}
                onChange={(e) => setReset({ ...reset, otp: e.target.value })}
              />

              <input
                type="password"
                placeholder="New password"
                value={reset.newPassword}
                onChange={(e) => setReset({ ...reset, newPassword: e.target.value })}
              />

              <button className="auth-btn-primary" onClick={resetPassword}>
                Update Password
              </button>

              <button className="auth-link-btn" onClick={() => setMode("login")}>
                Back to Login
              </button>
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}
          {message && <div className="auth-success">{message}</div>}
        </div>
      </div>
    </div>
  );
}

export default Auth;