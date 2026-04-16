import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'route',
  title: 'Ruta',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagen Principal',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'excerpt',
      title: 'Extracto',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'distance',
      title: 'Distancia (km)',
      type: 'number',
    }),
    defineField({
      name: 'elevation',
      title: 'Desnivel (m)',
      type: 'number',
    }),
    defineField({
      name: 'duration',
      title: 'Duración estimada',
      type: 'string',
    }),
    defineField({
      name: 'difficulty',
      title: 'Dificultad',
      type: 'reference',
      to: [{ type: 'routeDifficulty' }],
    }),
    defineField({
      name: 'routeType',
      title: 'Tipo de Ruta',
      type: 'reference',
      to: [{ type: 'routeType' }],
    }),
    defineField({
      name: 'gpxFile',
      title: 'Archivo GPX (URL)',
      type: 'url',
    }),
    defineField({
      name: 'mapEmbed',
      title: 'Código embed del mapa',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'featured',
      title: '¿Destacada?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'gallery',
      title: 'Galería de Imágenes',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      distance: 'distance',
      media: 'mainImage',
    },
    prepare({ title, distance, media }) {
      return {
        title,
        subtitle: distance ? `${distance} km` : '',
        media,
      };
    },
  },
});
