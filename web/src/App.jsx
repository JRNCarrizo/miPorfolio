import { useEffect, useState } from 'react'
import Console from './components/Console'
import Loader from './components/Loader'

async function loadContent() {
  const bust = `t=${Date.now()}`
  const [profile, projectsData, skillsData] = await Promise.all([
    fetch(`/content/profile.json?${bust}`).then((response) => {
      if (!response.ok) throw new Error('No se pudo cargar el perfil')
      return response.json()
    }),
    fetch(`/content/projects.json?${bust}`).then((response) => {
      if (!response.ok) throw new Error('No se pudieron cargar los proyectos')
      return response.json()
    }),
    fetch(`/content/skills.json?${bust}`).then((response) => {
      if (!response.ok) throw new Error('No se pudieron cargar las skills')
      return response.json()
    }),
  ])

  return {
    profile,
    projectsData: {
      ...projectsData,
      projects: [...(projectsData.projects || [])].sort((a, b) => a.order - b.order),
    },
    skillsData,
  }
}

export default function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    loadContent()
      .then((next) => {
        if (alive) setData(next)
      })
      .catch((err) => {
        if (alive) setError(err.message || 'Error al cargar contenido')
      })
    return () => {
      alive = false
    }
  }, [])

  if (error) return <Loader error={error} />
  if (!data) return <Loader message="Cargando" />

  return <Console profile={data.profile} projectsData={data.projectsData} skillsData={data.skillsData} />
}
