export const SECTIONS = [
  { id: 'inicio', index: '01', label: 'Inicio', key: '1' },
  { id: 'perfil', index: '02', label: 'Perfil', key: '2' },
  { id: 'stack', index: '03', label: 'Stack', key: '3' },
  { id: 'obra', index: '04', label: 'Obra', key: '4' },
  { id: 'contacto', index: '05', label: 'Contacto', key: '5' },
]

export function sectionById(id) {
  return SECTIONS.find((section) => section.id === id) || SECTIONS[0]
}
