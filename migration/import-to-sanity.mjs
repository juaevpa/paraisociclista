/**
 * Script de importación a Sanity
 * 
 * CÓMO USAR:
 * 1. Primero ejecuta export-wordpress.php y guarda el JSON
 * 2. Configura las variables de entorno abajo
 * 3. Ejecuta: node import-to-sanity.mjs
 */

import { createClient } from '@sanity/client';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// CONFIGURACIÓN - ¡CAMBIA ESTOS VALORES!
// ============================================

const SANITY_PROJECT_ID = 'kb9dsoe4'; // Cambia esto
const SANITY_DATASET = 'production';
const SANITY_TOKEN = 'sklYB7IRiC2tbqtvn1JaMpiDT9vPnTU67tZSI6NaBQkm3CuCqZJqz0LtPJYe6XkXmQdMEHkWuHw8aMu7zo7sPmXqJiwXoOexSCiDdPdFhnH7ZSmfXMnm68lwHGNX3xeFwOQOpkdLME1WwakZNmA6441qNvOf3ti1dobOEGfsk5QRt62hDvBd'; // Obtén esto en sanity.io/manage

// ============================================

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01',
});

// Función para convertir HTML a bloques de Sanity
function htmlToPortableText(html) {
  if (!html) return [];
  
  // Simplificación: convertir párrafos HTML básicos
  const blocks = [];
  const dom = new JSDOM(`<!DOCTYPE html><body>${html}</body>`);
  const body = dom.window.document.body;
  
  // Obtener todos los nodos de texto y párrafos
  const walker = dom.window.document.createTreeWalker(
    body,
    dom.window.NodeFilter.SHOW_TEXT | dom.window.NodeFilter.SHOW_ELEMENT,
    null,
    false
  );
  
  let currentText = '';
  let node;
  
  while (node = walker.nextNode()) {
    if (node.nodeType === 3) { // Text node
      currentText += node.textContent;
    } else if (node.nodeName === 'P' || node.nodeName === 'BR') {
      if (currentText.trim()) {
        blocks.push({
          _type: 'block',
          _key: Math.random().toString(36).substr(2, 9),
          style: 'normal',
          markDefs: [],
          children: [{
            _type: 'span',
            _key: Math.random().toString(36).substr(2, 9),
            text: currentText.trim(),
            marks: [],
          }],
        });
        currentText = '';
      }
    } else if (node.nodeName === 'H2' || node.nodeName === 'H3') {
      if (currentText.trim()) {
        blocks.push({
          _type: 'block',
          _key: Math.random().toString(36).substr(2, 9),
          style: node.nodeName.toLowerCase(),
          markDefs: [],
          children: [{
            _type: 'span',
            _key: Math.random().toString(36).substr(2, 9),
            text: currentText.trim(),
            marks: [],
          }],
        });
        currentText = '';
      }
    }
  }
  
  // Añadir el último texto si existe
  if (currentText.trim()) {
    blocks.push({
      _type: 'block',
      _key: Math.random().toString(36).substr(2, 9),
      style: 'normal',
      markDefs: [],
      children: [{
        _type: 'span',
        _key: Math.random().toString(36).substr(2, 9),
        text: currentText.trim(),
        marks: [],
      }],
    });
  }
  
  return blocks.length > 0 ? blocks : [{
    _type: 'block',
    _key: Math.random().toString(36).substr(2, 9),
    style: 'normal',
    markDefs: [],
    children: [{
      _type: 'span',
      _key: Math.random().toString(36).substr(2, 9),
      text: html.replace(/<[^>]*>/g, ' ').trim() || '',
      marks: [],
    }],
  }];
}

// Función para subir imagen desde URL
async function uploadImage(imageUrl) {
  if (!imageUrl) return null;
  
  try {
    console.log(`  📷 Subiendo imagen: ${imageUrl}`);
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: path.basename(imageUrl),
    });
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    };
  } catch (error) {
    console.error(`  ❌ Error subiendo imagen: ${error.message}`);
    return null;
  }
}

// ============================================
// FUNCIONES DE IMPORTACIÓN
// ============================================

async function importDifficulties(difficulties) {
  console.log('\n📊 Importando dificultades de ruta...');
  const refs = {};
  
  for (const diff of difficulties) {
    const doc = {
      _type: 'routeDifficulty',
      _id: `difficulty-${diff.slug}`,
      title: diff.name,
      slug: { _type: 'slug', current: diff.slug },
      description: diff.description || '',
    };
    
    await client.createOrReplace(doc);
    refs[diff.slug] = doc._id;
    console.log(`  ✅ ${diff.name}`);
  }
  
  return refs;
}

