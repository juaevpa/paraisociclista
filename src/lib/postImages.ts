import { urlFor } from './sanity';

export function getPostImage(post: any, width = 1200, height = 600): string {
  if (post?.mainImage) {
    return urlFor(post.mainImage).width(width).height(height).url();
  }
  return '';
}

export function hasPostImage(post: any): boolean {
  return Boolean(post?.mainImage);
}
