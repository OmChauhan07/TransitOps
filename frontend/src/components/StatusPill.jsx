import React from 'react';

const statusColors = {
  // Green
  AVAILABLE: 'bg-green-500/10 text-green-400 border-green-500/20',
  COMPLETED: 'bg-green-500/10 text-green-400 border-green-500/20',
  // Blue
  ON_TRIP: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  DISPATCHED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  // Red
  SUSPENDED: 'bg-red-500/10 text-red-400 border-red-500/20',
  CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
  // Orange/Yellow
  IN_SHOP: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  DRAFT: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  // Gray
  RETIRED: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  OFF_DUTY: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

const StatusPill = ({ status }) => {
  const colorClass = statusColors[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  const displayStatus = status ? status.replace('_', ' ') : 'UNKNOWN';

  return (
    <span className={`px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full border ${colorClass}`}>
      {displayStatus}
    </span>
  );
};

export default StatusPill;
