import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useProjects } from '../context/ProjectsContext';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function PinnedStory() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { projects } = useProjects();
  const project = projects.find(item => item.featured) ?? projects[0];

  useGSAP(() => {
    if (reduced || window.matchMedia('(max-width: 800px)').matches || !ref.current || !project) return;
    const stages = Array.from(ref.current.querySelectorAll<HTMLElement>('.story-stage'));
    const imgs = Array.from(ref.current.querySelectorAll<HTMLElement>('.story-image'));
    gsap.set(stages, { autoAlpha: 0, y: 30 }); gsap.set(stages[0], { autoAlpha: 1, y: 0 });
    gsap.set(imgs, { autoAlpha: 0, scale: 1.05 }); gsap.set(imgs[0], { autoAlpha: 1, scale: 1 });
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=420%', pin: true, scrub: .8 } });
    stages.forEach((el, i) => { if (i === 0) return; tl.to(stages[i - 1], { autoAlpha: 0, y: -20, duration: .35 }).to(el, { autoAlpha: 1, y: 0, duration: .45 }, '<.1'); });
    imgs.slice(1).forEach((el, i) => { tl.to(imgs[i], { autoAlpha: 0, scale: 1.03, duration: .55 }, '<').to(el, { autoAlpha: 1, scale: 1, duration: .55 }, '<'); });
    return () => tl.kill();
  }, { scope: ref, dependencies: [reduced, project?.id, project?.slug, project?.gallery.length] });

  if (!project) return null;
  const imgs = [project.hero, ...project.gallery.slice(0, 3)].filter(Boolean);
  const stages = [
    <><span>Featured Project</span><h2>{project.title}</h2></>,
    <><span>Place / Time</span><h2>{project.location}<br/>{project.year}</h2></>,
    <><span>Scale / Type</span><h2>{project.area}<br/>{project.category}</h2></>,
    <><span>Design Idea</span><h2 className="story-concept">{project.concept}</h2></>,
  ];
  return <section className="pinned-story" ref={ref}>
    <div className="story-images">{imgs.map((src, index) => <img className="story-image" src={src} alt={`${project.title} view ${index + 1}`} key={`${src}-${index}`} />)}</div>
    <div className="story-overlay"/><div className="story-stages">{stages.map((stage, index) => <div className="story-stage" key={index}>{stage}</div>)}</div><div className="story-index">01 / 04</div>
  </section>;
}
