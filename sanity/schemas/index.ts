import route from './route';
import restaurant from './restaurant';
import hotel from './hotel';
import exploreCategory from './exploreCategory';
import explorePlace from './explorePlace';
import blogPost from './blogPost';
import routeDifficulty from './routeDifficulty';
import routeType from './routeType';

export const schemaTypes = [
  // Taxonomías
  routeDifficulty,
  routeType,
  exploreCategory,
  // Contenido
  route,
  restaurant,
  hotel,
  explorePlace,
  blogPost,
];
