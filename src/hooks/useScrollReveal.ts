import { RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger, useGSAP);
export function useScrollReveal(scope: RefObject<HTMLElement | null>, selector = '[data-reveal]') {
  const reduced = useReducedMotion();
  useGSAP(() => {
    if (reduced || !scope.current) return;
    gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
      gsap.fromTo(el,{y:42,opacity:0},{y:0,opacity:1,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}});
    });
    gsap.utils.toArray<HTMLElement>('[data-image-reveal]').forEach((el) => {
      gsap.fromTo(el,{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)',duration:1.25,ease:'power3.inOut',scrollTrigger:{trigger:el,start:'top 90%',once:true}});
    });
  }, { scope, dependencies: [reduced] });
}