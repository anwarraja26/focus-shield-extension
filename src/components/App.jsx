import React, { useEffect } from 'react';
import StatusIndicator from './StatusIndicator';
import SessionList from './SessionList';
import { useSession } from '../context/SessionContext';

const App = () => {
  const { sessions, isTracking, loading, firebaseStatus, startSession, stopSession, refreshSessions } = useSession();

  // Idle state detection logic
  useEffect(() => {
    let idleTimeout;
    let lastActivity = Date.now();

    if (!isTracking) {
      return;
    }
    const resetIdleTimer = () => {
      lastActivity = Date.now();
      if (idleTimeout) clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        if (Date.now() - lastActivity >= 10000 && isTracking) {
          if (window.chrome && chrome.notifications && chrome.notifications.create) {
            chrome.notifications.create({
              type: 'basic',
              iconUrl: '../icons/icon128.png',
              title: 'Focus Shield',
              message: 'You have been idle for 10 seconds!'
            });
          } else {
            alert('You have been idle for 10 seconds!');
          }
        }
      }, 10000);
    };
    // Listen for user activity
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('mousedown', resetIdleTimer);

    // Start timer immediately
    resetIdleTimer();

    return () => {
      if (idleTimeout) clearTimeout(idleTimeout);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      window.removeEventListener('mousedown', resetIdleTimer);
    };
  }, [isTracking]);

  useEffect(() => {
    // Refresh sessions data every 10 seconds while tracking
    let interval;
    if (isTracking) {
      interval = setInterval(() => {
        refreshSessions();
      }, 10000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, refreshSessions]);

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Focus Shield</h2>
      
      {/* Firebase status indicator */}
      <div style={{
        ...styles.firebaseStatus,
        backgroundColor: firebaseStatus ? '#d5f5e3' : '#fadbd8',
        color: firebaseStatus ? '#27ae60' : '#c0392b'
      }}>
        Firebase: {firebaseStatus ? 'Connected' : 'Disconnected'}
      </div>
      
      <div style={styles.buttonContainer}>
        <button 
          onClick={startSession} 
          style={{...styles.button, ...styles.startButton}}
          disabled={isTracking}
        >
          Start Focus
        </button>
        <button 
          onClick={stopSession} 
          style={{...styles.button, ...styles.stopButton}}
          disabled={!isTracking}
        >
          Stop Focus
        </button>
      </div>
      
      <StatusIndicator isTracking={isTracking} />
      
      <button 
        onClick={refreshSessions} 
        style={styles.refreshButton}
      >
        Refresh Data
      </button>
      
      <SessionList sessions={sessions} />
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    width: '300px',
    padding: '16px',
    margin: '0',
    color: '#333'
  },
  title: {
    color: '#2c3e50',
    textAlign: 'center',
    marginTop: '0',
    marginBottom: '16px'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px'
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    width: '48%'
  },
  startButton: {
    backgroundColor: '#2ecc71',
    color: 'white',
    '&:hover': {
      backgroundColor: '#27ae60'
    }
  },
  stopButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    '&:hover': {
      backgroundColor: '#c0392b'
    }
  },
  refreshButton: {
    display: 'block',
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  loading: {
    padding: '20px',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  firebaseStatus: {
    fontSize: '12px',
    textAlign: 'center',
    padding: '4px',
    marginBottom: '8px',
    borderRadius: '4px'
  }
};

export default App;