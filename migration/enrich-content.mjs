/**
 * Script de enriquecimiento de contenido en Sanity
 *
 * Ejecutar con:
 *   SANITY_TOKEN=xxx node enrich-content.mjs
 *
 * Qué hace:
 *  - Reestructura descripciones monolíticas en bloques Portable Text correctos
 *  - Añade contenido local real de Xàtiva en lugares emblemáticos
 *  - Asigna categorías a lugares huérfanos
 *
 * IMPORTANTE: Nunca commitear el token.
 */

import { createClient } from '@sanity/client';

const SANITY_TOKEN = process.env.SANITY_TOKEN;
if (!SANITY_TOKEN) {
  console.error('Falta SANITY_TOKEN en env');
  process.exit(1);
}

const client = createClient({
  projectId: 'kb9dsoe4',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: SANITY_TOKEN,
  useCdn: false,
});

const rnd = () => Math.random().toString(36).slice(2, 12);

/** Construye un bloque Portable Text */
function block(text, style = 'normal', listItem) {
  const b = {
    _type: 'block',
    _key: rnd(),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: rnd(), text, marks: [] }],
  };
  if (listItem) {
    b.listItem = listItem;
    b.level = 1;
  }
  return b;
}

/** Atajos para construir contenido estructurado */
const h2 = (t) => block(t, 'h2');
const h3 = (t) => block(t, 'h3');
const p = (t) => block(t);
const li = (t) => block(t, 'normal', 'bullet');

// =============================================================
// CONTENIDO ENRIQUECIDO POR LUGAR
// =============================================================

