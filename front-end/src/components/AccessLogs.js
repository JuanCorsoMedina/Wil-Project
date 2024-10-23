// src/components/AccessLogs.js
import React, { useState } from 'react';

const AccessLogs = () => {
  const [logs, setLogs] = useState([
    { id: 1, user: 'Pavneet', role: 'Maintenance', timestamp: '2024-10-21 12:45' },
    { id: 2, user: 'John Doe', role: 'Security', timestamp: '2024-10-21 13:30' },
    // Sample logs, replace with API call to fetch logs
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter((log) =>
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h2 className="text-center">Access Logs</h2>
      <input
        type="text"
        className="form-control mt-3"
        placeholder="Search logs by user or role"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="mt-4">
        <ul className="list-group">
          {filteredLogs.map((log) => (
            <li key={log.id} className="list-group-item">
              {log.user} - {log.role} - {log.timestamp}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AccessLogs;
