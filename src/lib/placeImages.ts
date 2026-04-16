import { urlFor } from './sanity';

/**
 * Mapeo de slug → imagen local verificada.
 * Se usa cuando la imagen en Sanity es incorrecta/falsa o cuando falta.
 */

const categoryImageOverrides: Record<string, string> = {
  cultura: '/images/blog/xativa-vista2.jpg',
  gastronomia: '/images/categorias/gastronomia.jpg',
  historia: '/images/blog/xativa-castell.jpg',
  naturaleza: '/images/blog/xativa-panoramic.jpg',
};

const placeImageOverrides: Record<string, string> = {
  // Lugares con imagen incorrecta/falsa en Sanity
  'semana-santa-de-xativa': '', // temporalmente sin imagen (la de Sanity es un cartel con "suspendida")
};

export function getCategoryImage(slug: string | undefined): string | null {
  if (!slug) return null;
  return categoryImageOverrides[slug] || null;
}

export function getPlaceImageOverride(slug: string | undefined): string | null | undefined {
  if (!slug) return undefined;
  // `null` o `''` significa: no mostrar imagen aunque Sanity tenga una
  if (slug in placeImageOverrides) {
    return placeImageOverrides[slug] || null;
  }
  return undefined;
}

export function getCategoryImageFor(category: any): string | null {
  if (!category) return null;
  const slug = category.slug?.current || category.slug;
  const override = getCategoryImage(slug);
  if (override) return override;
  if (category.image) return urlFor(category.image).width(800).height(500).url();
  return null;
}
