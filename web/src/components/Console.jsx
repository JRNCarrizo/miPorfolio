import { useEffect, useRef, useState } from 'react'
import ContactView from './ContactView'
import HomeView from './HomeView'
import ProfileView from './ProfileView'
import StackView from './StackView'
import WorkView from './WorkView'
import { CopyButton } from './ui'
import { PanelsContext } from '../lib/panels'
import {
  buildChannels,
  contentUrl,
  pad2,
  paragraphs,
  placeParts,
  projectsWithSkill,
  sentence,
  skillCount,
  SURFACES,
  projectSurfaces,
  projectsForSurface,
} from '../lib/content'
import { SECTIONS, sectionById } from '../lib/sections'

function useCompact() {
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 1100px)')
    const update = () => setCompact(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return compact
}

function Clock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const time = new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now)

  return (
    <time className="clock" dateTime={now.toISOString()}>
      {time}
    </time>
  )
}

function readFlag(key) {
  try {
    return window.sessionStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

function writeFlag(key, value) {
  try {
    window.sessionStorage.setItem(key, value ? '1' : '0')
  } catch {
    // La sesión puede estar bloqueada. El plegado sigue funcionando en memoria.
  }
}
function sectionFromLocation() {
  if (typeof window === 'undefined') return 'inicio'
  const raw = window.location.hash.replace('#', '')
  return SECTIONS.some((item) => item.id === raw) ? raw : 'inicio'
}

export default function Console({ profile, projectsData, skillsData }) {
  const projects = projectsData?.projects || []
  const categories = skillsData?.categories || []
  const channels = buildChannels(profile)
  const compact = useCompact()
  const headingRef = useRef(null)
  const indexRef = useRef(SECTIONS.findIndex((item) => item.id === sectionFromLocation()))
  const [section, setSection] = useState(sectionFromLocation)
  const [motion, setMotion] = useState('forward')
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [railFolded, setRailFolded] = useState(() => readFlag('rail-folded'))
  const [railPeek, setRailPeek] = useState(false)
  const [fichaFolded, setFichaFolded] = useState(() => readFlag('ficha-folded'))
  const [fichaPeek, setFichaPeek] = useState(false)
  const [keysOpen, setKeysOpen] = useState(false)

  useEffect(() => {
    writeFlag('rail-folded', railFolded)
  }, [railFolded])

  useEffect(() => {
    writeFlag('ficha-folded', fichaFolded)
  }, [fichaFolded])

  const [selected, setSelected] = useState({
    inicio: 'identidad',
    perfil: 'bio',
    stack: categories[0]?.id || '',
    obra: projects[0]?.id || '',
    contacto: channels[0]?.id || 'whatsapp',
  })

  function navigate(id, selectionId) {
    const next = sectionById(id)
    const nextIndex = SECTIONS.findIndex((item) => item.id === next.id)
    if (selectionId) {
      setSelected((current) => ({ ...current, [next.id]: selectionId }))
    }
    setMotion(nextIndex >= indexRef.current ? 'forward' : 'back')
    indexRef.current = nextIndex
    setSection(next.id)
    const hash = `#${next.id}`
    if (window.location.hash !== hash) {
      window.history.pushState(null, '', hash)
    }
  }

  function select(id) {
    setSelected((current) => ({ ...current, [section]: id }))
  }

  function openProject(id) {
    setSelected((current) => ({ ...current, obra: id }))
    navigate('obra')
  }

  useEffect(() => {
    function readHash() {
      const raw = window.location.hash.replace('#', '')
      const nextIndex = SECTIONS.findIndex((item) => item.id === raw)
      const safe = nextIndex === -1 ? 0 : nextIndex
      if (nextIndex === -1) {
        window.history.replaceState(null, '', '#inicio')
      }
      setMotion(safe >= indexRef.current ? 'forward' : 'back')
      indexRef.current = safe
      setSection(SECTIONS[safe].id)
    }

    if (!window.location.hash) {
      window.history.replaceState(null, '', '#inicio')
    }
    readHash()
    window.addEventListener('popstate', readHash)
    return () => window.removeEventListener('popstate', readHash)
  }, [])

  useEffect(() => {
    const current = sectionById(section)
    document.title = `${current.label} — ${profile.name}`
  }, [section, profile.name])

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [section])

  useEffect(() => {
    function onKey(event) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const tag = event.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target?.isContentEditable) return
      if (event.key === 'Escape') {
        if (keysOpen) {
          setKeysOpen(false)
          return
        }
        setInspectorOpen(false)
        setFichaPeek(false)
        return
      }
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        const buttons = [...document.querySelectorAll('.sidebar .side-btn')]
        if (!buttons.length) return
        event.preventDefault()
        event.stopPropagation()
        const current = buttons.findIndex((button) => button.getAttribute('aria-current') === 'true')
        const delta = event.key === 'ArrowDown' ? 1 : -1
        const nextIndex = current === -1 ? (delta > 0 ? 0 : buttons.length - 1) : current + delta
        const next = buttons[nextIndex]
        if (!next) return
        next.click()
        next.scrollIntoView({ block: 'nearest' })
        return
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        event.stopPropagation()
        setRailPeek(false)
        setRailFolded((folded) => (folded && !railPeek ? false : true))
        return
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        event.stopPropagation()
        if (compact) {
          setInspectorOpen((open) => !open)
          return
        }
        setFichaPeek(false)
        setFichaFolded((folded) => (folded && !fichaPeek ? false : true))
        return
      }
      const index = SECTIONS.findIndex((item) => item.key === event.key)
      if (index === -1) return
      event.preventDefault()
      navigate(SECTIONS[index].id)
    }

    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  })

  const fichaNarrow = !compact && fichaFolded && !fichaPeek
  const sectionIndex = Math.max(0, SECTIONS.findIndex((item) => item.id === section))
  const place = placeParts(profile.location)
  const year = new Date().getFullYear()
  const panels = {
    railFolded,
    railPeek,
    setRailFolded,
    setRailPeek,
    fichaFolded,
    fichaPeek,
    setFichaFolded,
    setFichaPeek,
  }

  return (
    <PanelsContext.Provider value={panels}>
    <div className={inspectorOpen ? 'shell is-inspector' : 'shell'}>
      <a className="skip" href="#escenario">
        Saltar al contenido
      </a>
      <header className="top">
        <button type="button" className="brand" onClick={() => navigate('inicio')}>
          <span className="brand__mark">JC</span>
          <span className="brand__name">Carrizo</span>
        </button>

        <nav className="nav" aria-label="Secciones">
          <div className="nav__links" style={{ '--i': sectionIndex }}>
            <span className="nav__indicator" aria-hidden="true" />
            {SECTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                className="nav__link"
                aria-current={item.id === section ? 'page' : undefined}
                aria-keyshortcuts={item.key}
                onClick={() => navigate(item.id)}
              >
                <span className="nav__index">{item.index}</span>
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="top__status">
          <p className="live">
            <i aria-hidden="true" />
            <span>En línea</span>
          </p>
          <p className="top__place">{place.city}</p>
          <Clock />
          <button
            type="button"
            className="top__ficha"
            aria-expanded={inspectorOpen}
            onClick={() => setInspectorOpen((open) => !open)}
          >
            Ficha
          </button>
        </div>
      </header>

      <div className={fichaNarrow ? 'body is-ficha-folded' : 'body'}>
        <main className="body__main" id="escenario">
          {section === 'inicio' ? (
            <HomeView
              profile={profile}
              projects={projects}
              skillsData={skillsData}
              active={selected.inicio}
              onSelect={select}
              onNavigate={navigate}
              onOpenProject={openProject}
              motion={motion}
              headingRef={headingRef}
            />
          ) : null}
          {section === 'perfil' ? (
            <ProfileView
              profile={profile}
              active={selected.perfil}
              onSelect={select}
              onNavigate={navigate}
              motion={motion}
              headingRef={headingRef}
            />
          ) : null}
          {section === 'stack' ? (
            <StackView
              skillsData={skillsData}
              projects={projects}
              active={selected.stack}
              onSelect={select}
              onOpenProject={openProject}
              motion={motion}
              headingRef={headingRef}
            />
          ) : null}
          {section === 'obra' ? (
            <WorkView
              projectsData={projectsData}
              projects={projects}
              active={selected.obra}
              onSelect={select}
              motion={motion}
              headingRef={headingRef}
            />
          ) : null}
          {section === 'contacto' ? (
            <ContactView
              profile={profile}
              active={selected.contacto}
              onSelect={select}
              motion={motion}
              headingRef={headingRef}
            />
          ) : null}
        </main>

        <Inspector
          compact={compact}
          open={inspectorOpen}
          folded={fichaFolded}
          peeking={fichaPeek}
          onPeek={setFichaPeek}
          onFold={(next) => {
            setFichaPeek(false)
            setFichaFolded(next)
          }}
          onClose={() => setInspectorOpen(false)}
          profile={profile}
          projects={projects}
          skillsData={skillsData}
          section={section}
          selected={selected}
          onNavigate={navigate}
          onOpenProject={openProject}
          year={year}
        />
      </div>

      {compact && inspectorOpen ? (
        <button type="button" className="backdrop" aria-label="Cerrar ficha" onClick={() => setInspectorOpen(false)} />
      ) : null}
      <KeysHint open={keysOpen} onToggle={() => setKeysOpen((value) => !value)} />
    </div>
    </PanelsContext.Provider>
  )
}

