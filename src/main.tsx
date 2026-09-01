import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { startMonitoring } from './lib/monitoring';
import './styles.css';

startMonitoring(import.meta.env.VITE_BETTERSTACK_TOKEN);

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('#root element not found');

createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
