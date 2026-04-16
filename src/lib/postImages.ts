import { urlFor } from './sanity';

const postImageOverrides: Record<string, string> = {
  'bienvenidos-a-paraiso-ciclista':
    'https://images.unsplash.com/photo-1541625602330-2277a4c46182',
  'xativa-paraiso-natural-ciclismo':
    'https://images.unsplash.com/photo-1502744688674-c619d1586c9e',
  'las-5-mejores-rutas-ciclistas-de-xativa':
    'https://images.unsplash.com/photo-1517649763962-0c623066013b',
  'consejos-esenciales-pedalear-xativa':
    'https://images.unsplash.com/photo-1556388158-158ea5ccacbd',
  'xativa-el-nuevo-epicentro-del-ciclismo-profesional-en-la-comunidad-valenciana':
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e',
};

export function getPostImage(post: any, width = 1200, height = 600): string {
  const slug = post?.slug?.current;
  const override = slug ? postImageOverrides[slug] : undefined;
  if (override) {
    return `${override}?w=${width}&h=${height}&fit=crop&crop=entropy&auto=format&q=80`;
  }
  if (post?.mainImage) {
    return urlFor(post.mainImage).width(width).height(height).url();
  }
  return '';
}

export function hasPostImage(post: any): boolean {
  const slug = post?.slug?.current;
  return Boolean((slug && postImageOverrides[slug]) || post?.mainImage);
}
