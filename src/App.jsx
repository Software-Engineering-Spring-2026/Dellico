import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import "./App.css";

import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import CreateProject from "./pages/CreateProject";
import ProjectDetails from "./pages/ProjectDetails";
import ProjectWorkspace from "./pages/ProjectWorkspace";
import BrowseProjects from "./pages/BrowseProjects";
import BrowsePortfolios from "./pages/BrowsePortfolios";
import Favorites from "./pages/Favorites";
import Admin from "./pages/Admin";
import Employer from "./pages/Employer";
import Internships from "./pages/Internships";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import StudentProfile from "./pages/StudentProfile";
import InstructorProfile from "./pages/InstructorProfile";
import EmployerProfile from "./pages/EmployerProfile";
function Dashboard() {
  return (
    <div className="page-card">
      <h2>Dashboard</h2>
      <p>Main overview page.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />

        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/create-project" element={<Layout><CreateProject /></Layout>} />
        <Route path="/project-details" element={<Layout><ProjectDetails /></Layout>} />
        <Route path="/workspace" element={<Layout><ProjectWorkspace /></Layout>} />
        <Route path="/browse-projects" element={<Layout><BrowseProjects /></Layout>} />
        <Route path="/browse-portfolios" element={<Layout><BrowsePortfolios /></Layout>} />
        <Route path="/favorites" element={<Layout><Favorites /></Layout>} />
        <Route path="/admin" element={<Layout><Admin Panel  /></Layout>} />
        <Route path="/employer" element={<Layout><Employer /></Layout>} />
        <Route path="/internships" element={<Layout><Internships /></Layout>} />
        <Route path="/messages" element={<Layout><Messages /></Layout>} />
        <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
        <Route path="/student-profile" element={<Layout><StudentProfile /></Layout>} />
<Route path="/instructor-profile" element={<Layout><InstructorProfile /></Layout>} />
<Route path="/employer-profile" element={<Layout><EmployerProfile /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;