import { useEffect } from 'react';
import { siteConfig } from '../data/siteConfig';

export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = `${title} — ${siteConfig.firmName}`;
    const upsert = (selector: string, attr: string, value: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, value); document.head.appendChild(el); }
      el.content = content;
    };
    upsert('meta[name="description"]', 'name', 'description', description);
    upsert('meta[property="og:title"]', 'property', 'og:title', `${title} — ${siteConfig.firmName}`);
    upsert('meta[property="og:description"]', 'property', 'og:description', description);
  }, [title, description]);
}
