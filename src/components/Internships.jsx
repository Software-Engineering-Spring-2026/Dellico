import { useState } from 'react';

export default function Internships() {
  const [internships] = useState([
    { id: 1, title: 'React Developer', company: 'Tech Corp', duration: 3, deadline: '2026-06-30', status: 'hiring', applicants: 5 },
    { id: 2, title: 'Python Developer', company: 'Data Systems', duration: 4, deadline: '2026-07-15', status: 'filled', applicants: 12 }
  ]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>💼 Internships</h1>
      <p>Internship management content here</p>
    </div>
  );
}
