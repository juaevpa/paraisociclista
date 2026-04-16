import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'routeDifficulty',
  title: 'Dificultad de Ruta',
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
      name: 'color',
      title: 'Color (para badges)',
      type: 'string',
      options: {
        list: [
          { title: 'Verde (Fácil)', value: 'green' },
          { title: 'Amarillo (Moderado)', value: 'yellow' },
          { title: 'Naranja (Difícil)', value: 'orange' },
          { title: 'Rojo (Muy Difícil)', value: 'red' },
        ],
      },
    }),
  ],
  preview: {
    select: { title: 'title' },
  },
});
