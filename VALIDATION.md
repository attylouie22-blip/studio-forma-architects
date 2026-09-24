# Validation Notes

The project was checked in the generation sandbox for:

- TypeScript/TSX syntax by transpiling all source files with TypeScript.
- Missing local relative imports.
- Presence of all 36 runtime WebP project visuals.
- Presence of all 36 editable SVG source visuals.
- Absence of external raster-image dependencies in the source code.
- Responsive CSS breakpoints for desktop, tablet, Android/iPhone-size layouts.
- Mobile fallbacks for the pinned story and horizontal gallery.
- `prefers-reduced-motion` fallbacks.
- SPA route fallback file (`public/_redirects`).
- ScrollTrigger animation cleanup through `useGSAP`/GSAP context patterns.

## Sandbox package-install limitation

A full `npm install` / `npm run build` was attempted, but this generation sandbox could not resolve or connect to the npm registry. The installation timed out because outbound npm registry access was unavailable. Consequently, the production bundle could not be executed inside this sandbox.

On a normal internet-connected machine or in Bolt, run:

```bash
npm install
npm run build
```

The project intentionally does not include `node_modules`.
