<?php
/**
 * Script de exportación de WordPress a JSON
 * 
 * CÓMO USAR:
 * 1. Copia este archivo a la raíz de tu WordPress (c:\laragon\www\paraiso\)
 * 2. Abre en el navegador: http://paraiso.test/export-wordpress.php
 * 3. Se descargará un archivo JSON con todo el contenido
 */

// Cargar WordPress
require_once(__DIR__ . '/../../../../wp-load.php');

// Configurar headers para JSON
header('Content-Type: application/json; charset=utf-8');

$export_data = [
    'routes' => [],
    'restaurants' => [],
    'hotels' => [],
    'explore_places' => [],
    'taxonomies' => [
        'route_difficulty' => [],
        'route_type' => [],
        'explore_category' => [],
    ],
];

// ============================================
// EXPORTAR TAXONOMÍAS
// ============================================

// Dificultades de ruta
$difficulties = get_terms(['taxonomy' => 'route_difficulty', 'hide_empty' => false]);
if (!is_wp_error($difficulties)) {
    foreach ($difficulties as $term) {
        $export_data['taxonomies']['route_difficulty'][] = [
            'id' => $term->term_id,
            'name' => $term->name,
            'slug' => $term->slug,
            'description' => $term->description,
        ];
    }
}

// Tipos de ruta
$types = get_terms(['taxonomy' => 'route_type', 'hide_empty' => false]);
if (!is_wp_error($types)) {
    foreach ($types as $term) {
        $export_data['taxonomies']['route_type'][] = [
            'id' => $term->term_id,
            'name' => $term->name,
            'slug' => $term->slug,
            'description' => $term->description,
        ];
    }
}

// Categorías de explorar
$explore_cats = get_terms(['taxonomy' => 'explore_category', 'hide_empty' => false]);
if (!is_wp_error($explore_cats)) {
    foreach ($explore_cats as $term) {
        $export_data['taxonomies']['explore_category'][] = [
            'id' => $term->term_id,
            'name' => $term->name,
            'slug' => $term->slug,
            'description' => $term->description,
            'image' => get_term_meta($term->term_id, 'category_image', true),
        ];
    }
}

// ============================================
// EXPORTAR RUTAS
// ============================================

$routes = get_posts([
    'post_type' => 'xativa_route',
    'posts_per_page' => -1,
    'post_status' => 'publish',
]);

foreach ($routes as $route) {
    $thumbnail_id = get_post_thumbnail_id($route->ID);
    $thumbnail_url = $thumbnail_id ? wp_get_attachment_url($thumbnail_id) : null;
    
    // Obtener términos de taxonomías
    $difficulty_terms = wp_get_post_terms($route->ID, 'route_difficulty', ['fields' => 'slugs']);
    $type_terms = wp_get_post_terms($route->ID, 'route_type', ['fields' => 'slugs']);
    
    // Obtener campos ACF o meta
    $export_data['routes'][] = [
        'id' => $route->ID,
        'title' => $route->post_title,
        'slug' => $route->post_name,
        'content' => $route->post_content,
        'excerpt' => $route->post_excerpt,
        'featured_image' => $thumbnail_url,
        'date' => $route->post_date,
        // Campos personalizados (ACF o meta)
        'distance' => get_field('distance', $route->ID) ?: get_post_meta($route->ID, 'distance', true),
        'elevation' => get_field('elevation', $route->ID) ?: get_post_meta($route->ID, 'elevation', true),
        'duration' => get_field('duration', $route->ID) ?: get_post_meta($route->ID, 'duration', true),
        'gpx_file' => get_field('gpx_file', $route->ID) ?: get_post_meta($route->ID, 'gpx_file', true),
        'map_embed' => get_field('map_embed', $route->ID) ?: get_post_meta($route->ID, 'map_embed', true),
        'start_point' => get_field('start_point', $route->ID) ?: get_post_meta($route->ID, 'start_point', true),
        'end_point' => get_field('end_point', $route->ID) ?: get_post_meta($route->ID, 'end_point', true),
        // Taxonomías
        'difficulty' => !empty($difficulty_terms) ? $difficulty_terms[0] : null,
        'type' => !empty($type_terms) ? $type_terms[0] : null,
    ];
}

// ============================================
// EXPORTAR RESTAURANTES
// ============================================

$restaurants = get_posts([
    'post_type' => 'xativa_restaurant',
    'posts_per_page' => -1,
    'post_status' => 'publish',
]);

