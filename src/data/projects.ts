export type Project = {
  id?: string;
  title: string;
  slug: string;
  location: string;
  year: string;
  category: string;
  area: string;
  client: string;
  status: string;
  concept: string;
  description: string;
  hero: string;
  gallery: string[];
  featured?: boolean;
  isPublished?: boolean;
  sortOrder?: number;
};

const asset = (slug: string, file: string) => `/assets/projects/${slug}/${file}.webp`;

export const projects: Project[] = [
  {
    title: 'Casa Verde Residence', slug: 'casa-verde', location: 'Pampanga, Philippines', year: '2026', category: 'Residential', area: '620 sqm', client: 'Private Residence', status: 'Completed', featured: true, isPublished: true, sortOrder: 1,
    concept: 'A tropical courtyard house where concrete, timber, landscape, and filtered daylight create a quiet sequence of indoor–outdoor rooms.',
    description: 'Casa Verde is organized around a planted courtyard that brings daylight and air into the center of the plan. Deep overhangs, warm timber screens, and exposed concrete frame long views while reducing direct heat gain.',
    hero: asset('casa-verde','hero'), gallery: ['angle','living','detail','sunset','plan'].map(x=>asset('casa-verde',x))
  },
  {
    title: 'Courtyard House', slug: 'courtyard-house', location: 'Tarlac, Philippines', year: '2025', category: 'Residential', area: '410 sqm', client: 'Private Residence', status: 'Completed', isPublished: true, sortOrder: 2,
    concept: 'A restrained brick-and-stone home wrapped around a shaded court, designed for privacy, cross-ventilation, and changing tropical light.',
    description: 'The house uses a low, horizontal profile and a central garden as its spatial anchor. Textured masonry and dark metal contrast with light-filled interior rooms.',
    hero: asset('courtyard-house','hero'), gallery: ['angle','living','detail','sunset','plan'].map(x=>asset('courtyard-house',x))
  },
  {
    title: 'Northline Corporate Center', slug: 'northline-center', location: 'Clark, Pampanga', year: '2026', category: 'Commercial', area: '8,400 sqm', client: 'Northline Holdings', status: 'Under Construction', isPublished: true, sortOrder: 3,
    concept: 'A high-performance office building shaped by vertical fins, shaded terraces, and a civic ground floor that connects workplace and landscape.',
    description: 'Northline balances a crisp corporate identity with climate-responsive facade design. The building is organized as flexible floor plates around a daylight-rich central core.',
    hero: asset('northline-center','hero'), gallery: ['angle','lobby','detail','sunset','plan'].map(x=>asset('northline-center',x))
  },
  {
    title: 'Solana Resort Villas', slug: 'solana-villas', location: 'Zambales, Philippines', year: '2025', category: 'Hospitality', area: '3.2 ha', client: 'Solana Leisure Group', status: 'Completed', isPublished: true, sortOrder: 4,
    concept: 'A coastal retreat of low villas, shaded breezeways, and framed sea views inspired by the rhythm of dunes and native landscape.',
    description: 'The resort is planned as a sequence of intimate pavilions linked by shaded paths. Materials are intentionally quiet: lime plaster, timber, stone, and woven screens.',
    hero: asset('solana-villas','hero'), gallery: ['angle','interior','detail','sunset','plan'].map(x=>asset('solana-villas',x))
  },
  {
    title: 'Atelier House', slug: 'atelier-house', location: 'Quezon City, Philippines', year: '2026', category: 'Interior Design', area: '285 sqm', client: 'Private Residence', status: 'Completed', isPublished: true, sortOrder: 5,
    concept: 'A city home conceived as a gallery for art, books, and changing daylight, with sculptural stairs and softly layered interior volumes.',
    description: 'Atelier House uses a restrained material palette of pale oak, stone, linen, and blackened steel. Carefully aligned openings make compact rooms feel connected and generous.',
    hero: asset('atelier-house','hero'), gallery: ['angle','living','detail','sunset','plan'].map(x=>asset('atelier-house',x))
  },
  {
    title: 'Heritage Residence Renovation', slug: 'heritage-residence', location: 'San Fernando, Pampanga', year: '2025', category: 'Renovation', area: '530 sqm', client: 'Private Residence', status: 'Completed', isPublished: true, sortOrder: 6,
    concept: 'A careful renewal that preserves the original house’s proportions while introducing contemporary light, services, and climate comfort.',
    description: 'New interventions are intentionally legible but quiet. Existing masonry and timber are repaired, while a new garden wing creates a relaxed counterpoint to the formal heritage rooms.',
    hero: asset('heritage-residence','hero'), gallery: ['angle','interior','detail','sunset','plan'].map(x=>asset('heritage-residence',x))
  },
];

export const getProject = (slug?: string) => projects.find(p => p.slug === slug);
