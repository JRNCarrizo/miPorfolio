import { useEffect, useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'

async function loadContent() {
  const bust = `t=${Date.now()}`
  const [profile, projectsData, skillsData] = await Promise.all([
    fetch(`/content/profile.json?${bust}`).then((r) => {
      if (!r.ok) throw new Error('No se pudo cargar el perfil')
      return r.json()
    }),
    fetch(`/content/projects.json?${bust}`).then((r) => {
      if (!r.ok) throw new Error('No se pudieron cargar los proyectos')
      return r.json()
    }),
    fetch(`/content/skills.json?${bust}`).then((r) => {
      if (!r.ok) throw new Error('No se pudieron cargar las skills')
      return r.json()
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

  if (error) {
    return (
      <main className="container section">
        <p>{error}</p>
      </main>
    )
  }

  if (!data) {
    return (
      <main className="container section">
        <p>Cargando...</p>
      </main>
    )
  }

  const { profile, projectsData, skillsData } = data

  return (
    <>
      <Nav name={profile.shortName} />
      <main>
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills skillsData={skillsData} />
        <Projects projectsData={projectsData} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  )
}
