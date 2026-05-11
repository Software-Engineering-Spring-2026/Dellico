import { useState, useEffect } from "react";

function Settings() {
  const [notificationsOff, setNotificationsOff] = useState(false);
  const currentUser = localStorage.getItem("currentUserEmail");

  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem("notificationSettings")) || {};
    setNotificationsOff(settings[currentUser] || false);
  }, []);

  function toggleNotifications() {
    const newState = !notificationsOff;
    setNotificationsOff(newState);
    
    const settings = JSON.parse(localStorage.getItem("notificationSettings")) || {};
    settings[currentUser] = newState;
    localStorage.setItem("notificationSettings", JSON.stringify(settings));
  }

  // Override notification creation based on settings
  window.originalPushNotification = window.originalPushNotification || (() => {});
  
  return (
    <div className="settings-container">
      <h1>Settings</h1>
      
      <div className="settings-card">
        <h2>🔔 Notification Settings</h2>
        <div className="setting-item">
          <div className="setting-info">
            <h3>All Notifications</h3>
            <p>Turn off all notifications - you won't receive any alerts from the platform</p>
          </div>
          <label className="switch">
            <input type="checkbox" checked={notificationsOff} onChange={toggleNotifications} />
            <span className="slider round"></span>
          </label>
        </div>
        <div className={`notification-status ${notificationsOff ? "off" : "on"}`}>
          {notificationsOff ? "🔕 All notifications are OFF" : "🔔 Notifications are ON"}
        </div>
      </div>

      <div className="settings-card">
        <h2>👤 Account Settings</h2>
        <p>Email: {currentUser}</p>
        <button className="secondary-btn" onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}>Logout</button>
      </div>
    </div>
  );
}

export default Settings;