const enrichments = {
  'museo-almodi': {
    excerpt:
      'El museo más emblemático de Xàtiva, famoso por el retrato de Felipe V colgado cabeza abajo como símbolo de rebeldía.',
    description: [
      p(
        'El Museo del Almodí, ubicado en el antiguo almacén medieval de grano, es mucho más que un museo municipal: custodia una de las imágenes más icónicas y simbólicas de toda España.'
      ),

      h2('El cuadro más famoso de Xàtiva (cabeza abajo)'),
      p(
        'En la sala principal del museo cuelga un retrato de Felipe V de Borbón. Lleva allí invertido desde hace décadas y no es un error: es un acto simbólico de protesta permanente.'
      ),
      p(
        'En 1707, tras la Batalla de Almansa, Felipe V ordenó incendiar Xàtiva por su lealtad a la causa austracista en la Guerra de Sucesión. La ciudad fue arrasada, sus habitantes expulsados, y se le cambió incluso el nombre a "Nueva Colonia de San Felipe". Por eso, a los nacidos en Xàtiva se les sigue llamando "socarrats" (los quemados).'
      ),
      p(
        'Como recordatorio de aquella afrenta, el retrato del monarca —atribuido al pintor local José Amorós— se exhibe boca abajo. Es un gesto único en la museística española y la razón por la que muchos visitantes llegan hasta aquí.'
      ),

      h2('El edificio'),
      p(
        'Construido en el siglo XVI como almodí (almacén público de grano), el inmueble es uno de los mejores ejemplos de arquitectura civil gótica valenciana. Fue rehabilitado y reconvertido en museo municipal en 1981.'
      ),

      h2('Colecciones'),
      h3('Arqueología'),
      li('Restos íberos y romanos de la comarca'),
      li('Cerámica medieval valenciana'),
      li('Elementos arquitectónicos de edificios desaparecidos'),
      h3('Bellas Artes'),
      li('Pintura local de los siglos XVI al XIX'),
      li('Escultura religiosa'),
      li('Fotografía histórica de Xàtiva'),
      h3('Etnografía'),
      li('Utensilios tradicionales del campo valenciano'),
      li('Indumentaria histórica'),
      li('Oficios desaparecidos'),

      h2('Información práctica'),
      li('Martes a sábado: 10:00–14:00 y 16:00–19:00'),
      li('Domingos: 10:00–14:00'),
      li('Lunes cerrado'),
      li('Entrada general: 2 € · Reducida: 1 € · Domingos: gratis'),
    ],
  },

  'dulces-tradicionales': {
    excerpt:
      'La repostería más auténtica de Xàtiva: arnadí, moixavena y otras joyas de siglos de tradición pastelera.',
    description: [
      p(
        'La tradición dulcera de Xàtiva es una de las más singulares del Mediterráneo. Recetas árabes, cristianas y judías se fundieron durante siglos en los obradores locales dando lugar a una repostería única que hoy se sigue elaborando de forma artesanal.'
      ),

      h2('Los imprescindibles'),

      h3('Arnadí'),
      p(
        'El dulce más antiguo y emblemático. De origen medieval andalusí, está hecho a base de calabaza o boniato cocidos, almendra molida, azúcar, canela y piñones por encima. Se elabora especialmente en Navidad y Semana Santa y es una de las señas de identidad gastronómicas de Xàtiva.'
      ),

      h3('Moixavena'),
      p(
        'Especialidad genuinamente setabense, casi desconocida fuera de la comarca. Es un dulce a base de huevo, azúcar y almendra, con una textura ligera y esponjosa y un aroma delicado a canela y limón. Se sirve tradicionalmente en fiestas patronales y celebraciones familiares.'
      ),

      h3('Coca de Llanda'),
      p(
        'Bizcocho casero de toda la vida, cocido en una bandeja llamada "llanda". Aromatizado con limón y canela, esponjoso y sencillo. El desayuno de muchos xativins.'
      ),

      h3('Pastel de boniato'),
      p(
        'De masa hojaldrada y relleno dulce de boniato. Se elabora tradicionalmente en Navidad y es típico de las pastelerías artesanas del centro histórico.'
      ),

      h2('Dónde probarlos'),
      li('Pastelerías tradicionales del centro histórico'),
      li('Horno del Carmen'),
      li('La Antigua Pastelería'),
      li('Obradores artesanos familiares'),

      h2('Calendario dulcero'),
      li('Navidad: arnadí, pastel de boniato, turrones artesanos'),
      li('Semana Santa: monas de Pascua y arnadí'),
      li('Fiestas patronales: moixavena'),
      li('Otoño: buñuelos de calabaza'),
    ],
  },

  'castillo-xativa': {
    excerpt:
      'Uno de los castillos más impresionantes de España: cuna de los papas Borgia y atalaya de la Vall d\'Albaida.',
    description: [
      p(
        'El Castillo de Xàtiva corona la ciudad desde lo alto de la sierra del Castell. Doble fortaleza —Castell Menor y Castell Major— unida por una muralla, es uno de los conjuntos fortificados más espectaculares del Mediterráneo y resume en sus piedras tres mil años de historia valenciana.'
      ),

      h2('Tres mil años de historia'),
      h3('Íberos y romanos'),
      p(
        'Ya en el siglo V a.C. los íberos fortificaron esta colina. Los romanos la llamaron Saetabis y fue conocida en todo el Imperio por sus finísimos lienzos de lino, citados por Plinio y Catulo.'
      ),
      h3('Al-Andalus'),
      p(
        'Bajo dominio musulmán (siglos VIII–XIII), Xàtiva fue una de las ciudades más prósperas del Sharq al-Ándalus. Aquí se introdujo en Europa la fabricación de papel, una de las primeras del continente.'
      ),
      h3('Jaume I y la Reconquista'),
      p(
        'Jaime I conquistó la ciudad en 1244 tras un largo asedio. El castillo se reforzó y se convirtió en una de las fortalezas clave del Reino de Valencia.'
      ),

      h2('La cuna de los Borgia'),
      p(
        'De Xàtiva son originarios los dos únicos papas españoles de la historia: Calixto III (Alfonso de Borja) y Alejandro VI (Rodrigo de Borja). Ambos nacieron aquí en el siglo XV y desde estas tierras proyectaron la influencia valenciana sobre el Renacimiento italiano.'
      ),

      h2('Prisión de nobles'),
      p(
        'El castillo fue también prisión de estado. Entre sus muros estuvo preso el Duque de Calabria, pretendiente al trono de Nápoles, encerrado por Fernando el Católico durante más de diez años.'
      ),

      h2('Qué ver'),
      li('Castell Major: la fortaleza superior, con vistas a toda la vall'),
      li('Castell Menor: de origen íbero y romano'),
      li('Torres y murallas reconstruidas tras el incendio de 1707'),
      li('Capilla de Santa María'),
      li('Mirador panorámico sobre Xàtiva y la huerta'),

      h2('Cómo llegar'),
      li('A pie por la calle Montcada (subida empinada, 30–40 min)'),
      li('En coche hasta el aparcamiento junto al Castell Menor'),
      li('Trenet turístico desde el centro'),

      h2('Información práctica'),
      li('Abierto todo el año, consultar horarios de temporada'),
      li('Entrada reducida con bono turístico municipal'),
      li('Visitas guiadas disponibles los fines de semana'),
    ],
  },

  'casa-alejandro-vi': {
    excerpt:
      'La casa natal del papa más famoso del Renacimiento: Rodrigo de Borja, Alejandro VI, nacido en Xàtiva en 1431.',
    description: [
      p(
        'En el corazón del casco histórico de Xàtiva se conserva la casa natal de Rodrigo de Borja, que siendo Papa tomó el nombre de Alejandro VI. Es uno de los hitos imprescindibles para entender el peso de esta pequeña ciudad valenciana en la historia de Europa.'
      ),

      h2('Los Borgia: de Xàtiva a Roma'),
      p(
        'Xàtiva es la única ciudad del mundo cuna de dos papas: Calixto III (Alfonso de Borja, 1378) y su sobrino Alejandro VI (Rodrigo de Borja, 1431). Los Borgia —Borja en valenciano— forman una de las familias más influyentes y controvertidas del Renacimiento italiano.'
      ),

      h2('Alejandro VI (1431–1503)'),
      p(
        'Rodrigo de Borja llegó al papado en 1492, el mismo año del descubrimiento de América. Durante su pontificado firmó el Tratado de Tordesillas repartiendo el Nuevo Mundo entre España y Portugal. Padre de César y Lucrecia Borgia, su figura ha inspirado siglos de literatura, ópera y series de televisión.'
      ),

      h2('Calixto III (1378–1458)'),
      p(
        'Tío del anterior, fue el primer papa valenciano. Durante su breve pontificado (1455–1458) destacó por la revisión del proceso de Juana de Arco, a la que rehabilitó postmortem en 1456.'
      ),

      h2('La casa hoy'),
      p(
        'El edificio conserva elementos originales de la época y se utiliza para exposiciones y actos culturales relacionados con el legado borgiano de la ciudad.'
      ),
    ],
  },

  'colegiata-basilica-de-santa-maria': {
    excerpt:
      'La Seu de Xàtiva: gran basílica renacentista construida sobre la antigua mezquita mayor con mecenazgo de los Borgia.',
    description: [
      p(
        'La Colegiata Basílica de Santa María, conocida popularmente como la Seu, es el gran templo de Xàtiva. Levantada sobre la mezquita mayor de la ciudad tras la Reconquista, resume en su fábrica siglos de historia y el impulso del mecenazgo Borgia.'
      ),

      h2('Historia'),
      p(
        'La construcción actual se inició en 1596 sobre una iglesia anterior gótica, que a su vez se había erigido sobre la mezquita aljama tras la conquista cristiana de 1244. Las obras se prolongaron durante siglos: los incendios de 1707 y los avatares históricos obligaron a sucesivas reconstrucciones. No fue consagrada definitivamente hasta 1909.'
      ),

      h2('Los Borgia y la Seu'),
      p(
        'El mecenazgo de los dos papas valencianos, Calixto III y Alejandro VI, marcó profundamente el templo. Aportaron reliquias, capillas y bienes de altísimo valor artístico que aún hoy forman el núcleo del patrimonio eclesiástico de Xàtiva.'
      ),

      h2('Qué ver'),
      li('Capilla de San Francisco de Borja, descendiente de la familia'),
      li('Retablos barrocos y renacentistas'),
      li('Museo de la Seu con piezas de orfebrería Borgia'),
      li('Custodia procesional de gran valor'),
      li('Cripta y tumbas de ilustres setabenses'),

      h2('Información práctica'),
      li('Horario de culto y visita turística diferenciados'),
      li('Museo con entrada independiente'),
      li('Ubicación en la Plaça de la Seu, centro histórico'),
    ],
  },
};

