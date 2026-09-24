import { useRef } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePageMeta } from '../hooks/usePageMeta';
import BeforeAfter from '../components/BeforeAfter';
import { useProjects } from '../context/ProjectsContext';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { projects, loading } = useProjects();
  const project = projects.find(item => item.slug === slug);
  usePageMeta(project?.title ?? 'Project', project?.concept ?? 'Architecture project by Studio Forma Architects.');
  const ref = useRef<HTMLDivElement>(null); useScrollReveal(ref);

  if (!project && loading) return <div className="page"><div className="project-loading">Loading project…</div></div>;
  if (!project) return <Navigate to="/projects" replace/>;

  const index = projects.findIndex(item => item.slug === project.slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const comparisonBefore = project.gallery.at(-1) ?? project.hero;

  return <div className="project-detail" ref={ref}>
    <section className="project-hero"><img src={project.hero} alt={`${project.title} hero`} /><div className="project-hero-copy"><p className="eyebrow light">{project.category}</p><h1>{project.title}</h1><p>{project.location} · {project.year}</p></div></section>
    <section className="project-body"><aside className="project-facts"><p className="eyebrow">Project</p><h2>{project.title}</h2><dl><div><dt>Location</dt><dd>{project.location}</dd></div><div><dt>Year</dt><dd>{project.year}</dd></div><div><dt>Area</dt><dd>{project.area}</dd></div><div><dt>Type</dt><dd>{project.category}</dd></div><div><dt>Client</dt><dd>{project.client}</dd></div><div><dt>Status</dt><dd>{project.status}</dd></div></dl></aside>
      <div className="project-narrative"><p className="eyebrow">Design Concept</p><h2 data-reveal>{project.concept}</h2><p data-reveal>{project.description}</p>{project.gallery.map((img, i) => <figure className={i % 2 ? 'offset' : ''} key={`${img}-${i}`} data-image-reveal><img src={img} alt={`${project.title} architectural view ${i + 2}`} loading="lazy"/><figcaption>{String(i + 2).padStart(2, '0')} / {project.title}</figcaption></figure>)}</div>
    </section>
    <section className="comparison"><div className="comparison-copy"><p className="eyebrow">Concept / Final</p><h2>From line, proportion, and intent to lived architecture.</h2></div><BeforeAfter before={comparisonBefore} after={project.hero} title={project.title}/></section>
    {projects.length > 1 && <nav className="project-pager"><Link to={`/projects/${prev.slug}`}><span>Previous</span><strong>{prev.title}</strong></Link><Link to={`/projects/${next.slug}`}><span>Next</span><strong>{next.title}</strong></Link></nav>}
  </div>;
}
