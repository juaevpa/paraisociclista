# 🔄 Migración de WordPress a Sanity

## Pasos para migrar tu contenido

### Paso 1: Exportar de WordPress

1. Copia el archivo `export-wordpress.php` a la raíz de WordPress:

```bash
copy export-wordpress.php c:\laragon\www\paraiso\
```

2. Abre tu navegador y ve a:
```
http://paraiso.test/export-wordpress.php
```

3. Se mostrará un JSON con todo tu contenido. Guárdalo como `wordpress-export.json` en esta misma carpeta (`migration/`)

### Paso 2: Configurar Sanity

1. Ve a [sanity.io/manage](https://sanity.io/manage) y crea un proyecto
2. Obtén tu **Project ID** 
3. Crea un **Token de escritura**:
   - En tu proyecto → Settings → API → Tokens
   - Add API token → Nombre: "migration" → Permissions: "Editor"
   - Copia el token

### Paso 3: Configurar el script

Abre `import-to-sanity.mjs` y cambia estas líneas:

```javascript
const SANITY_PROJECT_ID = 'TU_PROJECT_ID'; // Pon tu project ID
const SANITY_TOKEN = 'TU_TOKEN_DE_ESCRITURA'; // Pon tu token
```

### Paso 4: Ejecutar la migración

```bash
cd migration
npm install
npm run migrate
```

## ⚠️ Notas importantes

- Las imágenes se suben automáticamente a Sanity
- El contenido HTML se convierte a Portable Text (el formato de Sanity)
- Si ejecutas el script varias veces, sobrescribirá los documentos existentes
- Asegúrate de que Laragon esté corriendo para exportar de WordPress

## 🔧 Solución de problemas

**Error: "No se encontró wordpress-export.json"**
- Asegúrate de haber guardado el JSON del paso 1

**Error: "Invalid token"**
- Verifica que el token tenga permisos de Editor
- Comprueba que el Project ID sea correcto

**Error al subir imágenes**
- Verifica que las URLs de las imágenes sean accesibles
- Laragon debe estar corriendo
