import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function PointerHalo() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(max-width: 900px), (prefers-reduced-motion: reduce)').matches) return;
    const xTo = gsap.quickTo(el, 'x', { duration: .35, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: .35, ease: 'power3' });
    const move = (e: PointerEvent) => {
      xTo(e.clientX); yTo(e.clientY);
      el.classList.toggle('active', Boolean((e.target as Element | null)?.closest?.('[data-cursor-view]')));
    };
    const leave = () => el.classList.remove('active');
    addEventListener('pointermove', move); document.documentElement.addEventListener('mouseleave', leave);
    return () => { removeEventListener('pointermove', move); document.documentElement.removeEventListener('mouseleave', leave); };
  }, []);
  return <div className="pointer-halo" ref={ref} aria-hidden="true">View</div>;
}