async function importRouteTypes(types) {
  console.log('\n🚴 Importando tipos de ruta...');
  const refs = {};
  
  for (const type of types) {
    const doc = {
      _type: 'routeType',
      _id: `type-${type.slug}`,
      title: type.name,
      slug: { _type: 'slug', current: type.slug },
      description: type.description || '',
    };
    
    await client.createOrReplace(doc);
    refs[type.slug] = doc._id;
    console.log(`  ✅ ${type.name}`);
  }
  
  return refs;
}

async function importExploreCategories(categories) {
  console.log('\n📍 Importando categorías de explorar...');
  const refs = {};
  
  for (const cat of categories) {
    const doc = {
      _type: 'exploreCategory',
      _id: `explore-cat-${cat.slug}`,
      title: cat.name,
      slug: { _type: 'slug', current: cat.slug },
      description: cat.description || '',
    };
    
    if (cat.image) {
      doc.icon = await uploadImage(cat.image);
    }
    
    await client.createOrReplace(doc);
    refs[cat.slug] = doc._id;
    console.log(`  ✅ ${cat.name}`);
  }
  
  return refs;
}

async function importRoutes(routes, difficultyRefs, typeRefs) {
  console.log('\n🛤️ Importando rutas...');
  
  for (const route of routes) {
    console.log(`  Procesando: ${route.title}`);
    
    const doc = {
      _type: 'route',
      _id: `route-${route.id}`,
      title: route.title,
      slug: { _type: 'slug', current: route.slug },
      description: htmlToPortableText(route.content),
      excerpt: route.excerpt || '',
      distance: route.distance ? parseFloat(route.distance) : null,
      elevation: route.elevation ? parseInt(route.elevation) : null,
      duration: route.duration || '',
      gpxFile: route.gpx_file || '',
      mapEmbed: route.map_embed || '',
      startPoint: route.start_point || '',
      endPoint: route.end_point || '',
    };
    
    // Imagen destacada
    if (route.featured_image) {
      doc.mainImage = await uploadImage(route.featured_image);
    }
    
    // Referencias a taxonomías
    if (route.difficulty && difficultyRefs[route.difficulty]) {
      doc.difficulty = {
        _type: 'reference',
        _ref: difficultyRefs[route.difficulty],
      };
    }
    
    if (route.type && typeRefs[route.type]) {
      doc.routeType = {
        _type: 'reference',
        _ref: typeRefs[route.type],
      };
    }
    
    await client.createOrReplace(doc);
    console.log(`  ✅ ${route.title}`);
  }
}

async function importRestaurants(restaurants) {
  console.log('\n🍽️ Importando restaurantes...');
  
  for (const rest of restaurants) {
    console.log(`  Procesando: ${rest.title}`);
    
    const doc = {
      _type: 'restaurant',
      _id: `restaurant-${rest.id}`,
      title: rest.title,
      slug: { _type: 'slug', current: rest.slug },
      description: htmlToPortableText(rest.content),
      excerpt: rest.excerpt || '',
      rating: rest.rating ? parseFloat(rest.rating) : null,
      priceLevel: rest.price_level ? parseInt(rest.price_level) : null,
      address: rest.address || '',
      phone: rest.phone || '',
      website: rest.website || '',
      googleReviewsUrl: rest.google_reviews_url || '',
      cuisineType: rest.cuisine_type || '',
    };
    
    // Coordenadas
    if (rest.latitude && rest.longitude) {
      doc.location = {
        _type: 'geopoint',
        lat: parseFloat(rest.latitude),
        lng: parseFloat(rest.longitude),
      };
    }
    
    // Imagen destacada
    if (rest.featured_image) {
      doc.mainImage = await uploadImage(rest.featured_image);
    }
    
    await client.createOrReplace(doc);
    console.log(`  ✅ ${rest.title}`);
  }
}

async function importHotels(hotels) {
  console.log('\n🏨 Importando hoteles...');
  
  for (const hotel of hotels) {
    console.log(`  Procesando: ${hotel.title}`);
    
    const doc = {
      _type: 'hotel',
      _id: `hotel-${hotel.id}`,
      title: hotel.title,
      slug: { _type: 'slug', current: hotel.slug },
      description: htmlToPortableText(hotel.content),
      excerpt: hotel.excerpt || '',
      rating: hotel.rating ? parseFloat(hotel.rating) : null,
      priceLevel: hotel.price_level ? parseInt(hotel.price_level) : null,
      address: hotel.address || '',
      phone: hotel.phone || '',
      website: hotel.website || '',
    };
    
    // Amenities
    if (hotel.amenities) {
      if (typeof hotel.amenities === 'string') {
        doc.amenities = hotel.amenities.split(',').map(a => a.trim());
      } else if (Array.isArray(hotel.amenities)) {
        doc.amenities = hotel.amenities;
      }
    }
    
    // Imagen destacada
    if (hotel.featured_image) {
      doc.mainImage = await uploadImage(hotel.featured_image);
    }
    
    await client.createOrReplace(doc);
    console.log(`  ✅ ${hotel.title}`);
  }
}

