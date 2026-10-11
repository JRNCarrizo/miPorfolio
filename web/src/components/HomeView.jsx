import { useEffect, useState } from 'react'
import { contentUrl, pad2, paragraphs, placeParts, projectsForSurface, skillCount, SURFACES } from '../lib/content'
import { Corners, Drawer, ModuleFrame, ModuleHead, SideList } from './ui'

const CODE_LINES = [
  'public Builder ship()',
  'const root = createRoot()',
  'ipcMain.handle("open")',
  'Capacitor.getPlatform()',
  'return <Console />',
]

export default function HomeView({
  profile,
  projects,
  skillsData,
  active,
  onSelect,
  onNavigate,
  onOpenProject,
  motion,
  headingRef,
}) {
  const cvHref = contentUrl(profile.cvFile)
  const place = placeParts(profile.location)
  const totalSkills = skillCount(skillsData)
  const bio = paragraphs(profile.bio)
  const goals = paragraphs(profile.objectives)

  const items = [
    { id: 'identidad', index: '01', label: 'Identidad', meta: 'Panel' },
    { id: 'enfoque', index: '02', label: 'Enfoque', meta: 'Lectura' },
    { id: 'alcance', index: '03', label: 'Alcance', meta: 'Superficies' },
    { id: 'objetivo', index: '04', label: 'Objetivo', meta: 'Dirección' },
  ]

  return (
    <ModuleFrame
      motion={motion}
      index="01"
      sidebar={<SideList label="Módulos" items={items} activeId={active} onSelect={onSelect} />}
    >
      <ModuleHead
        index="01"
        kicker="Inicio"
        role={profile.role}
        title={profile.name}
        titleClass="display"
        deck={profile.tagline}
        headingRef={headingRef}
      />
      <div key={active} className="pane">
        {active === 'identidad' ? (
          <Identity
            profile={profile}
            place={place}
            projects={projects.length}
            skills={totalSkills}
            cvHref={cvHref}
            onNavigate={onNavigate}
          />
        ) : null}
        {active === 'enfoque' ? (
          <Brief
            title={profile.aboutTitle}
            paragraphs={bio}
            action="Abrir el dossier"
            onAction={() => onNavigate('perfil', 'bio')}
          />
        ) : null}
        {active === 'alcance' ? <Reach projects={projects} onOpenProject={onOpenProject} /> : null}
        {active === 'objetivo' ? (
          <Brief
            title={profile.objectivesTitle || 'Objetivo'}
            paragraphs={goals}
            action="Leer el objetivo completo"
            onAction={() => onNavigate('perfil', 'objetivo')}
          />
        ) : null}
      </div>
    </ModuleFrame>
  )
}

function Identity({ profile, place, projects, skills, cvHref, onNavigate }) {
  const [spec, setSpec] = useState(false)
  const imageSrc = contentUrl(profile.profileImage)

  return (
    <div className="identity">
      <div>
        <ul className="stats">
          <li className="stat">
            <span className="stat__v">{pad2(projects)}</span>
            <span className="stat__k">Proyectos</span>
          </li>
          <li className="stat">
            <span className="stat__v">{pad2(skills)}</span>
            <span className="stat__k">Tecnologías</span>
          </li>
          <li className="stat">
            <span className="stat__v stat__v--text">{place.city || '—'}</span>
            <span className="stat__k">{place.country || 'Base'}</span>
          </li>
        </ul>
        <div className="actions">
          <button type="button" className="btn" onClick={() => onNavigate('obra')}>
            Ver obra
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => onNavigate('contacto')}>
            Contacto
          </button>
          {cvHref ? (
            <a className="btn btn--ghost" href={cvHref} download>
              Descargar CV
            </a>
          ) : null}
        </div>
      </div>

      <div className="portrait-wrap">
        <div className={spec ? 'portrait is-spec' : 'portrait'}>
          <div className="portrait__spin">
            <div className="portrait__face">
              {imageSrc ? (
                <img src={imageSrc} alt="" />
              ) : (
                <div className="portrait__empty">{profile.shortName || profile.name}</div>
              )}
              <CodeVeil />
              <Corners />
            </div>
            <div className="portrait__face portrait__face--back">
              <p className="kicker">Ficha</p>
              <p className="portrait__role">{profile.role}</p>
              {profile.location ? <p className="portrait__place">{profile.location}</p> : null}
            </div>
          </div>
        </div>
        <button type="button" className="btn btn--ghost btn--small" onClick={() => setSpec((value) => !value)}>
          {spec ? 'Ver foto' : 'Ver ficha'}
        </button>
      </div>
    </div>
  )
}

