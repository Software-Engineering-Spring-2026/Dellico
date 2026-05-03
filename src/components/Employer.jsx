import { useState } from 'react';

export default function Employer() {
  const [students] = useState([
    { id: 1, name: 'Ahmed Hassan', email: 'ahmed@guc.edu.eg', skills: 'React, Node.js' },
    { id: 2, name: 'Fatima Ali', email: 'fatima@guc.edu.eg', skills: 'Python, Django' }
  ]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>🏢 Employer Dashboard</h1>

      <div style={{ marginBottom: '30px', background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
        <h2>➕ Create Internship</h2>
        <form>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Internship Title</label>
              <input type="text" placeholder="e.g., React Developer" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Duration (Months)</label>
              <input type="number" placeholder="3" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Job Description</label>
            <textarea placeholder="Enter job details..." style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '100px', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '15px' }}>
            Post Internship
          </button>
        </form>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>🔍 Search Students</h2>
        <div style={{ marginBottom: '15px' }}>
          <input type="text" placeholder="Search by name or email..." style={{ width: '100%', maxWidth: '400px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }} />
          <button style={{ background: '#1976d2', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', marginLeft: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
            Search
          </button>
        </div>

        <h3>📋 Available Students</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Email</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Skills</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{student.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{student.email}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{student.skills}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                  <button style={{ background: '#1976d2', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', marginRight: '8px', cursor: 'pointer' }}>
                    Contact
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
