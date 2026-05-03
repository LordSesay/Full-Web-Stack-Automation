import React from 'react';

const colors = {
  low: '#6b7280',
  normal: '#2563eb',
  high: '#d97706',
  critical: '#dc2626'
};

function PriorityBadge({ priority }) {
  const bg = colors[priority] || '#6b7280';
  return (
    <span className="priority-badge" style={{ background: bg }}>
      {priority}
    </span>
  );
}

export default PriorityBadge;
