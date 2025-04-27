import React from 'react';

const StatusIndicator = ({ isTracking }) => {
  const style = {
    textAlign: 'center',
    padding: '8px',
    borderRadius: '4px',
    marginBottom: '16px',
    fontWeight: 'bold',
    backgroundColor: isTracking ? '#d5f5e3' : '#fadbd8',
    color: isTracking ? '#27ae60' : '#c0392b'
  };

  return (
    <div className="status-indicator" style={style}>
      Focus Mode: {isTracking ? 'ON' : 'OFF'}
    </div>
  );
};

export default StatusIndicator;