export function contentUrl(path) {
  if (!path) return ''
  return `/content/${String(path).replace(/^\//, '')}`
}

export function pad2(value) {
  return String(value).padStart(2, '0')
}

export function paragraphs(text) {
  return String(text || '')
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)
}

export function sentence(text, max = 78) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim()
  const end = clean.search(/\.\s/)
  const line = end === -1 ? clean : clean.slice(0, end + 1)
  if (line.length <= max) return line
  return `${line.slice(0, max - 1).trim()}…`
}

export function placeParts(location) {
  const parts = String(location || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
  return {
    city: parts[0] || '',
    country: parts[1] || '',
  }
}

export function skillCount(skillsData) {
  return (skillsData?.categories || []).reduce(
    (total, category) => total + (category.items || []).length,
    0,
  )
}

export function projectsWithSkill(skill, projects) {
  const needle = String(skill || '').toLowerCase()
  return (projects || []).filter((project) =>
    (project.stack || []).some((item) => item.toLowerCase() === needle),
  )
}

export function projectSurfaces(project) {
  const stack = (project?.stack || []).map((item) => item.toLowerCase())
  const surfaces = []
  if (stack.includes('electron')) surfaces.push('escritorio')
  if (stack.includes('capacitor') || stack.includes('react native') || stack.includes('android')) {
    surfaces.push('movil')
  }
  const web =
    Boolean(project?.demoUrl) ||
    stack.includes('html') ||
    (stack.includes('react') && !stack.includes('electron') && !stack.includes('react native'))
  if (web) surfaces.push('web')
  return surfaces
}

export const SURFACES = [
  {
    id: 'web',
    label: 'Web',
    text: 'Interfaces, sitios y sistemas que se usan desde el navegador.',
  },
  {
    id: 'escritorio',
    label: 'Escritorio',
    text: 'Aplicaciones de escritorio para operar un proceso completo.',
  },
  {
    id: 'movil',
    label: 'Móvil',
    text: 'Apps para cargar, consultar y organizar desde el teléfono.',
  },
]

export function projectsForSurface(surfaceId, projects) {
  return (projects || []).filter((project) => projectSurfaces(project).includes(surfaceId))
}

export function handleFromUrl(url) {
  if (!url) return ''
  const clean = String(url).replace(/\/$/, '')
  const parts = clean.split('/').filter(Boolean)
  return parts[parts.length - 1] || ''
}

export function buildChannels(profile) {
  const channels = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      value: profile.phone,
      href: profile.whatsapp ? `https://wa.me/${profile.whatsapp}` : '',
      hint: 'Mensaje directo',
      copy: profile.phone,
    },
    {
      id: 'email',
      label: 'Email',
      value: profile.email,
      href: profile.email ? `mailto:${profile.email}` : '',
      hint: 'Correo',
      copy: profile.email,
    },
    {
      id: 'instagram',
      label: 'Instagram',
      value: handleFromUrl(profile.instagram) ? `@${handleFromUrl(profile.instagram)}` : '',
      href: profile.instagram,
      hint: 'Red',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      value: profile.shortName || profile.name,
      href: profile.linkedin,
      hint: 'Profesional',
    },
    {
      id: 'github',
      label: 'GitHub',
      value: handleFromUrl(profile.github),
      href: profile.github,
      hint: 'Código',
    },
  ]

  return channels.filter((channel) => channel.href && channel.value)
}
