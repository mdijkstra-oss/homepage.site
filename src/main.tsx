import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { startAnalytics } from './lib/analytics';
import './styles.css';

startAnalytics(import.meta.env.VITE_POSTHOG_KEY);

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('#root element not found');

createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
