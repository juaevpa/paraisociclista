/**
 * Quita referencias falsas al "Trofeo de Velocidad Fira de Xàtiva"
 * (es de motos, no de ciclismo) que se metieron por error en Sanity.
 */
import { createClient } from '@sanity/client';

const SANITY_TOKEN = process.env.SANITY_TOKEN;
if (!SANITY_TOKEN) { console.error('Falta SANITY_TOKEN'); process.exit(1); }

const client = createClient({
  projectId: 'kb9dsoe4',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: SANITY_TOKEN,
  useCdn: false,
});

function blockText(b) {
  if (!b?.children) return '';
  return b.children.map(c => c?.text || '').join('');
}

function filterOut(blocks, pattern) {
  return blocks.filter(b => !pattern.test(blockText(b)));
}

async function patchDoc(type, slug, transformer) {
  const doc = await client.fetch(
    `*[_type == $type && slug.current == $slug][0]{_id, description, content}`,
    { type, slug }
  );
  if (!doc) { console.log(`  ⚠️  ${slug}: no existe`); return; }

  const field = type === 'blogPost' ? 'content' : 'description';
  const original = doc[field] || [];
  const updated = transformer(original);

  if (updated.length === original.length) {
    // Text replacement case
    await client.patch(doc._id).set({ [field]: updated }).commit();
    console.log(`  ✅ ${slug}: ${field} actualizado (texto reemplazado)`);
  } else {
    await client.patch(doc._id).set({ [field]: updated }).commit();
    console.log(`  ✅ ${slug}: ${field} actualizado (${original.length} → ${updated.length} bloques)`);
  }
}

async function run() {
  // 1. fira-dagost: quitar el h3+p del Trofeo de Velocidad
  await patchDoc('explorePlace', 'fira-dagost', (blocks) =>
    filterOut(blocks, /Trofeo de Velocidad/i)
  );

  // 2. blog epicentro: quitar la sección "Un clásico: Trofeo..."
  await patchDoc(
    'blogPost',
    'xativa-el-nuevo-epicentro-del-ciclismo-profesional-en-la-comunidad-valenciana',
    (blocks) => filterOut(blocks, /Trofeo de Velocidad/i)
  );

  // 3. blog bienvenidos: en la lista de "eventos" viene Trofeo — reemplazar el texto del item
  await patchDoc('blogPost', 'bienvenidos-a-paraiso-ciclista', (blocks) =>
    blocks.map((b) => {
      const text = blockText(b);
      if (!/Trofeo de Velocidad/i.test(text)) return b;
      const newText = text
        .replace(/,?\s*el Trofeo de Velocidad Fira de Xàtiva/g, '')
        .replace(/\s+\.$/, '.');
      return {
        ...b,
        children: [{ ...b.children[0], text: newText }],
      };
    })
  );

  console.log('\n=== Hecho ===');
}

run().catch((e) => { console.error(e.message); process.exit(1); });
