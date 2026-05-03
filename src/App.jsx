import { useState } from 'react'
import './App.css'
import Admin from './components/Admin.jsx'
import Employer from './components/Employer.jsx'
import Messages from './components/Messages.jsx'
import Notifications from './components/Notifications.jsx'
import Internships from './components/Internships.jsx'

function App() {
  const [currentPage, setCurrentPage] = useState('admin')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <nav style={{
        backgroundColor: '#1976d2',
        padding: '15px 20px',
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: '0 0 15px 0', fontSize: '24px' }}>Student 4 - Admin & Employer Dashboard</h1>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCurrentPage('admin')}
              style={{
                padding: '10px 15px',
                backgroundColor: currentPage === 'admin' ? '#1565c0' : 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              📊 Admin
            </button>
            <button
              onClick={() => setCurrentPage('employer')}
              style={{
                padding: '10px 15px',
                backgroundColor: currentPage === 'employer' ? '#1565c0' : 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🏢 Employer
            </button>
            <button
              onClick={() => setCurrentPage('internships')}
              style={{
                padding: '10px 15px',
                backgroundColor: currentPage === 'internships' ? '#1565c0' : 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              💼 Internships
            </button>
            <button
              onClick={() => setCurrentPage('messages')}
              style={{
                padding: '10px 15px',
                backgroundColor: currentPage === 'messages' ? '#1565c0' : 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              💬 Messages
            </button>
            <button
              onClick={() => setCurrentPage('notifications')}
              style={{
                padding: '10px 15px',
                backgroundColor: currentPage === 'notifications' ? '#1565c0' : 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🔔 Notifications
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
        {currentPage === 'admin' && <Admin />}
        {currentPage === 'employer' && <Employer />}
        {currentPage === 'internships' && <Internships />}
        {currentPage === 'messages' && <Messages />}
        {currentPage === 'notifications' && <Notifications />}
      </div>
    </div>
  )
}

export default App
