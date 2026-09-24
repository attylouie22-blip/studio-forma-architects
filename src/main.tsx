import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ProjectsProvider } from './context/ProjectsContext';
import './styles/global.css';
import './styles/admin.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode><BrowserRouter><ProjectsProvider><App/></ProjectsProvider></BrowserRouter></StrictMode>,
);
