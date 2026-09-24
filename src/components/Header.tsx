import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig';
const nav = [['Home','/'],['Projects','/projects'],['About','/about'],['Services','/services'],['Contact','/contact']];
export default function Header(){
  const [scrolled,setScrolled]=useState(false); const [open,setOpen]=useState(false); const { pathname } = useLocation();
  const transparentHero = pathname === '/' || (pathname.startsWith('/projects/') && pathname !== '/projects');
  useEffect(()=>{const f=()=>setScrolled(window.scrollY>40); f(); addEventListener('scroll',f,{passive:true}); return()=>removeEventListener('scroll',f)},[]);
  return <header className={`site-header ${(scrolled || !transparentHero)?'is-scrolled':''}`}>
    <NavLink className="brand" to="/" onClick={()=>setOpen(false)}>{siteConfig.firmName}</NavLink>
    <button className="menu-button" aria-expanded={open} aria-label="Toggle navigation" onClick={()=>setOpen(!open)}><span/><span/></button>
    <nav className={open?'open':''} aria-label="Primary navigation">{nav.map(([label,to])=><NavLink key={to} to={to} onClick={()=>setOpen(false)} className={({isActive})=>isActive?'active':''}>{label}</NavLink>)}</nav>
  </header>
}