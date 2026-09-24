# Studio Forma Architects — Cinematic Portfolio Demo

A premium React + Vite + TypeScript architecture portfolio demo with GSAP ScrollTrigger storytelling, responsive layouts, project filtering, project-detail storytelling, a draggable concept/final comparison, local project visuals, reduced-motion support, and client-side contact form confirmation.

## Tech stack

- React
- Vite
- TypeScript
- GSAP
- GSAP ScrollTrigger
- React Router
- CSS

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Project structure

```text
src/
  components/        reusable UI
  sections/          cinematic homepage sections
  pages/             route-level pages
  data/              centralized content/configuration
  hooks/             GSAP, parallax, reduced motion, SEO helpers
  assets/projects/   editable source SVG demo visuals
  styles/            global responsive styles
public/
  assets/projects/   optimized WebP demo visuals used by the live site
  _redirects         SPA fallback for compatible hosts
```

## Main customization files

1. `src/data/siteConfig.ts` — firm name, architect name, tagline, address, email, phone, socials, studio description.
2. `src/data/projects.ts` — project titles, slugs, location, year, category, area, client, status, design concept, description, and image paths.
3. `src/data/services.ts` — service names and descriptions.
4. `src/data/testimonials.ts` — client testimonials.
5. `public/assets/projects/` — optimized project images used by the website. Keep the same paths/names or update them in `src/data/projects.ts`.
6. `src/styles/global.css` — typography, spacing, color palette, responsive breakpoints, and visual styling.

The matching editable source demo artwork is also kept in `src/assets/projects/`.

## Replace the demo images with a real architect's work

Each project has its own folder, for example:

```text
public/assets/projects/casa-verde/
  hero.webp
  angle.webp
  living.webp
  detail.webp
  sunset.webp
  plan.webp
```

You can replace those files directly with optimized client photographs/renders while retaining the same filenames, or change the image paths in `src/data/projects.ts`.

Recommended production image sizes:

- Hero / landscape images: 1800–2400 px wide
- WebP or AVIF preferred
- Keep most portfolio images under ~500 KB when practical
- Preserve a consistent visual set for each project

## GitHub upload

### Option A — GitHub website

1. Create a new empty repository on GitHub.
2. Extract this ZIP on your computer.
3. Open the extracted folder.
4. Upload all files and folders to the repository, including `src`, `public`, and the root config files.
5. Commit the upload.

### Option B — Git command line

```bash
git init
git add .
git commit -m "Initial Studio Forma portfolio"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## Import the GitHub repository into Bolt

1. Sign in to Bolt.
2. Start a new project and choose the GitHub/repository import option.
3. Connect GitHub if prompted.
4. Select the repository containing this project.
5. Let Bolt install the dependencies.
6. Confirm the project starts with the Vite development command.
7. If Bolt asks for a build command, use `npm run build`.

## Publish through Bolt

1. Open the imported project in Bolt.
2. Run or preview the app and check the main routes:
   - `/`
   - `/projects`
   - `/about`
   - `/services`
   - `/contact`
3. Open at least one project detail route such as `/projects/casa-verde`.
4. Use Bolt's Publish/Deploy control.
5. For a custom domain, connect it through the deployment/domain settings available in your Bolt workspace.

The included `public/_redirects` supplies an SPA fallback on hosts that support Netlify-style redirects. If your selected host uses a different rewrite format, configure all application routes to fall back to `index.html`.

## Motion and accessibility

The site respects `prefers-reduced-motion`. Heavy pinning and parallax are disabled or converted into static/grid presentations when reduced motion is requested. Mobile layouts also simplify expensive desktop motion and prevent the horizontal project showcase from creating page overflow.

## Demo assets

The six fictional projects include 36 original local architectural demo visuals. Optimized WebP files are served from `public/assets/projects/`, while editable SVG source versions are retained under `src/assets/projects/`.

## Demo form

The contact form is client-side only. On submit, it shows a success state and does not send data to a server. Connect it to your preferred form endpoint, database, CRM, Supabase function, or API when converting the demo into a production client site.
