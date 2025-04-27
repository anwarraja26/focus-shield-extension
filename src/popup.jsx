import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { SessionProvider } from './context/SessionContext';
import './styles.css'; // Add this file for better styling

document.addEventListener('DOMContentLoaded', function() {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <SessionProvider>
        <App />
      </SessionProvider>
    </React.StrictMode>
  );
});