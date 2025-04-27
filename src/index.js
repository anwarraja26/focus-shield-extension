import React from 'react';
import ReactDOM from 'react-dom/client';
import { SessionProvider } from './context/SessionContext';
import App from './components/App';

// This is your main entry point file
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SessionProvider>
      <App />
    </SessionProvider>
  </React.StrictMode>
);