function KeysHint({ open, onToggle }) {
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    function onPointer(event) {
      if (!rootRef.current?.contains(event.target)) onToggle()
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [open, onToggle])

  return (
    <div className={open ? 'keys-hint is-open' : 'keys-hint'} ref={rootRef}>
      {open ? (
        <div className="keys-hint__panel" id="keys-hint-panel" role="dialog" aria-label="Manejo con teclado">
          <p className="keys-hint__title">Teclado</p>
          <ul>
            <li>
              <kbd>1–5</kbd>
              <span>Secciones del menú</span>
            </li>
            <li>
              <kbd>←</kbd>
              <span>Abre y cierra la barra izquierda</span>
            </li>
            <li>
              <kbd>→</kbd>
              <span>Abre y cierra la ficha</span>
            </li>
            <li>
              <kbd>↑</kbd>
              <kbd>↓</kbd>
              <span>Recorre las opciones de la barra</span>
            </li>
          </ul>
        </div>
      ) : null}
      <button
        type="button"
        className="keys-hint__btn"
        aria-expanded={open}
        aria-controls="keys-hint-panel"
        aria-label={open ? 'Cerrar la ayuda de teclado' : 'Ver el manejo con teclado'}
        onClick={onToggle}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="6" width="18" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <rect x="6" y="9" width="2" height="2" fill="currentColor" />
          <rect x="10" y="9" width="2" height="2" fill="currentColor" />
          <rect x="14" y="9" width="2" height="2" fill="currentColor" />
          <rect x="7" y="13" width="10" height="2" fill="currentColor" />
        </svg>
      </button>
    </div>
  )
}

function Inspector({
  compact,
  open,
  folded,
  peeking,
  onPeek,
  onFold,
  onClose,
  profile,
  projects,
  skillsData,
  section,
  selected,
  onNavigate,
  onOpenProject,
  year,
}) {
  const hidden = compact && !open
  const narrow = !compact && folded && !peeking
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  function onEnter() {
    if (compact || !folded) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => onPeek(true), 80)
  }

  function onLeave() {
    window.clearTimeout(timer.current)
    onPeek(false)
  }

  function onToggle() {
    onPeek(false)
    onFold(!(folded && !peeking))
  }

  return (
    <aside
      className={narrow ? 'inspector is-folded' : 'inspector'}
      aria-label="Ficha"
      aria-hidden={hidden}
      inert={hidden ? true : undefined}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <button
        type="button"
        className="inspector__tab"
        aria-expanded={!narrow}
        aria-label={narrow ? 'Desplegar la ficha' : 'Plegar la ficha'}
        onClick={onToggle}
      >
        Ficha
      </button>
      <div className="inspector__sheet" inert={narrow ? true : undefined}>
        <div className="inspector__bar">
          <p className="kicker">Ficha</p>
          <button type="button" className="inspector__fold" onClick={() => onFold(true)}>
            Plegar
          </button>
          <button type="button" className="inspector__close" onClick={onClose}>
            Cerrar
          </button>
        </div>
        <div key={`${section}:${selected[section]}`} className="inspector__body">
          <InspectorBody
            profile={profile}
            projects={projects}
            skillsData={skillsData}
            section={section}
            selected={selected}
            onNavigate={onNavigate}
            onOpenProject={onOpenProject}
          />
        </div>
        <p className="inspector__foot">
          © {year} {profile.name}
          <span>← → barras · ↑ ↓ opciones</span>
        </p>
      </div>
    </aside>
  )
}

