import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Configuración del cliente de Sanity
// Estos valores se obtienen al crear un proyecto en sanity.io
export const sanityClient = createClient({
  projectId: 'kb9dsoe4',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

// Generador de URLs para imágenes
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Tipos TypeScript para los contenidos
export interface Route {
  _id: string;
  title: string;
  slug: { current: string };
  description: any[]; // Portable Text
  mainImage: SanityImageSource;
  distance: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  featured: boolean;
  gpxFile?: { asset: { url: string } };
  mapEmbed?: string;
  routeType?: string[];
}

export interface Restaurant {
  _id: string;
  title: string;
  slug: { current: string };
  description: any[];
  mainImage: SanityImageSource;
  gallery?: SanityImageSource[];
  rating: number;
  priceLevel: number;
  address: string;
  phone?: string;
  website?: string;
  location?: { lat: number; lng: number };
  reviews?: {
    author: string;
    rating: number;
    text: string;
    profilePhoto?: string;
  }[];
}

export interface Hotel {
  _id: string;
  title: string;
  slug: { current: string };
  description: any[];
  mainImage: SanityImageSource;
  gallery?: SanityImageSource[];
  rating: number;
  priceLevel: number;
  address: string;
  phone?: string;
  website?: string;
  location?: { lat: number; lng: number };
  amenities?: string[];
}

export interface ExplorePlace {
  _id: string;
  title: string;
  slug: { current: string };
  description: any[];
  mainImage: SanityImageSource;
  category: {
    _id: string;
    title: string;
    slug: { current: string };
  };
}

export interface ExploreCategory {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  image?: SanityImageSource;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  content: any[];
  mainImage: SanityImageSource;
  publishedAt: string;
  author?: string;
}

// Queries GROQ
export const queries = {
  // Rutas
  allRoutes: `*[_type == "route"] | order(featured desc, _createdAt desc) {
    _id, title, slug, mainImage, distance, difficulty, featured, routeType
  }`,
  
  featuredRoutes: `*[_type == "route" && featured == true][0...3] {
    _id, title, slug, mainImage, distance, difficulty, featured, mapEmbed
  }`,
  
  routeBySlug: `*[_type == "route" && slug.current == $slug][0] {
    _id, title, slug, description, mainImage, distance, difficulty, 
    featured, gpxFile, mapEmbed, routeType
  }`,

  // Restaurantes
  allRestaurants: `*[_type == "restaurant"] | order(_createdAt desc) {
    _id, title, slug, mainImage, rating, priceLevel, address
  }`,
  
  restaurantBySlug: `*[_type == "restaurant" && slug.current == $slug][0] {
    _id, title, slug, description, mainImage, gallery, rating, priceLevel,
    address, phone, website, location, reviews
  }`,

  // Hoteles
  allHotels: `*[_type == "hotel"] | order(_createdAt desc) {
    _id, title, slug, mainImage, rating, priceLevel, address
  }`,
  
  hotelBySlug: `*[_type == "hotel" && slug.current == $slug][0] {
    _id, title, slug, description, mainImage, gallery, rating, priceLevel,
    address, phone, website, location, amenities
  }`,

  // Explorar
  allExploreCategories: `*[_type == "exploreCategory"] {
    _id, title, slug, description, image
  }`,
  
  allExplorePlaces: `*[_type == "explorePlace"] | order(_createdAt desc) {
    _id, title, slug, mainImage, category->{ _id, title, slug }
  }`,
  
  explorePlacesByCategory: `*[_type == "explorePlace" && category->slug.current == $categorySlug] {
    _id, title, slug, mainImage, description
  }`,

  // Blog
  allBlogPosts: `*[_type == "blogPost"] | order(publishedAt desc) {
    _id, title, slug, excerpt, mainImage, publishedAt, author
  }`,
  
  blogPostBySlug: `*[_type == "blogPost" && slug.current == $slug][0] {
    _id, title, slug, content, mainImage, publishedAt, author
  }`,

  // Home
  homeContent: `{
    "featuredRoutes": *[_type == "route" && featured == true][0...3] {
      _id, title, slug, mainImage, distance, difficulty, mapEmbed
    },
    "latestRestaurants": *[_type == "restaurant"] | order(_createdAt desc)[0...3] {
      _id, title, slug, mainImage, rating
    },
    "latestHotels": *[_type == "hotel"] | order(_createdAt desc)[0...3] {
      _id, title, slug, mainImage, rating
    },
    "exploreCategories": *[_type == "exploreCategory"] {
      _id, title, slug, description, image
    }
  }`,
};
