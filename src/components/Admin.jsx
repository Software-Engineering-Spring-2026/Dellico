import { useState, useEffect } from 'react';

export default function Admin() {
  const [stats, setStats] = useState({
    totalUsers: 127,
    totalStudents: 85,
    totalEmployers: 32,
    pendingApprovals: 5
  });

  return (
    <div style={{ padding: '20px' }}>
      <h1>📊 Admin Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
        <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Total Users</p>
          <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold', color: '#1976d2' }}>{stats.totalUsers}</p>
        </div>

        <div style={{ background: '#f3e5f5', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Total Students</p>
          <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold', color: '#7b1fa2' }}>{stats.totalStudents}</p>
        </div>

        <div style={{ background: '#e8f5e9', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Total Employers</p>
          <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold', color: '#388e3c' }}>{stats.totalEmployers}</p>
        </div>

        <div style={{ background: '#fff3e0', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Pending Approvals</p>
          <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold', color: '#f57c00' }}>{stats.pendingApprovals}</p>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>👥 Employer Approvals</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Company Name</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Email</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Status</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>Tech Corp</td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>hr@techcorp.com</td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                <span style={{ background: '#fff3cd', padding: '4px 8px', borderRadius: '4px' }}>Pending</span>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                <button style={{ background: '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', marginRight: '8px', cursor: 'pointer' }}>
                  ✓ Approve
                </button>
                <button style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                  ✕ Reject
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>👤 User Management</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Email</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Role</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Status</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>John Student</td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>john@guc.edu.eg</td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>Student</td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                <span style={{ background: '#d4edda', padding: '4px 8px', borderRadius: '4px' }}>Active</span>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                <button style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                  Deactivate
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