function InspectorBody({ profile, projects, skillsData, section, selected, onNavigate, onOpenProject }) {
  const cvHref = contentUrl(profile.cvFile)

  if (section === 'inicio') {
    return (
      <HomeFicha
        profile={profile}
        projects={projects}
        skillsData={skillsData}
        active={selected.inicio}
        cvHref={cvHref}
        onNavigate={onNavigate}
      />
    )
  }

  if (section === 'perfil') {
    return <ProfileFicha profile={profile} active={selected.perfil} cvHref={cvHref} onNavigate={onNavigate} />
  }

  if (section === 'stack') {
    return (
      <StackFicha
        skillsData={skillsData}
        projects={projects}
        active={selected.stack}
        onOpenProject={onOpenProject}
      />
    )
  }

  if (section === 'obra') {
    const project = projects.find((item) => item.id === selected.obra) || projects[0]
    if (!project) return null
    return (
      <>
        <h2>{project.title}</h2>
        <p className="inspector__lead">{project.summary}</p>
        <dl className="facts">
          <div>
            <dt>Stack</dt>
            <dd>{(project.stack || []).join(' · ') || '—'}</dd>
          </div>
          <div>
            <dt>Imágenes</dt>
            <dd>{pad2((project.images || []).length || (project.image ? 1 : 0))}</dd>
          </div>
          <div>
            <dt>Superficie</dt>
            <dd>{surfaceLabel(project)}</dd>
          </div>
        </dl>
        {project.demoUrl ? (
          <div className="inspector__actions">
            <a className="btn" href={project.demoUrl} target="_blank" rel="noreferrer">
              Ver demo
            </a>
          </div>
        ) : null}
      </>
    )
  }

  const channels = buildChannels(profile)
  const channel = channels.find((item) => item.id === selected.contacto) || channels[0]
  if (!channel) return null

  return (
    <>
      <h2>{channel.label}</h2>
      <p className="inspector__lead">{channel.value}</p>
      <dl className="facts">
        <div>
          <dt>Canal</dt>
          <dd>{channel.hint}</dd>
        </div>
        {profile.location ? (
          <div>
            <dt>Base</dt>
            <dd>{profile.location}</dd>
          </div>
        ) : null}
      </dl>
      <div className="inspector__actions">
        <a
          className="btn"
          href={channel.href}
          target={channel.href.startsWith('mailto:') ? undefined : '_blank'}
          rel={channel.href.startsWith('mailto:') ? undefined : 'noreferrer'}
        >
          Abrir
        </a>
        {channel.copy ? <CopyButton value={channel.copy} /> : null}
      </div>
    </>
  )
}

