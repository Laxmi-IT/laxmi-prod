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

const updates = [
  {
    content_key: 'hero.tagline2',
    content_it: '',
    content_en: '',
  },
  {
    content_key: 'hero.description',
    content_it: 'Arredare la tua vita, un dettaglio alla volta.',
    content_en: 'Furnishing your life, one detail at a time.',
  },
  {
    content_key: 'services.service2.description',
    content_it: 'Collezione curata di autentici mobili artigianali di lusso.',
    content_en: 'Curated collection of authentic artisanal Italian luxury furniture.',
  },
  {
    content_key: 'collections.heroDescription',
    content_it: 'Ogni pezzo di arredamento racconta una storia di passione artigianale, materiali pregiati e design senza tempo. Scopri le creazioni che trasformano il tuo spazio in un luogo da vivere ogni giorno.',
    content_en: 'Each piece of furniture tells a story of artisanal passion, premium materials, and timeless design. Discover creations that transform your space into a place to live every day.',
  },
  {
    content_key: 'consulting.promiseText',
    content_it: 'Il tuo spazio porterà la nostra firma invisibile: la cura per i dettagli e la ricerca della perfezione che definiscono tutto ciò che facciamo.',
    content_en: 'Your space will carry our invisible signature: the care for details and the pursuit of perfection that define everything we do.',
  },
  {
    content_key: 'footer.description',
    content_it: 'Consulenza Arredamento di Lusso. Arredare la tua vita, un dettaglio alla volta. Made in Italy.',
    content_en: 'Luxury Furniture Consulting. Furnishing your life, one detail at a time. Made in Italy.',
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
