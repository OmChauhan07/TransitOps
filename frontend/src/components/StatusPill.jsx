import React from 'react';

const statusColors = {
  AVAILABLE: 'bg-green-100 text-green-800',
  ON_TRIP: 'bg-blue-100 text-blue-800',
  IN_SHOP: 'bg-yellow-100 text-yellow-800',
  RETIRED: 'bg-gray-100 text-gray-800',
  OFF_DUTY: 'bg-gray-100 text-gray-800',
  SUSPENDED: 'bg-red-100 text-red-800',
};

const StatusPill = ({ status }) => {
  const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800';
  const displayStatus = status ? status.replace('_', ' ') : 'UNKNOWN';

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
      {displayStatus}
    </span>
  );
};

export default StatusPill;
