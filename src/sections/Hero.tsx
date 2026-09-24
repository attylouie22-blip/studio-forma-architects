import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { siteConfig } from '../data/siteConfig';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useProjects } from '../context/ProjectsContext';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { projects } = useProjects();
  const project = projects.find(item => item.featured) ?? projects[0];

  useGSAP(() => {
    if (reduced) return;
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } });
    tl.to('.hero-media img', { scale: 1.12, yPercent: 5, ease: 'none' }, 0)
      .to('.hero-copy', { yPercent: -18, opacity: .15, ease: 'none' }, 0);
  }, { scope: ref, dependencies: [reduced, project?.hero] });

  return <section className="hero" ref={ref}>
    <div className="hero-media">{project && <img src={project.hero} alt={`${project.title} architectural project`} />}</div>
    <div className="hero-scrim" />
    <div className="hero-copy">
      <p className="eyebrow light">{siteConfig.firmName}</p><h1>{siteConfig.tagline}</h1><p>{siteConfig.secondaryTagline}</p>
      <div className="hero-actions"><Link className="button light" to="/projects">View Projects</Link><Link className="text-link light" to="/contact">Start a Project ↗</Link></div>
    </div>
    <span className="scroll-cue">Scroll to explore</span>
  </section>;
}
