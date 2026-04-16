import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'routeType',
  title: 'Tipo de Ruta',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre',
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
      name: 'description',
      title: 'Descripción',
      type: 'text',
    }),
    defineField({
      name: 'icon',
      title: 'Icono',
      type: 'string',
      description: 'Emoji o nombre de icono',
    }),
  ],
  preview: {
    select: { title: 'title', icon: 'icon' },
    prepare({ title, icon }) {
      return { title: `${icon || '🚴'} ${title}` };
    },
  },
});
