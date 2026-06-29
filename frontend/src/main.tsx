import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { TaskProvider } from './context/TaskContext';
import { RoutineProvider } from './context/RoutineContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RoutineProvider>
      <TaskProvider>
        <App />
      </TaskProvider>
    </RoutineProvider>
  </StrictMode>,
);