import { useState } from "react";

function Settings() {
  const [off, setOff] = useState(false);

  return (
    <div className="page-card wide-card">
      <h2>Notification Settings</h2>
      <p>Turn off all notifications.</p>

      <div className="settings-box">
        <div>
          <h3>All Notifications</h3>
          <p>Project updates, messages, internship updates, and system alerts.</p>
        </div>

        <label className="switch">
          <input type="checkbox" checked={off} onChange={() => setOff(!off)} />
          <span className="slider"></span>
        </label>
      </div>

      <div className={off ? "status-off" : "status-on"}>
        {off ? "All notifications are OFF" : "Notifications are ON"}
      </div>
    </div>
  );
}

export default Settings;