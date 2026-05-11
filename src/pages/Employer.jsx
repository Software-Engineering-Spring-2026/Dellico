function EmployerProfile() {
  return (
    <div className="page-card wide-card">
      <h2>Employer Company Profile</h2>
      <p>Add, view, update, and remove employer company information.</p>

      <section className="profile-section">
        <textarea placeholder="Short company biography" />
        <input placeholder="Company address" />
        <input placeholder="Contact information" />
        <input placeholder="Google Maps location link" />

        <label>Upload company logo</label>
        <input type="file" accept="image/*" />

        <label>Upload PDF documents such as tax certificate</label>
        <input type="file" accept=".pdf" />

        <button className="primary">Save Employer Profile</button>
        <button className="secondary-btn">Set Google Maps Location</button>
        <button className="secondary-btn">Remove Information</button>
      </section>
    </div>
  );
}

export default EmployerProfile;