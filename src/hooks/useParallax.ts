import { RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from './useReducedMotion';
gsap.registerPlugin(ScrollTrigger, useGSAP);
export function useParallax(scope: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion();
  useGSAP(() => {
    if (reduced || !scope.current || window.matchMedia('(max-width: 800px)').matches) return;
    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
      const speed = Number(el.dataset.parallax || 12);
      gsap.to(el,{yPercent:speed,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:true}});
    });
  }, { scope, dependencies:[reduced] });
}