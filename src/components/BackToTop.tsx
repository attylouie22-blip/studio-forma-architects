import { useEffect, useState } from 'react';
export default function BackToTop(){const[s,setS]=useState(false);useEffect(()=>{const f=()=>setS(scrollY>900);addEventListener('scroll',f,{passive:true});return()=>removeEventListener('scroll',f)},[]);return <button className={`back-top ${s?'show':''}`} onClick={()=>scrollTo({top:0,behavior:'smooth'})} aria-label="Back to top">↑</button>}
