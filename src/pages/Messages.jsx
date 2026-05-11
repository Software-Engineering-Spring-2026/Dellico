import { useState, useEffect } from "react";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);
  
  const currentUser = localStorage.getItem("currentUserEmail");

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
    
    // Send notification
    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.push({
      id: Date.now(),
      to: selectedConversation.user,
      message: `💬 ${currentUser} sent you a message: "${newMessage.substring(0, 50)}${newMessage.length > 50 ? '...' : ''}"`,
      read: false,
      createdAt: new Date().toISOString(),
      type: "message"
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));
    
    setNewMessage("");
    loadMessages();
    
    const updatedConv = conversations.find(c => c.user === selectedConversation.user);
    if (updatedConv) {
      updatedConv.lastMessage = newMessage;
      updatedConv.lastMessageTime = message.timestamp;
      setConversations([...conversations]);
    }
  }

  function selectConversation(conversation) {
    setSelectedConversation(conversation);
    setShowNewChat(false);
    
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
      userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
      lastMessage: "",
      lastMessageTime: new Date().toISOString(),
      unread: false
    };
    setSelectedConversation(newConv);
    setShowNewChat(false);
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
    `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="messages-container-modern">
      <h1>Messages</h1>
      
      <div className="messages-layout-modern">
        {/* Conversations Sidebar */}
        <div className="conversations-sidebar-modern">
          <div className="conversations-header-modern">
            <h3>Conversations</h3>
            <button className="new-chat-btn-modern" onClick={() => setShowNewChat(true)}>
              + New
            </button>
          </div>
          
          <div className="conversations-list-modern">
            {conversations.length === 0 ? (
              <div className="no-conversations-modern">
                <p>💬 No conversations yet</p>
                <p className="sub-text">Click "New" to start a chat</p>
              </div>
            ) : (
              conversations.map(conv => (
                <div 
                  key={conv.user} 
                  className={`conversation-item-modern ${selectedConversation?.user === conv.user ? "active" : ""}`}
                  onClick={() => selectConversation(conv)}
                >
                  <div className="conv-avatar-modern">
                    {conv.user.charAt(0).toUpperCase()}
                  </div>
                  <div className="conv-info-modern">
                    <div className="conv-name-modern">{conv.user}</div>
                    <div className="conv-preview-modern">
                      {conv.lastMessage?.substring(0, 35)}{conv.lastMessage?.length > 35 ? '...' : ''}
                    </div>
                  </div>
                  {conv.unread && <div className="unread-dot-modern"></div>}
                </div>
              ))
            )}
          </div>
        </div>

        {/* New Chat Modal */}
        {showNewChat && (
          <div className="modal-overlay-modern" onClick={() => setShowNewChat(false)}>
            <div className="modal-content-modern" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-modern">
                <h3>Start New Conversation</h3>
                <button className="close-btn-modern" onClick={() => setShowNewChat(false)}>✕</button>
              </div>
              <input 
                type="text" 
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-modern"
              />
              <div className="users-list-modern">
                {filteredUsers.length === 0 ? (
                  <p className="no-users">No users found</p>
                ) : (
                  filteredUsers.map(user => (
                    <div key={user.email} className="user-item-modern" onClick={() => startNewConversation(user)}>
                      <div className="user-avatar-modern">
                        {user.firstName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-info-modern">
                        <div className="user-name-modern">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="user-email-modern">{user.email}</div>
                        <div className="user-role-modern">
                          {user.role === "student" ? "🎓 Student" : 
                           user.role === "instructor" ? "👨‍🏫 Instructor" : 
                           user.role === "employer" ? "🏢 Employer" : "👑 Admin"}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="chat-area-modern">
          {!selectedConversation ? (
            <div className="no-chat-selected-modern">
              <div className="chat-placeholder">
                <span>💬</span>
                <h3>No conversation selected</h3>
                <p>Select a conversation from the list or start a new chat</p>
              </div>
            </div>
          ) : (
            <>
              <div className="chat-header-modern">
                <div className="chat-user-modern">
                  <div className="chat-avatar-modern">
                    {selectedConversation.user.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3>{selectedConversation.userName || selectedConversation.user}</h3>
                  </div>
                </div>
              </div>

              <div className="chat-messages-modern">
                {getConversationMessages().length === 0 ? (
                  <div className="no-messages">
                    <p>No messages yet</p>
                    <p>Send a message to start the conversation</p>
                  </div>
                ) : (
                  getConversationMessages().map(msg => (
                    <div key={msg.id} className={`message-modern ${msg.from === currentUser ? "sent" : "received"}`}>
                      <div className="message-bubble-modern">
                        <p>{msg.message}</p>
                        <span className="message-time-modern">{formatTime(msg.timestamp)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="chat-input-area-modern">
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