foreach ($restaurants as $restaurant) {
    $thumbnail_id = get_post_thumbnail_id($restaurant->ID);
    $thumbnail_url = $thumbnail_id ? wp_get_attachment_url($thumbnail_id) : null;
    
    $export_data['restaurants'][] = [
        'id' => $restaurant->ID,
        'title' => $restaurant->post_title,
        'slug' => $restaurant->post_name,
        'content' => $restaurant->post_content,
        'excerpt' => $restaurant->post_excerpt,
        'featured_image' => $thumbnail_url,
        'date' => $restaurant->post_date,
        // Campos personalizados
        'rating' => get_field('rating', $restaurant->ID) ?: get_post_meta($restaurant->ID, 'rating', true),
        'price_level' => get_field('price_level', $restaurant->ID) ?: get_post_meta($restaurant->ID, 'price_level', true),
        'address' => get_field('address', $restaurant->ID) ?: get_post_meta($restaurant->ID, 'address', true),
        'phone' => get_field('phone', $restaurant->ID) ?: get_post_meta($restaurant->ID, 'phone', true),
        'website' => get_field('website', $restaurant->ID) ?: get_post_meta($restaurant->ID, 'website', true),
        'latitude' => get_field('latitude', $restaurant->ID) ?: get_post_meta($restaurant->ID, 'latitude', true),
        'longitude' => get_field('longitude', $restaurant->ID) ?: get_post_meta($restaurant->ID, 'longitude', true),
        'google_reviews_url' => get_field('google_reviews_url', $restaurant->ID) ?: get_post_meta($restaurant->ID, 'google_reviews_url', true),
        'cuisine_type' => get_field('cuisine_type', $restaurant->ID) ?: get_post_meta($restaurant->ID, 'cuisine_type', true),
    ];
}

// ============================================
// EXPORTAR HOTELES
// ============================================

$hotels = get_posts([
    'post_type' => 'xativa_hotel',
    'posts_per_page' => -1,
    'post_status' => 'publish',
]);

foreach ($hotels as $hotel) {
    $thumbnail_id = get_post_thumbnail_id($hotel->ID);
    $thumbnail_url = $thumbnail_id ? wp_get_attachment_url($thumbnail_id) : null;
    
    $export_data['hotels'][] = [
        'id' => $hotel->ID,
        'title' => $hotel->post_title,
        'slug' => $hotel->post_name,
        'content' => $hotel->post_content,
        'excerpt' => $hotel->post_excerpt,
        'featured_image' => $thumbnail_url,
        'date' => $hotel->post_date,
        // Campos personalizados
        'rating' => get_field('rating', $hotel->ID) ?: get_post_meta($hotel->ID, 'rating', true),
        'price_level' => get_field('price_level', $hotel->ID) ?: get_post_meta($hotel->ID, 'price_level', true),
        'address' => get_field('address', $hotel->ID) ?: get_post_meta($hotel->ID, 'address', true),
        'phone' => get_field('phone', $hotel->ID) ?: get_post_meta($hotel->ID, 'phone', true),
        'website' => get_field('website', $hotel->ID) ?: get_post_meta($hotel->ID, 'website', true),
        'amenities' => get_field('amenities', $hotel->ID) ?: get_post_meta($hotel->ID, 'amenities', true),
    ];
}

// ============================================
// EXPORTAR LUGARES DE EXPLORAR
// ============================================

$explore_places = get_posts([
    'post_type' => 'xativa_explore',
    'posts_per_page' => -1,
    'post_status' => 'publish',
]);

foreach ($explore_places as $place) {
    $thumbnail_id = get_post_thumbnail_id($place->ID);
    $thumbnail_url = $thumbnail_id ? wp_get_attachment_url($thumbnail_id) : null;
    
    // Obtener categoría
    $category_terms = wp_get_post_terms($place->ID, 'explore_category', ['fields' => 'slugs']);
    
    $export_data['explore_places'][] = [
        'id' => $place->ID,
        'title' => $place->post_title,
        'slug' => $place->post_name,
        'content' => $place->post_content,
        'excerpt' => $place->post_excerpt,
        'featured_image' => $thumbnail_url,
        'date' => $place->post_date,
        // Campos personalizados
        'address' => get_post_meta($place->ID, 'address', true),
        'latitude' => get_post_meta($place->ID, 'latitude', true),
        'longitude' => get_post_meta($place->ID, 'longitude', true),
        'historical_period' => get_post_meta($place->ID, 'historical_period', true),
        'square_size' => get_post_meta($place->ID, 'square_size', true),
        // Categoría
        'category' => !empty($category_terms) ? $category_terms[0] : null,
    ];
}

// ============================================
// EXPORTAR POSTS DE BLOG
// ============================================

$posts = get_posts([
    'post_type' => 'post',
    'posts_per_page' => -1,
    'post_status' => 'publish',
]);

$export_data['blog_posts'] = [];

foreach ($posts as $post) {
    $thumbnail_id = get_post_thumbnail_id($post->ID);
    $thumbnail_url = $thumbnail_id ? wp_get_attachment_url($thumbnail_id) : null;
    
    $export_data['blog_posts'][] = [
        'id' => $post->ID,
        'title' => $post->post_title,
        'slug' => $post->post_name,
        'content' => $post->post_content,
        'excerpt' => $post->post_excerpt,
        'featured_image' => $thumbnail_url,
        'date' => $post->post_date,
        'author' => get_the_author_meta('display_name', $post->post_author),
    ];
}

// Salida JSON
echo json_encode($export_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
