import { useState } from 'react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New internship application from Ahmed Hassan', type: 'info', read: false, time: '5 min ago' },
    { id: 2, message: 'Your project has been flagged for review', type: 'warning', read: false, time: '1 hour ago' },
    { id: 3, message: 'Course instructor assigned to your project', type: 'success', read: true, time: '2 hours ago' },
    { id: 4, message: 'New message from Fatima Ali', type: 'info', read: true, time: '3 hours ago' }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getBackgroundColor = (type) => {
    switch(type) {
      case 'success': return '#d4edda';
      case 'warning': return '#fff3cd';
      case 'error': return '#f8d7da';
      default: return '#d1ecf1';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>🔔 Notifications {unreadCount > 0 && <span style={{ background: '#dc3545', color: 'white', padding: '2px 8px', borderRadius: '50%', fontSize: '14px' }}>{unreadCount}</span>}</h1>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} style={{ background: '#1976d2', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
            Mark all as read
          </button>
        )}
      </div>

      <div>
        {notifications.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999' }}>No notifications</p>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              style={{
                background: getBackgroundColor(notif.type),
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '8px',
                border: `2px solid ${notif.read ? '#ddd' : '#1976d2'}`,
                cursor: 'pointer',
                opacity: notif.read ? 0.7 : 1
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 5px 0', fontWeight: notif.read ? 'normal' : 'bold' }}>
                    {notif.message}
                  </p>
                  <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                    {notif.read ? '✓ Read' : '● Unread'} · {notif.time}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notif.id);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#999',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}