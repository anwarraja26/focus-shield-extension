import React, { createContext, useState, useEffect, useContext } from 'react';
import { getSessions, getTrackingStatus, setTrackingStatus, clearSessions } from '../services/storageService';
import firebaseService from '../services/firebaseService';

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [firebaseStatus, setFirebaseStatus] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Check Firebase connectivity
        const fbConnected = await firebaseService.testFirebaseConnection();
        setFirebaseStatus(fbConnected);
        console.log(`Firebase connection status: ${fbConnected ? 'Connected ✅' : 'Disconnected ❌'}`);
        
        // Load sessions and tracking status
        const storedSessions = await getSessions();
        const trackingStatus = await getTrackingStatus();
        
        setSessions(storedSessions);
        setIsTracking(trackingStatus);
        setLoading(false);
      } catch (error) {
        console.error("Error loading initial data:", error);
        setLoading(false);
      }
    };
    
    loadInitialData();
    
    // Set up listener for session refresh events
    const messageListener = (message) => {
      if (message.action === "refresh-sessions") {
        refreshSessions();
      }
    };
    
    chrome.runtime.onMessage.addListener(messageListener);
    
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const startSession = async () => {
    chrome.runtime.sendMessage({ action: "start-session" });
    await setTrackingStatus(true);
    setIsTracking(true);
    
    // Show Chrome notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '../icons/icon128.png',
      title: 'Focus Shield',
      message: 'Focus mode activated! Stay productive.'
    });
  };

  const stopSession = async () => {
    chrome.runtime.sendMessage({ action: "stop-session" });
    await setTrackingStatus(false);
    setIsTracking(false);
    
    // Refresh sessions rather than clearing to capture the last session
    await refreshSessions();
    
    // Show Chrome notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '../icons/icon128.png',
      title: 'Focus Shield',
      message: 'Focus mode deactivated.'
    });
  };

  const refreshSessions = async () => {
    const updatedSessions = await getSessions();
    setSessions(updatedSessions);
  };

  const value = {
    sessions,
    isTracking,
    loading,
    firebaseStatus,
    startSession,
    stopSession,
    refreshSessions
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContext;