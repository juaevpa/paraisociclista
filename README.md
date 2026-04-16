# 🚴 Paraíso Ciclista - Web Moderna

Web moderna construida con **Astro** y **Sanity CMS**.

## 🚀 Stack Tecnológico

- **Frontend:** [Astro](https://astro.build/) - Framework ultra-rápido
- **CMS:** [Sanity](https://sanity.io/) - Headless CMS en la nube
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Hosting recomendado:** Vercel / Netlify (GRATIS)

## 📦 Instalación

### 1. Configurar Sanity (CMS)

```bash
# Crear cuenta en sanity.io y un nuevo proyecto
# Luego, en la carpeta /sanity:
cd sanity
npm install
npm run dev
```

Esto abrirá Sanity Studio en `http://localhost:3333`

### 2. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales de Sanity
PUBLIC_SANITY_PROJECT_ID=tu_project_id
PUBLIC_SANITY_DATASET=production
```

### 3. Instalar dependencias del frontend

```bash
npm install
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

La web estará en `http://localhost:4321`

## 🌐 Despliegue

### Opción A: Vercel (Recomendado)

1. Sube el código a GitHub
2. Conecta el repositorio en [vercel.com](https://vercel.com)
3. Añade las variables de entorno en Vercel
4. ¡Listo! Cada push desplegará automáticamente

### Opción B: Netlify

1. Sube el código a GitHub
2. Conecta el repositorio en [netlify.com](https://netlify.com)
3. Configura el comando de build: `npm run build`
4. Configura el directorio de publicación: `dist`
5. Añade las variables de entorno

### Desplegar Sanity Studio

```bash
cd sanity
npm run deploy
```

Esto desplegará el panel de administración en `https://tu-proyecto.sanity.studio`

## 📁 Estructura del Proyecto

```
paraiso-modern/
├── src/
│   ├── components/     # Componentes Astro
│   ├── layouts/        # Layouts base
│   ├── lib/            # Utilidades (Sanity client)
│   └── pages/          # Páginas del sitio
├── sanity/
│   ├── schemas/        # Esquemas de contenido
│   └── sanity.config.ts
├── public/             # Assets estáticos
└── package.json
```

## 📝 Tipos de Contenido

- **Rutas:** Rutas ciclistas con mapa, distancia, dificultad
- **Restaurantes:** Con reseñas, ubicación, contacto
- **Hoteles:** Alojamientos con servicios
- **Explorar:** Lugares de interés por categorías
- **Blog:** Artículos y noticias

## 🎨 Personalización

### Colores

Edita `tailwind.config.mjs` para cambiar los colores principales:

```js
colors: {
  primary: {
    500: '#1979e6', // Color principal
    // ...
  }
}
```

### Fuentes

Las fuentes se cargan desde Google Fonts en `Layout.astro`.

## 📧 Soporte

¿Dudas? Contacta en info@paraisociclista.com
