import { useState, useEffect } from "react";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  
  const currentUser = localStorage.getItem("currentUserEmail");
  const role = localStorage.getItem("role");

  useEffect(() => {
    loadMessages();
    loadUsers();
  }, []);

  function loadMessages() {
    const allMessages = JSON.parse(localStorage.getItem("privateMessages")) || [];
    const userMessages = allMessages.filter(m => 
      m.from === currentUser || m.to === currentUser
    );
    setMessages(userMessages);
    
    // Build conversations
    const convMap = new Map();
    userMessages.forEach(msg => {
      const otherUser = msg.from === currentUser ? msg.to : msg.from;
      if (!convMap.has(otherUser)) {
        convMap.set(otherUser, {
          user: otherUser,
          lastMessage: msg.message,
          lastMessageTime: msg.timestamp,
          unread: msg.to === currentUser && !msg.read
        });
      }
    });
    setConversations(Array.from(convMap.values()));
  }

  function loadUsers() {
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const otherUsers = registeredUsers.filter(u => u.email !== currentUser);
    setUsers(otherUsers);
  }

  function sendMessage() {
    if (!newMessage.trim()) return;
    if (!selectedConversation) return;

    const allMessages = JSON.parse(localStorage.getItem("privateMessages")) || [];
    
    const message = {
      id: Date.now(),
      from: currentUser,
      to: selectedConversation.user,
      message: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    allMessages.push(message);
    localStorage.setItem("privateMessages", JSON.stringify(allMessages));
    
    // ✅ REQ 28-30: Receive notification when private message received
    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.push({
      id: Date.now(),
      to: selectedConversation.user,
      message: `${currentUser} sent you a private message: "${newMessage.substring(0, 50)}${newMessage.length > 50 ? '...' : ''}"`,
      read: false,
      createdAt: new Date().toISOString(),
      type: "message"
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));
    
    setNewMessage("");
    loadMessages();
    
    // Update the selected conversation with new message
    const updatedConv = conversations.find(c => c.user === selectedConversation.user);
    if (updatedConv) {
      updatedConv.lastMessage = newMessage;
      updatedConv.lastMessageTime = message.timestamp;
      setConversations([...conversations]);
    }
  }

  function selectConversation(conversation) {
    setSelectedConversation(conversation);
    
    // Mark messages as read
    const allMessages = JSON.parse(localStorage.getItem("privateMessages")) || [];
    const updatedMessages = allMessages.map(m => {
      if (m.from === conversation.user && m.to === currentUser && !m.read) {
        return { ...m, read: true };
      }
      return m;
    });
    localStorage.setItem("privateMessages", JSON.stringify(updatedMessages));
    loadMessages();
  }

  function startNewConversation(user) {
    const newConv = {
      user: user.email,
      lastMessage: "",
      lastMessageTime: new Date().toISOString(),
      unread: false
    };
    setSelectedConversation(newConv);
    setNewMessage("");
  }

  function getConversationMessages() {
    if (!selectedConversation) return [];
    return messages.filter(m => 
      (m.from === currentUser && m.to === selectedConversation.user) ||
      (m.from === selectedConversation.user && m.to === currentUser)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = (now - date) / (1000 * 3600 * 24);
    
    if (diffDays < 1) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'short' });
    return date.toLocaleDateString();
  }

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="messages-container">
      <h1>Messages</h1>
      
      <div className="messages-layout">
        {/* Conversations Sidebar */}
        <div className="conversations-sidebar">
          <div className="conversations-header">
            <h3>Conversations</h3>
            <button className="new-chat-btn" onClick={() => setSelectedConversation({ new: true })}>+ New</button>
          </div>
          
          <div className="conversations-list">
            {conversations.length === 0 ? (
              <p className="no-conversations">No conversations yet. Start a new chat!</p>
            ) : (
              conversations.map(conv => (
                <div 
                  key={conv.user} 
                  className={`conversation-item ${selectedConversation?.user === conv.user ? "active" : ""}`}
                  onClick={() => selectConversation(conv)}
                >
                  <div className="conv-avatar">
                    {conv.user.charAt(0).toUpperCase()}
                  </div>
                  <div className="conv-info">
                    <div className="conv-name">{conv.user}</div>
                    <div className="conv-preview">{conv.lastMessage?.substring(0, 30)}</div>
                  </div>
                  {conv.unread && <div className="unread-dot"></div>}
                </div>
              ))
            )}
          </div>
        </div>

        {/* New Chat Modal */}
        {selectedConversation?.new && (
          <div className="new-chat-modal">
            <div className="modal-header">
              <h3>Start New Conversation</h3>
              <button className="close-btn" onClick={() => setSelectedConversation(null)}>✕</button>
            </div>
            <input 
              type="text" 
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <div className="users-list">
              {filteredUsers.map(user => (
                <div key={user.email} className="user-item" onClick={() => startNewConversation(user)}>
                  <div className="user-avatar">{user.firstName?.charAt(0) || user.email.charAt(0)}</div>
                  <div className="user-info">
                    <div className="user-name">{user.firstName} {user.lastName}</div>
                    <div className="user-email">{user.email}</div>
                    <div className="user-role">{user.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="chat-area">
          {!selectedConversation || selectedConversation.new ? (
            <div className="no-chat-selected">
              <p>Select a conversation or start a new chat</p>
            </div>
          ) : (
            <>
              <div className="chat-header">
                <div className="chat-user">
                  <div className="chat-avatar">{selectedConversation.user.charAt(0).toUpperCase()}</div>
                  <div>
                    <h3>{selectedConversation.user}</h3>
                  </div>
                </div>
              </div>

              <div className="chat-messages">
                {getConversationMessages().map(msg => (
                  <div key={msg.id} className={`message ${msg.from === currentUser ? "sent" : "received"}`}>
                    <div className="message-bubble">
                      <p>{msg.message}</p>
                      <span className="message-time">{formatTime(msg.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="chat-input-area">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;