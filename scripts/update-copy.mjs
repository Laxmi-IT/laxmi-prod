/**
 * One-off script to update site_content in Supabase with copy feedback changes.
 *
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
 *   node scripts/update-copy.mjs
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// NOTE: the live site loads the static JSON dictionaries as a base and merges
// these site_content rows on top (DB wins for non-empty values). Run this
// script to push the copy below to the DB; keys missing from the DB simply
// fall back to the (already updated) static JSON.
const updates = [
  // Point 1 — replace the "luxury furniture consulting" positioning with the
  // new "tailor-made / bespoke" tagline across the home hero, footer and SEO.
  {
    content_key: 'hero.tagline1',
    content_it: 'Il tuo arredamento su misura',
    content_en: 'Your Bespoke Furniture',
  },
  {
    content_key: 'footer.description',
    content_it: 'Il tuo arredamento su misura. Arredare la tua vita, un dettaglio alla volta. Made in Italy.',
    content_en: 'Your bespoke furniture. Furnishing your life, one detail at a time. Made in Italy.',
  },
  {
    content_key: 'metadata.title',
    content_it: 'LAXMI | Arredamento di Lusso su Misura Made in Italy',
    content_en: 'LAXMI | Bespoke Luxury Italian Furniture Made in Italy',
  },
  {
    content_key: 'metadata.titleTemplate',
    content_it: '%s | LAXMI Arredamento su Misura',
    content_en: '%s | LAXMI Bespoke Furniture',
  },
  {
    content_key: 'metadata.description',
    content_it: 'Arredamento di lusso italiano su misura. LAXMI guida i connoisseur nella selezione di mobili Made in Italy: qualità artigianale, design unico, eleganza senza tempo. Milano.',
    content_en: 'Bespoke luxury Italian furniture, made to measure. LAXMI guides discerning connoisseurs in selecting Made in Italy pieces: artisanal quality, unique design, timeless elegance. Milan.',
  },
  {
    content_key: 'metadata.ogTitle',
    content_it: 'LAXMI — Arredamento di Lusso su Misura Made in Italy',
    content_en: 'LAXMI — Bespoke Luxury Italian Furniture Made in Italy',
  },
  {
    content_key: 'metadata.consultingTitle',
    content_it: 'Consulenza Arredamento su Misura Online',
    content_en: 'Bespoke Furniture Consulting Online',
  },
  {
    content_key: 'metadata.contactTitle',
    content_it: 'Contatti LAXMI — Arredamento di Lusso su Misura Milano',
    content_en: 'Contact LAXMI — Bespoke Luxury Furniture in Milan',
  },
  {
    content_key: 'metadata.contactDescription',
    content_it: 'Contatta LAXMI per il tuo arredamento di lusso su misura. Prenota il tuo appuntamento a Milano. Rispondiamo entro 24–48 ore.',
    content_en: 'Get in touch with LAXMI for your bespoke luxury furniture. Schedule your appointment in Milan, Italy. We respond within 24–48 hours.',
  },
  // Point 2 — remove the "additional rooms" price line from the Full House tier.
  {
    content_key: 'consulting.services.fullHouse.features',
    content_it: JSON.stringify([
      'Tutto incluso in Ambiente Singolo, più:',
      'Progettazione fino a 3 ambienti',
      'Render 3D fotorealistici',
      'Coordinamento stilistico totale',
      'Proposte arredo complete',
      '2 revisioni incluse',
    ]),
    content_en: JSON.stringify([
      'Everything in Single Room, plus:',
      'Design for up to 3 rooms',
      'Photorealistic 3D renders',
      'Total style coordination',
      'Complete furniture proposals',
      '2 revisions included',
    ]),
  },
];

console.log(`Updating ${updates.length} content rows in site_content...\n`);

for (const row of updates) {
  const { data, error } = await supabase
    .from('site_content')
    .update({ content_it: row.content_it, content_en: row.content_en })
    .eq('content_key', row.content_key)
    .select();

  if (error) {
    console.error(`FAIL [${row.content_key}]: ${error.message}`);
  } else if (!data || data.length === 0) {
    console.warn(`SKIP [${row.content_key}]: Key not found in DB (static fallback will be used)`);
  } else {
    console.log(`  OK [${row.content_key}]`);
  }
}

console.log('\nDone. Redeploy or wait for cache revalidation (up to 1 hour).');