// =============================================================
// CATEGORÍAS HUÉRFANAS: asignar categoría por slug de lugar
// =============================================================

const categoryAssignments = {
  'colegiata-basilica-de-santa-maria': 'historia',
  'casa-alejandro-vi': 'historia',
  'palau-alarco': 'historia',
  'corpus-christi': 'cultura',
  'fira-dagost': 'cultura',
  'semana-santa-de-xativa': 'cultura',
  'arnadi': 'gastronomia',
};

// =============================================================
// EJECUCIÓN
// =============================================================

async function getPlace(slug) {
  return client.fetch(
    `*[_type == "explorePlace" && slug.current == $slug][0]{_id, title}`,
    { slug }
  );
}

async function getCategoryId(slug) {
  const c = await client.fetch(
    `*[_type == "exploreCategory" && slug.current == $slug][0]{_id}`,
    { slug }
  );
  return c?._id;
}

async function run() {
  console.log('\n=== Enriquecimiento de contenido ===\n');

  // 1. Enriquecer descripciones
  for (const [slug, data] of Object.entries(enrichments)) {
    const place = await getPlace(slug);
    if (!place) {
      console.log(`  ⚠️  ${slug}: no encontrado, salto`);
      continue;
    }
    const patch = {};
    if (data.excerpt) patch.excerpt = data.excerpt;
    if (data.description) patch.description = data.description;

    await client.patch(place._id).set(patch).commit();
    console.log(`  ✅ ${slug}: descripción actualizada (${data.description?.length || 0} bloques)`);
  }

  // 2. Asignar categorías huérfanas
  console.log('\n=== Asignación de categorías ===\n');
  for (const [slug, catSlug] of Object.entries(categoryAssignments)) {
    const place = await getPlace(slug);
    if (!place) {
      console.log(`  ⚠️  ${slug}: no existe lugar`);
      continue;
    }
    const catId = await getCategoryId(catSlug);
    if (!catId) {
      console.log(`  ⚠️  ${slug}: categoría ${catSlug} no existe`);
      continue;
    }
    await client
      .patch(place._id)
      .set({ category: { _type: 'reference', _ref: catId } })
      .commit();
    console.log(`  ✅ ${slug} → ${catSlug}`);
  }

  console.log('\n=== Hecho ===\n');
  console.log('🔐 Recuerda REVOCAR el token en https://www.sanity.io/manage/project/kb9dsoe4/api');
}

run().catch((err) => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
