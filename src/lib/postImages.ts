import { urlFor } from './sanity';

/**
 * Imágenes reales de Xàtiva (Wikimedia Commons, CC) descargadas en /public/images/blog
 * para sobrescribir las imágenes malas/duplicadas que vinieron de la migración.
 */
const postImageOverrides: Record<string, string> = {
  'bienvenidos-a-paraiso-ciclista': '/images/blog/xativa-panoramic.jpg',
  'consejos-esenciales-pedalear-xativa': '/images/blog/xativa-vista2.jpg',
  'las-5-mejores-rutas-ciclistas-de-xativa': '/images/blog/xativa-castell.jpg',
};

export function getPostImage(post: any, width = 1200, height = 600): string {
  const slug = post?.slug?.current;
  const override = slug ? postImageOverrides[slug] : undefined;
  if (override) return override;
  if (post?.mainImage) {
    return urlFor(post.mainImage).width(width).height(height).url();
  }
  return '';
}

export function hasPostImage(post: any): boolean {
  const slug = post?.slug?.current;
  return Boolean((slug && postImageOverrides[slug]) || post?.mainImage);
}
