import { useCallback, useEffect, useState } from 'react'
import ProfileEditor from './components/ProfileEditor'
import ProjectsEditor from './components/ProjectsEditor'
import SkillsEditor from './components/SkillsEditor'
import PublishPanel from './components/PublishPanel'

const TABS = [
  { id: 'profile', label: 'Perfil' },
  { id: 'projects', label: 'Proyectos' },
  { id: 'skills', label: 'Skills' },
  { id: 'publish', label: 'Publicar' },
]

export default function App() {
  const [tab, setTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState(null)
  const [skills, setSkills] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await window.adminApi.getAll()
      setProfile(data.profile)
      setProjects(data.projects)
      setSkills(data.skills)
    } catch (err) {
      setError(err?.message || 'No se pudo cargar el contenido')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function saveProfile() {
    setStatus('')
    await window.adminApi.saveProfile(profile)
    setStatus('Perfil guardado. Andá a Publicar para subirlo a la web.')
  }

  async function saveProjects(nextProjects = projects) {
    setStatus('')
    await window.adminApi.saveProjects(nextProjects)
    setProjects(nextProjects)
    setStatus('Proyectos guardados. Andá a Publicar para subirlo a la web.')
  }

  async function saveSkills(nextSkills = skills) {
    setStatus('')
    await window.adminApi.saveSkills(nextSkills)
    setSkills(nextSkills)
    setStatus('Skills guardadas. Andá a Publicar para subirlo a la web.')
  }

  if (loading) {
    return (
      <div className="app">
        <div className="topbar">
          <h1>Portfolio Admin</h1>
        </div>
        <div className="panel">
          <p className="muted">Cargando contenido...</p>
        </div>
      </div>
    )
  }

  if (error || !profile || !projects || !skills) {
    return (
      <div className="app">
        <div className="topbar">
          <h1>Portfolio Admin</h1>
        </div>
        <div className="panel">
          <p className="status status--error">{error || 'Contenido incompleto'}</p>
          <button className="btn" onClick={load}>
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>Portfolio Admin</h1>
        <div className="topbar__actions">
          <button className="btn" onClick={() => window.adminApi.openWebDev()}>
            Abrir web (dev)
          </button>
          <button className="btn" onClick={load}>
            Recargar desde disco
          </button>
        </div>
      </header>

      <nav className="tabs">
        {TABS.map((item) => (
          <button
            key={item.id}
            className={`tab ${tab === item.id ? 'tab--active' : ''}`}
            onClick={() => {
              setTab(item.id)
              setStatus('')
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <main className="panel">
        {tab === 'profile' ? (
          <ProfileEditor
            profile={profile}
            setProfile={setProfile}
            onSave={saveProfile}
            setStatus={setStatus}
          />
        ) : null}
        {tab === 'projects' ? (
          <ProjectsEditor
            projects={projects}
            setProjects={setProjects}
            onSave={saveProjects}
            setStatus={setStatus}
          />
        ) : null}
        {tab === 'skills' ? (
          <SkillsEditor
            skills={skills}
            setSkills={setSkills}
            onSave={saveSkills}
          />
        ) : null}
        {tab === 'publish' ? <PublishPanel setStatus={setStatus} /> : null}

        {status ? <p className="status status--ok">{status}</p> : null}
      </main>
    </div>
  )
}