function HomeFicha({ profile, projects, skillsData, active, cvHref, onNavigate }) {
  if (active === 'enfoque') {
    const bio = paragraphs(profile.bio)
    return (
      <>
        <h2>{profile.aboutTitle}</h2>
        <p className="inspector__lead">{sentence(bio[0] || '', 140)}</p>
        <div className="inspector__actions">
          <button type="button" className="btn" onClick={() => onNavigate('perfil', 'bio')}>
            Abrir dossier
          </button>
        </div>
      </>
    )
  }

  if (active === 'alcance') {
    return (
      <>
        <h2>Alcance</h2>
        <p className="inspector__lead">Web, escritorio y móvil, contados desde la obra publicada.</p>
        <dl className="facts">
          {SURFACES.map((surface) => (
            <div key={surface.id}>
              <dt>{surface.label}</dt>
              <dd>{pad2(projectsForSurface(surface.id, projects).length)}</dd>
            </div>
          ))}
        </dl>
      </>
    )
  }

  if (active === 'objetivo') {
    const goals = paragraphs(profile.objectives)
    return (
      <>
        <h2>{profile.objectivesTitle || 'Objetivo'}</h2>
        <p className="inspector__lead">{sentence(goals[0] || '', 140)}</p>
        <div className="inspector__actions">
          <button type="button" className="btn" onClick={() => onNavigate('perfil', 'objetivo')}>
            Leer completo
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <h2>{profile.shortName || profile.name}</h2>
      <p className="inspector__lead">{profile.role}</p>
      <dl className="facts">
        <div>
          <dt>Base</dt>
          <dd>{profile.location}</dd>
        </div>
        <div>
          <dt>Obra</dt>
          <dd>{pad2(projects.length)}</dd>
        </div>
        <div>
          <dt>Stack</dt>
          <dd>{pad2(skillCount(skillsData))}</dd>
        </div>
      </dl>
      <div className="inspector__actions">
        {cvHref ? (
          <a className="btn" href={cvHref} download>
            Descargar CV
          </a>
        ) : null}
        <button type="button" className="btn btn--ghost" onClick={() => onNavigate('contacto')}>
          Contacto
        </button>
      </div>
    </>
  )
}

function ProfileFicha({ profile, active, cvHref, onNavigate }) {
  if (active === 'objetivo') {
    return (
      <>
        <h2>{profile.objectivesTitle || 'Objetivo'}</h2>
        <p className="inspector__lead">{sentence(paragraphs(profile.objectives)[0] || '', 160)}</p>
      </>
    )
  }

  if (active === 'datos') {
    return (
      <>
        <h2>Datos</h2>
        <p className="inspector__lead">{profile.email}</p>
        <dl className="facts">
          <div>
            <dt>Teléfono</dt>
            <dd>{profile.phone}</dd>
          </div>
          <div>
            <dt>Base</dt>
            <dd>{profile.location}</dd>
          </div>
        </dl>
        <div className="inspector__actions">
          {cvHref ? (
            <a className="btn" href={cvHref} download>
              Descargar CV
            </a>
          ) : null}
          <button type="button" className="btn btn--ghost" onClick={() => onNavigate('contacto')}>
            Canales
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <h2>{profile.aboutTitle}</h2>
      <p className="inspector__lead">{sentence(paragraphs(profile.bio)[0] || '', 160)}</p>
      <dl className="facts">
        <div>
          <dt>Bloques</dt>
          <dd>{pad2(paragraphs(profile.bio).length)}</dd>
        </div>
      </dl>
    </>
  )
}

function StackFicha({ skillsData, projects, active, onOpenProject }) {
  const categories = skillsData?.categories || []
  const [categoryId, skillName] = String(active || '').split('::')
  const category = categories.find((item) => item.id === categoryId) || categories[0]
  if (!category) return null

  if (!skillName) {
    return (
      <>
        <h2>{category.name}</h2>
        <p className="inspector__lead">
          {(category.items || []).length} tecnologías en esta categoría.
        </p>
        <dl className="facts">
          {(category.items || []).slice(0, 6).map((skill) => (
            <div key={skill}>
              <dt>{pad2(projectsWithSkill(skill, projects).length)}</dt>
              <dd>{skill}</dd>
            </div>
          ))}
        </dl>
      </>
    )
  }

  const list = projectsWithSkill(skillName, projects)
  return (
    <>
      <h2>{skillName}</h2>
      <p className="inspector__lead">{category.name}</p>
      {list.length ? (
        <div className="linklist">
          {list.map((project) => (
            <button key={project.id} type="button" onClick={() => onOpenProject(project.id)}>
              {project.title}
            </button>
          ))}
        </div>
      ) : (
        <p className="inspector__lead">Forma parte del stack general.</p>
      )}
    </>
  )
}

function surfaceLabel(project) {
  const labels = projectSurfaces(project)
    .map((id) => SURFACES.find((surface) => surface.id === id)?.label)
    .filter(Boolean)
  return labels.join(' · ') || 'Software'
}
