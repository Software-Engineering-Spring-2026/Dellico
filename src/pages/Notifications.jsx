import React, { useState, useEffect } from "react";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const currentUser = localStorage.getItem("currentUserEmail");

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  function loadNotifications() {
    const allNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
    const userNotifications = allNotifications.filter(n => n.to === currentUser);
    setNotifications(userNotifications);
  }

  function saveNotifications(updatedNotifications) {
    const allNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
    const otherNotifications = allNotifications.filter(n => n.to !== currentUser);
    const newAll = [...otherNotifications, ...updatedNotifications];
    localStorage.setItem("notifications", JSON.stringify(newAll));
    setNotifications(updatedNotifications);
  }

  function markAsRead(notificationId) {
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  }

  function markAllAsRead() {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  }

  function deleteNotification(notificationId) {
    const updated = notifications.filter(n => n.id !== notificationId);
    saveNotifications(updated);
  }

  function clearAll() {
    if (window.confirm("Delete all notifications?")) {
      saveNotifications([]);
    }
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  function getNotificationIcon(type) {
    switch(type) {
      case "invitation": return "📩";
      case "task_assignment": return "✅";
      case "flag": return "🚩";
      case "appeal": return "📝";
      case "linking_request": return "🔗";
      case "company_verification": return "🏢";
      case "message": return "💬";
      case "internship": return "💼";
      default: return "🔔";
    }
  }

  function getNotificationColor(type) {
    switch(type) {
      case "invitation": return "#3182ce";
      case "task_assignment": return "#38a169";
      case "flag": return "#e53e3e";
      case "appeal": return "#d69e2e";
      case "linking_request": return "#805ad5";
      case "company_verification": return "#319795";
      case "message": return "#3182ce";
      case "internship": return "#38a169";
      default: return "#4a5568";
    }
  }

  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  return (
    <div className="notifications-modern">
      {/* Header */}
      <div className="notifications-header-modern">
        <div className="header-left">
          <h1>Notifications</h1>
          <div className="header-stats">
            <span className="unread-count">{unreadCount}</span>
            <span className="unread-label">unread</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="action-btn mark-read" onClick={markAllAsRead}>
            📖 Mark all read
          </button>
          <button className="action-btn clear" onClick={clearAll}>
            🗑️ Clear all
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
          <span className="tab-count">{notifications.length}</span>
        </button>
        <button 
          className={`filter-tab ${filter === "unread" ? "active" : ""}`}
          onClick={() => setFilter("unread")}
        >
          Unread
          {unreadCount > 0 && <span className="tab-count unread">{unreadCount}</span>}
        </button>
        <button 
          className={`filter-tab ${filter === "read" ? "active" : ""}`}
          onClick={() => setFilter("read")}
        >
          Read
          <span className="tab-count">{notifications.filter(n => n.read).length}</span>
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="empty-state-modern">
          <div className="empty-icon">🔔</div>
          <h3>No notifications</h3>
          <p>You're all caught up! When you receive notifications, they'll appear here.</p>
        </div>
      ) : (
        <div className="notifications-list-modern">
          {filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-card ${!notification.read ? "unread" : ""}`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <div 
                className="notification-icon-modern" 
                style={{ backgroundColor: getNotificationColor(notification.type) + '15', color: getNotificationColor(notification.type) }}
              >
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-content-modern">
                <div className="notification-header">
                  <p className="notification-message-modern">{notification.message}</p>
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div className="notification-meta">
                  <span className="notification-time-modern">
                    {formatTime(notification.createdAt)}
                  </span>
                  {!notification.read && <span className="read-indicator">New</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;