# Portfolio — Jorge R. N. Carrizo

Sitio público en **React + Vite** y panel local **Electron** para editar contenido y publicarlo en Netlify vía GitHub (sin servidor ni base de datos).

## Estructura

- `web/` — sitio público
- `admin/` — CMS Electron
- `content/` — fuente de verdad (`profile.json`, `projects.json`, `skills.json`, imágenes, CV)

## Requisitos

- Node.js 20+
- Repo Git conectado a GitHub
- Site en Netlify apuntando a este repo

## Web (desarrollo)

```bash
npm run dev:web
```

Abre `http://localhost:5173`. El contenido se lee de `content/` y se copia a `web/public/content` en cada build/dev.

## Build / Netlify

```bash
npm run build:web
```

`netlify.toml` instala y buildea `web/`, y publica `web/dist`.

En Netlify no hace falta base directory especial: el archivo en la raíz ya define el comando.

## Admin Electron

```bash
npm run dev:admin
```

Flujo:

1. Editá **Perfil**, **Proyectos** o **Skills** y guardá (escribe en `content/`).
2. Subí fotos o CV desde los botones del admin.
3. En **Publicar**, hacé commit + push de `content/`.
4. Netlify redeploya solo.

Para previsualizar la web mientras editás, corré `npm run dev:web` en otra terminal (o usá el botón “Abrir web (dev)” del admin).

### Credenciales Git

El push usa tu configuración local (SSH o Git Credential Manager). Si falla el publish, probá `git push` a mano desde la raíz del repo.

## Contenido

| Archivo | Uso |
|---------|-----|
| `content/profile.json` | Nombre, bio, links, contactos, CV |
| `content/projects.json` | Proyectos (orden, stack, imágenes, demos) |
| `content/skills.json` | Stack / habilidades |
| `content/images/` | Fotos de perfil y proyectos |

## Contacto

La sección de contacto muestra WhatsApp, email, Instagram y LinkedIn (sin formulario).
Los datos se editan en `content/profile.json` o desde el admin.
