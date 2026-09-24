import { useMemo, useRef, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePageMeta } from '../hooks/usePageMeta';
import { useProjects } from '../context/ProjectsContext';

export default function Projects() {
  usePageMeta('Projects', 'Explore selected architectural projects by Studio Forma Architects across residential, commercial, hospitality, interior design, and renovation.');
  const ref = useRef<HTMLDivElement>(null); useScrollReveal(ref);
  const { projects, loading } = useProjects();
  const cats = ['All', 'Residential', 'Commercial', 'Interior Design', 'Hospitality', 'Renovation'];
  const [cat, setCat] = useState('All');
  const filtered = useMemo(() => cat === 'All' ? projects : projects.filter(project => project.category.includes(cat)), [cat, projects]);
  return <div className="page projects-page" ref={ref}>
    <header className="page-hero"><p className="eyebrow">Portfolio</p><h1>Selected projects across home, work, retreat, and renewal.</h1></header>
    <div className="filters" aria-label="Project filters">{cats.map(item => <button className={item === cat ? 'active' : ''} onClick={() => setCat(item)} key={item}>{item}</button>)}</div>
    {loading && <p className="cms-loading">Updating portfolio…</p>}
    <div className="projects-grid">{filtered.map((project, index) => <ProjectCard project={project} index={index} key={project.id ?? project.slug}/>)}</div>
  </div>;
}