function CodeVeil() {
  const [text, setText] = useState('')

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) {
      setText(CODE_LINES[0])
      return undefined
    }

    let line = 0
    let index = 0
    let hold = 0
    let timer = 0

    const tick = () => {
      const current = CODE_LINES[line]
      if (index < current.length) {
        index += 1
        setText(current.slice(0, index))
        timer = window.setTimeout(tick, 42)
        return
      }
      if (hold < 18) {
        hold += 1
        timer = window.setTimeout(tick, 70)
        return
      }
      line = (line + 1) % CODE_LINES.length
      index = 0
      hold = 0
      setText('')
      timer = window.setTimeout(tick, 220)
    }

    timer = window.setTimeout(tick, 400)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="code-veil" aria-hidden="true">
      <span className="code-veil__scan" />
      <span className="code-veil__token code-veil__token--a">await</span>
      <span className="code-veil__token code-veil__token--b">{'{ }'}</span>
      <span className="code-veil__token code-veil__token--c">0x7F</span>
      <p className="code-veil__line">
        <span className="code-veil__mark">{'>'}</span>
        {text}
        <span className="code-veil__caret" />
      </p>
    </div>
  )
}

function Brief({ title, paragraphs: blocks, action, onAction }) {
  const [open, setOpen] = useState(false)
  const [first, ...rest] = blocks

  return (
    <div className="brief">
      {title ? <h2 className="pane-title">{title}</h2> : null}
      {first ? <p className="prose">{first}</p> : null}
      {rest.length ? (
        <Drawer
          kicker={pad2(rest.length)}
          title={rest.length === 1 ? 'Seguir leyendo' : 'Seguir leyendo el resto'}
          open={open}
          onToggle={() => setOpen((value) => !value)}
        >
          {rest.map((paragraph, index) => (
            <p key={index} className="prose">
              {paragraph}
            </p>
          ))}
        </Drawer>
      ) : null}
      <div className="actions">
        <button type="button" className="btn" onClick={onAction}>
          {action}
        </button>
      </div>
    </div>
  )
}

function Reach({ projects, onOpenProject }) {
  const [openId, setOpenId] = useState(SURFACES[0].id)

  return (
    <div className="reach">
      {SURFACES.map((surface, index) => {
        const list = projectsForSurface(surface.id, projects)
        return (
          <Drawer
            key={surface.id}
            kicker={pad2(index + 1)}
            title={`${surface.label} · ${pad2(list.length)}`}
            open={openId === surface.id}
            onToggle={() => setOpenId((current) => (current === surface.id ? '' : surface.id))}
          >
            <p className="prose">{surface.text}</p>
            <div className="records">
              {list.map((project, projectIndex) => (
                <button
                  key={project.id}
                  type="button"
                  className="record"
                  onClick={() => onOpenProject(project.id)}
                >
                  <span className="record__index">{pad2(projectIndex + 1)}</span>
                  <span>
                    <span className="record__title">{project.title}</span>
                    <span className="record__meta">{project.summary}</span>
                  </span>
                  <span className="record__go">Abrir</span>
                </button>
              ))}
            </div>
          </Drawer>
        )
      })}
    </div>
  )
}
