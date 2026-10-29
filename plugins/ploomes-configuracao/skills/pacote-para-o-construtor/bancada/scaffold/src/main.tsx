import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { PloomesProvider, PloomesRouter } from './lib';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PloomesProvider>
      <PloomesRouter>
        <App />
      </PloomesRouter>
    </PloomesProvider>
  </StrictMode>,
)
