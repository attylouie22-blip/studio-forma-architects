import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useProjects } from '../context/ProjectsContext';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function HorizontalProjects() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { projects } = useProjects();

  useGSAP(() => {
    if (reduced || window.matchMedia('(max-width: 900px)').matches || !ref.current) return;
    const track = ref.current.querySelector<HTMLElement>('.horizontal-track');
    if (!track) return;
    const getX = () => -(track.scrollWidth - innerWidth);
    const tween = gsap.to(track, { x: getX, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: () => `+=${Math.max(1, track.scrollWidth - innerWidth)}`, pin: true, scrub: 1, invalidateOnRefresh: true } });
    return () => tween.kill();
  }, { scope: ref, dependencies: [reduced, projects.length] });

  return <section className="horizontal-section" ref={ref}>
    <div className="section-heading horizontal-heading"><p className="eyebrow">Selected Work</p><h2>Projects move with the pace of your scroll.</h2></div>
    <div className="horizontal-track">{projects.map((project, index) => <Link to={`/projects/${project.slug}`} className="horizontal-card" data-cursor-view key={project.id ?? project.slug}>
      <img src={project.hero} alt={project.title} loading="lazy"/><div><span>{String(index + 1).padStart(2, '0')}</span><h3>{project.title}</h3><p>{project.location} · {project.year} · {project.category}</p></div>
    </Link>)}</div>
  </section>;
}
