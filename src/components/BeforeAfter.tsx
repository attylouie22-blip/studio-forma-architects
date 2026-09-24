import { useState, type CSSProperties } from 'react';

export default function BeforeAfter({ before, after, title }: { before: string; after: string; title: string }) {
  const [position, setPosition] = useState(50);
  return (
    <div className="before-after" style={{ '--position': `${position}%` } as CSSProperties}>
      <img className="before-after-base" src={after} alt={`${title} finished project`} />
      <div className="before-after-overlay">
        <img src={before} alt={`${title} concept drawing`} />
      </div>
      <div className="before-after-divider" aria-hidden="true"><span>↔</span></div>
      <span className="before-label">Concept</span><span className="after-label">Final</span>
      <input aria-label="Compare concept and final design" type="range" min="0" max="100" value={position} onChange={(e)=>setPosition(Number(e.target.value))}/>
    </div>
  );
}
