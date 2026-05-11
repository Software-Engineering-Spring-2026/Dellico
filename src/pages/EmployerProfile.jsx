import { useState } from "react";

function EmployerProfile() {
  const [companyProfile, setCompanyProfile] = useState({
    biography: "",
    address: "",
    contact: "",
    mapsLink: "",
    logo: null,
    documents: null,
  });

  const [savedProfile, setSavedProfile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCompanyProfile({
      ...companyProfile,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    setCompanyProfile({
      ...companyProfile,
      [name]: files[0],
    });
  };

  const handleSave = () => {
    setSavedProfile(companyProfile);

    localStorage.setItem(
      "employerProfile",
      JSON.stringify(companyProfile)
    );
  };

  const handleRemove = () => {
    setCompanyProfile({
      biography: "",
      address: "",
      contact: "",
      mapsLink: "",
      logo: null,
      documents: null,
    });

    setSavedProfile(null);

    localStorage.removeItem("employerProfile");
  };

  return (
    <div className="project-form-card">
      <h2>Employer Company Profile</h2>

      <p>
        Manage company profile, location, logo,
        verification documents, internships, and applicants.
      </p>

      <label>Short Company Biography</label>

      <textarea
        name="biography"
        placeholder="Write a short company biography"
        value={companyProfile.biography}
        onChange={handleChange}
      />

      <label>Company Address</label>

      <input
        type="text"
        name="address"
        placeholder="Enter company address"
        value={companyProfile.address}
        onChange={handleChange}
      />

      <label>Contact Information</label>

      <input
        type="text"
        name="contact"
        placeholder="Enter contact email or phone number"
        value={companyProfile.contact}
        onChange={handleChange}
      />

      <label>Google Maps Location Link</label>

      <input
        type="text"
        name="mapsLink"
        placeholder="Paste Google Maps location link"
        value={companyProfile.mapsLink}
        onChange={handleChange}
      />

      <label>Upload Company Logo</label>

      <input
        type="file"
        name="logo"
        accept="image/*"
        onChange={handleFileChange}
      />

      <label>
        Upload PDF Documents such as Tax Certificate
      </label>

      <input
        type="file"
        name="documents"
        accept="application/pdf"
        onChange={handleFileChange}
      />

      <div className="button-row">
        <button
          className="primary"
          type="button"
          onClick={handleSave}
        >
          Add / View / Update
        </button>

        <button
          className="secondary-btn"
          type="button"
        >
          Set Google Maps Location
        </button>

        <button
          className="secondary-btn"
          type="button"
          onClick={handleRemove}
        >
          Remove
        </button>
      </div>

      {savedProfile && (
        <section className="profile-section">
          <h3>Saved Company Profile</h3>

          <p>
            <strong>Biography:</strong>{" "}
            {savedProfile.biography}
          </p>

          <p>
            <strong>Address:</strong>{" "}
            {savedProfile.address}
          </p>

          <p>
            <strong>Contact:</strong>{" "}
            {savedProfile.contact}
          </p>

          <p>
            <strong>Google Maps Link:</strong>{" "}
            {savedProfile.mapsLink}
          </p>

          <p>
            <strong>Company Logo:</strong>{" "}
            {savedProfile.logo?.name || "No logo uploaded"}
          </p>

          <p>
            <strong>Verification Documents:</strong>{" "}
            {savedProfile.documents?.name ||
              "No documents uploaded"}
          </p>
        </section>
      )}
    </div>
  );
}

export default EmployerProfile;