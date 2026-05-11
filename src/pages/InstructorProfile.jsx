import { useState } from "react";

function InstructorProfile() {
  const saved = JSON.parse(localStorage.getItem("instructorProfile"));

  const [profile, setProfile] = useState(
    saved || {
      biography: "",
      research: "",
      education: "",
      pictureName: "",
    }
  );

  const [showProfile, setShowProfile] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  }

  function handleFileChange(e) {
    setProfile({
      ...profile,
      pictureName: e.target.files[0]?.name || "",
    });
  }

  function saveProfile() {
    if (!profile.biography || !profile.research || !profile.education) {
      setMessage("Please fill biography, research interests, and education.");
      return;
    }

    localStorage.setItem("instructorProfile", JSON.stringify(profile));
    setMessage("Profile saved successfully.");
    setShowProfile(true);
  }

  function viewProfile() {
    const savedProfile = JSON.parse(localStorage.getItem("instructorProfile"));

    if (!savedProfile) {
      setMessage("No saved profile found.");
      return;
    }

    setProfile(savedProfile);
    setShowProfile(true);
    setMessage("Viewing saved profile.");
  }

  function removeProfile() {
    localStorage.removeItem("instructorProfile");

    setProfile({
      biography: "",
      research: "",
      education: "",
      pictureName: "",
    });

    setShowProfile(false);
    setMessage("Profile removed successfully.");
  }

  return (
    <div className="project-form-card">
      <h2>Course Instructor Profile</h2>
      <p>Add, view, update, and remove instructor profile information.</p>

      <label>Short Biography</label>
      <textarea
        name="biography"
        value={profile.biography}
        onChange={handleChange}
        placeholder="Write short biography"
      />

      <label>Research Interests</label>
      <input
        name="research"
        value={profile.research}
        onChange={handleChange}
        placeholder="Example: UI/UX, software testing"
      />

      <label>Education Background</label>
      <input
        name="education"
        value={profile.education}
        onChange={handleChange}
        placeholder="Example: PhD in Computer Science"
      />

      <label>Upload Profile Picture</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      <div className="button-row">
        <button className="primary" type="button" onClick={saveProfile}>
          Add / Update
        </button>
        <button className="secondary-btn" type="button" onClick={viewProfile}>
          View
        </button>
        <button className="secondary-btn" type="button" onClick={removeProfile}>
          Remove
        </button>
      </div>

      {message && <p className="success-text">{message}</p>}

      {showProfile && (
        <section className="profile-section">
          <h3>Saved Instructor Profile</h3>
          <p><strong>Biography:</strong> {profile.biography}</p>
          <p><strong>Research Interests:</strong> {profile.research}</p>
          <p><strong>Education:</strong> {profile.education}</p>
          <p><strong>Picture:</strong> {profile.pictureName || "No picture uploaded"}</p>
        </section>
      )}
    </div>
  );
}

export default InstructorProfile;