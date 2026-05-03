import { useState } from 'react';

export default function Messages() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'Ahmed Hassan', subject: 'Internship Application', preview: 'Hi, I am interested in...', time: '2 hours ago', read: false },
    { id: 2, from: 'Fatima Ali', subject: 'Project Collaboration', preview: 'Would you like to collaborate...', time: '5 hours ago', read: true },
    { id: 3, from: 'Dr. Karim', subject: 'Course Updates', preview: 'The project deadline has been...', time: '1 day ago', read: true }
  ]);

  const [selectedMessage, setSelectedMessage] = useState(null);

  const markAsRead = (id) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    ));
  };

  return (
    <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
      <div>
        <h2>💬 Messages</h2>
        <div style={{ background: '#f9f9f9', borderRadius: '8px', overflow: 'hidden' }}>
          {messages.map(msg => (
            <div
              key={msg.id}
              onClick={() => {
                setSelectedMessage(msg);
                markAsRead(msg.id);
              }}
              style={{
                padding: '12px',
                borderBottom: '1px solid #ddd',
                cursor: 'pointer',
                background: selectedMessage?.id === msg.id ? '#e3f2fd' : 'transparent',
                fontWeight: msg.read ? 'normal' : 'bold'
              }}
            >
              <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                {msg.from}
                {!msg.read && <span style={{ background: '#1976d2', color: 'white', padding: '2px 6px', borderRadius: '3px', fontSize: '11px', marginLeft: '8px' }}>New</span>}
              </p>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>{msg.subject}</p>
              <p style={{ margin: '0', fontSize: '12px', color: '#999' }}>{msg.time}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        {selectedMessage ? (
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
            <h3>{selectedMessage.subject}</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>From: <strong>{selectedMessage.from}</strong></p>
            <hr />
            <p>{selectedMessage.preview}</p>
            <div style={{ marginTop: '20px' }}>
              <textarea placeholder="Type your reply..." style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '100px', boxSizing: 'border-box' }} />
              <button style={{ background: '#1976d2', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', marginTop: '10px', fontWeight: 'bold' }}>
                Send Reply
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
            Select a message to view
          </div>
        )}
      </div>
    </div>
  );
}