async function importExplorePlaces(places, categoryRefs) {
  console.log('\n🗺️ Importando lugares de explorar...');
  
  for (const place of places) {
    console.log(`  Procesando: ${place.title}`);
    
    const doc = {
      _type: 'explorePlace',
      _id: `explore-${place.id}`,
      title: place.title,
      slug: { _type: 'slug', current: place.slug },
      description: htmlToPortableText(place.content),
      excerpt: place.excerpt || '',
      address: place.address || '',
      historicalPeriod: place.historical_period || '',
    };
    
    // Coordenadas
    if (place.latitude && place.longitude) {
      doc.location = {
        _type: 'geopoint',
        lat: parseFloat(place.latitude),
        lng: parseFloat(place.longitude),
      };
    }
    
    // Categoría
    if (place.category && categoryRefs[place.category]) {
      doc.category = {
        _type: 'reference',
        _ref: categoryRefs[place.category],
      };
    }
    
    // Imagen destacada
    if (place.featured_image) {
      doc.mainImage = await uploadImage(place.featured_image);
    }
    
    await client.createOrReplace(doc);
    console.log(`  ✅ ${place.title}`);
  }
}

async function importBlogPosts(posts) {
  console.log('\n📝 Importando posts del blog...');
  
  for (const post of posts) {
    console.log(`  Procesando: ${post.title}`);
    
    const doc = {
      _type: 'blogPost',
      _id: `post-${post.id}`,
      title: post.title,
      slug: { _type: 'slug', current: post.slug },
      content: htmlToPortableText(post.content),
      excerpt: post.excerpt || '',
      author: post.author || '',
      publishedAt: post.date,
    };
    
    // Imagen destacada
    if (post.featured_image) {
      doc.mainImage = await uploadImage(post.featured_image);
    }
    
    await client.createOrReplace(doc);
    console.log(`  ✅ ${post.title}`);
  }
}

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================

async function main() {
  console.log('🚀 Iniciando migración de WordPress a Sanity...\n');
  
  // Verificar que existe el archivo de exportación
  const exportFile = path.join(__dirname, 'wordpress-export.json');
  
  if (!fs.existsSync(exportFile)) {
    console.error('❌ Error: No se encontró el archivo wordpress-export.json');
    console.log('\nPasos para crear el archivo:');
    console.log('1. Copia export-wordpress.php a c:\\laragon\\www\\paraiso\\');
    console.log('2. Abre http://paraiso.test/export-wordpress.php en el navegador');
    console.log('3. Guarda el contenido como wordpress-export.json en esta carpeta');
    process.exit(1);
  }
  
  // Cargar datos
  const data = JSON.parse(fs.readFileSync(exportFile, 'utf-8'));
  
  console.log('📦 Datos encontrados:');
  console.log(`  - ${data.routes?.length || 0} rutas`);
  console.log(`  - ${data.restaurants?.length || 0} restaurantes`);
  console.log(`  - ${data.hotels?.length || 0} hoteles`);
  console.log(`  - ${data.explore_places?.length || 0} lugares de explorar`);
  console.log(`  - ${data.blog_posts?.length || 0} posts de blog`);
  
  try {
    // Importar taxonomías primero (para tener las referencias)
    const difficultyRefs = await importDifficulties(data.taxonomies?.route_difficulty || []);
    const typeRefs = await importRouteTypes(data.taxonomies?.route_type || []);
    const categoryRefs = await importExploreCategories(data.taxonomies?.explore_category || []);
    
    // Importar contenido
    await importRoutes(data.routes || [], difficultyRefs, typeRefs);
    await importRestaurants(data.restaurants || []);
    await importHotels(data.hotels || []);
    await importExplorePlaces(data.explore_places || [], categoryRefs);
    await importBlogPosts(data.blog_posts || []);
    
    console.log('\n✅ ¡Migración completada con éxito!');
    console.log('\nAhora puedes ver tu contenido en:');
    console.log(`https://${SANITY_PROJECT_ID}.sanity.studio`);
    
  } catch (error) {
    console.error('\n❌ Error durante la migración:', error.message);
    process.exit(1);
  }
}

main();
