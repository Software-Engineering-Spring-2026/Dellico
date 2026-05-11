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
  const [activeSection, setActiveSection] = useState("basic");

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
    localStorage.setItem("employerProfile", JSON.stringify(companyProfile));
    // Show success message
    const successMsg = document.querySelector(".success-text");
    if (successMsg) successMsg.style.display = "block";
    setTimeout(() => {
      if (successMsg) successMsg.style.display = "none";
    }, 3000);
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
    <div className="employer-profile-modern">
      {/* Header */}
      <div className="profile-header">
        <h1>Company Profile</h1>
        <p>Manage your company information, location, and verification documents</p>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeSection === "basic" ? "active" : ""}`}
          onClick={() => setActiveSection("basic")}
        >
          <span className="tab-icon">🏢</span>
          Basic Info
        </button>
        <button 
          className={`tab-btn ${activeSection === "location" ? "active" : ""}`}
          onClick={() => setActiveSection("location")}
        >
          <span className="tab-icon">📍</span>
          Location
        </button>
        <button 
          className={`tab-btn ${activeSection === "documents" ? "active" : ""}`}
          onClick={() => setActiveSection("documents")}
        >
          <span className="tab-icon">📄</span>
          Documents
        </button>
        <button 
          className={`tab-btn ${activeSection === "preview" ? "active" : ""}`}
          onClick={() => setActiveSection("preview")}
        >
          <span className="tab-icon">👁️</span>
          Preview
        </button>
      </div>

      {/* Basic Info Section */}
      {activeSection === "basic" && (
        <div className="profile-section-modern">
          <div className="section-header">
            <h2>Basic Information</h2>
            <p>Essential information about your company</p>
          </div>

          <div className="form-group">
            <label>Short Company Biography</label>
            <textarea
              name="biography"
              value={companyProfile.biography}
              onChange={handleChange}
              placeholder="Tell us about your company, its mission, and values..."
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Company Address</label>
              <input
                type="text"
                name="address"
                value={companyProfile.address}
                onChange={handleChange}
                placeholder="123 Business St, City, Country"
              />
            </div>

            <div className="form-group">
              <label>Contact Information</label>
              <input
                type="text"
                name="contact"
                value={companyProfile.contact}
                onChange={handleChange}
                placeholder="Email: contact@company.com | Phone: +1234567890"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Company Logo</label>
            <div className="file-upload-area">
              <input
                type="file"
                name="logo"
                accept="image/*"
                onChange={handleFileChange}
                id="logo-upload"
                style={{ display: "none" }}
              />
              <label htmlFor="logo-upload" className="upload-btn">
                <span>📷</span>
                {companyProfile.logo ? companyProfile.logo.name : "Choose Company Logo"}
              </label>
              {companyProfile.logo && (
                <span className="file-name">{companyProfile.logo.name}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Location Section */}
      {activeSection === "location" && (
        <div className="profile-section-modern">
          <div className="section-header">
            <h2>Location Settings</h2>
            <p>Set your company location on Google Maps</p>
          </div>

          <div className="form-group">
            <label>Google Maps Location Link</label>
            <div className="input-with-button">
              <input
                type="text"
                name="mapsLink"
                value={companyProfile.mapsLink}
                onChange={handleChange}
                placeholder="https://maps.google.com/?q=..."
              />
              <button className="secondary-btn" onClick={() => {
                if (companyProfile.mapsLink) {
                  window.open(companyProfile.mapsLink, "_blank");
                }
              }}>
                <span>🗺️</span> View Map
              </button>
            </div>
          </div>

          <div className="map-preview">
            <div className="map-placeholder">
              {companyProfile.mapsLink ? (
                <iframe
                  src={companyProfile.mapsLink.replace("/place/", "/embed/")}
                  title="Map Preview"
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: "12px" }}
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <div className="map-empty">
                  <span>🗺️</span>
                  <p>No location set yet</p>
                  <small>Add a Google Maps link to see preview</small>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Documents Section */}
      {activeSection === "documents" && (
        <div className="profile-section-modern">
          <div className="section-header">
            <h2>Verification Documents</h2>
            <p>Upload documents to verify your company identity</p>
          </div>

          <div className="form-group">
            <label>Tax Certificate / Commercial Registration</label>
            <div className="file-upload-area documents">
              <input
                type="file"
                name="documents"
                accept="application/pdf"
                onChange={handleFileChange}
                id="doc-upload"
                style={{ display: "none" }}
              />
              <label htmlFor="doc-upload" className="upload-btn large">
                <span>📎</span>
                {companyProfile.documents ? companyProfile.documents.name : "Upload PDF Document"}
              </label>
              {companyProfile.documents && (
                <div className="document-info">
                  <span className="file-name">{companyProfile.documents.name}</span>
                  <span className="file-size">
                    {(companyProfile.documents.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              )}
            </div>
            <p className="helper-text">
              Accepted formats: PDF. Maximum size: 5MB. This document will be reviewed by administrators.
            </p>
          </div>
        </div>
      )}

      {/* Preview Section */}
      {activeSection === "preview" && savedProfile && (
        <div className="profile-section-modern preview">
          <div className="section-header">
            <h2>Profile Preview</h2>
            <p>How your company profile appears to others</p>
          </div>

          <div className="preview-card">
            {savedProfile.logo && (
              <div className="preview-logo">
                <span>🏢</span>
              </div>
            )}
            <div className="preview-content">
              <h3>Company Information</h3>
              <div className="preview-field">
                <strong>Biography:</strong>
                <p>{savedProfile.biography || "Not provided"}</p>
              </div>
              <div className="preview-field">
                <strong>Address:</strong>
                <p>{savedProfile.address || "Not provided"}</p>
              </div>
              <div className="preview-field">
                <strong>Contact:</strong>
                <p>{savedProfile.contact || "Not provided"}</p>
              </div>
              {savedProfile.mapsLink && (
                <div className="preview-field">
                  <strong>Location:</strong>
                  <a href={savedProfile.mapsLink} target="_blank">View on Map →</a>
                </div>
              )}
              {savedProfile.documents && (
                <div className="preview-field">
                  <strong>Verification Document:</strong>
                  <span>{savedProfile.documents.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeSection === "preview" && !savedProfile && (
        <div className="profile-section-modern empty-preview">
          <div className="empty-icon">👈</div>
          <h3>No Profile Data</h3>
          <p>Fill in your company information in the other tabs and click Save to see a preview.</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons-modern">
        <button className="save-btn" onClick={handleSave}>
          <span>💾</span>
          Save Profile
        </button>
        <button className="remove-btn" onClick={handleRemove}>
          <span>🗑️</span>
          Remove All Data
        </button>
      </div>

      <div className="success-text" style={{ display: "none", textAlign: "center", marginTop: "20px" }}>
        ✓ Profile saved successfully!
      </div>
    </div>
  );
}

export default EmployerProfile;