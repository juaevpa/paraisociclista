import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'hotel',
  title: 'Hoteles',
  type: 'document',
  icon: () => '🏨',
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagen Principal',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'gallery',
      title: 'Galería de Fotos',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'rating',
      title: 'Valoración (1-5)',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: 'priceLevel',
      title: 'Nivel de Precio (1-4)',
      type: 'number',
      description: '1 = €, 2 = €€, 3 = €€€, 4 = €€€€',
      validation: (Rule) => Rule.min(1).max(4),
    }),
    defineField({
      name: 'address',
      title: 'Dirección',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Teléfono',
      type: 'string',
    }),
    defineField({
      name: 'website',
      title: 'Sitio Web',
      type: 'url',
    }),
    defineField({
      name: 'location',
      title: 'Ubicación',
      type: 'geopoint',
    }),
    defineField({
      name: 'amenities',
      title: 'Servicios',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'WiFi', value: 'wifi' },
          { title: 'Parking', value: 'parking' },
          { title: 'Piscina', value: 'pool' },
          { title: 'Restaurante', value: 'restaurant' },
          { title: 'Gimnasio', value: 'gym' },
          { title: 'Spa', value: 'spa' },
          { title: 'Guardabicis', value: 'bike-storage' },
          { title: 'Aire Acondicionado', value: 'ac' },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      rating: 'rating',
      media: 'mainImage',
    },
    prepare({ title, rating, media }) {
      return {
        title,
        subtitle: rating ? `⭐ ${rating}/5` : '',
        media,
      };
    },
  },
});
