import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';
import PointerHalo from './components/PointerHalo';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import AdminApp from './pages/admin/AdminApp';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return <Routes><Route path="/admin/*" element={<AdminApp/>}/></Routes>;
  return <>
    <ScrollToTop/><ScrollProgress/><Header/>
    <main><Routes>
      <Route path="/" element={<Home/>}/><Route path="/projects" element={<Projects/>}/><Route path="/projects/:slug" element={<ProjectDetail/>}/><Route path="/about" element={<About/>}/><Route path="/services" element={<Services/>}/><Route path="/contact" element={<Contact/>}/>
    </Routes></main>
    <Footer/><BackToTop/><PointerHalo/>
  </>;
}
