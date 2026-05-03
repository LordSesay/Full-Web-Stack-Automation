import React from 'react';

const colors = {
  'created': '#6b7280',
  'checked-in': '#2563eb',
  'in-progress': '#d97706',
  'completed': '#059669',
  'discharged': '#7c3aed'
};

function StatusBadge({ status }) {
  const bg = colors[status] || '#6b7280';
  return (
    <span className="status-badge" style={{ background: bg }}>
      {status}
    </span>
  );
}

export default StatusBadge;
