import { useEffect, useMemo, useState } from 'react'
import { contentUrl, pad2 } from '../lib/content'
import { Drawer, ModuleFrame, ModuleHead, SideList } from './ui'

const FILTERS = [
  { id: 'todo', label: 'Todo' },
  { id: 'destacados', label: 'Destacados' },
  { id: 'demo', label: 'Con demo' },
]

function filterProjects(filter, projects) {
  if (filter === 'destacados') return projects.filter((project) => project.featured)
  if (filter === 'demo') return projects.filter((project) => project.demoUrl)
  return projects
}

export default function WorkView({
  projectsData,
  projects,
  active,
  onSelect,
  motion,
  headingRef,
}) {
  const [filter, setFilter] = useState('todo')
  const [showIntro, setShowIntro] = useState(false)
  const visible = filterProjects(filter, projects)
  const project = projects.find((item) => item.id === active) || visible[0] || projects[0]

  function applyFilter(next) {
    setFilter(next)
    const list = filterProjects(next, projects)
    if (list[0] && !list.some((item) => item.id === active)) onSelect(list[0].id)
  }

  const items = visible.map((item, index) => ({
    id: item.id,
    index: pad2(index + 1),
    label: item.title,
    meta: item.featured ? 'Destacado' : item.demoUrl ? 'Demo' : 'Pieza',
  }))

  return (
    <ModuleFrame
      motion={motion}
      index="04"
      sidebar={
        <div className="side-block">
          <div className="seg" role="group" aria-label="Filtrar obra">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={filter === item.id}
                onClick={() => applyFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <SideList label={`Índice · ${pad2(visible.length)}`} items={items} activeId={project?.id} onSelect={onSelect} />
        </div>
      }
    >
      <ModuleHead
        index="04"
        kicker={projectsData?.label || 'Obra'}
        title="Obra"
        deck={projectsData?.title}
        headingRef={headingRef}
      />
      {projectsData?.intro ? (
        <Drawer
          kicker="Nota"
          title="Criterio de la obra"
          open={showIntro}
          onToggle={() => setShowIntro((value) => !value)}
        >
          <p className="prose">{projectsData.intro}</p>
        </Drawer>
      ) : null}
      {project ? (
        <div key={project.id} className="pane">
          <ProjectStage project={project} />
        </div>
      ) : null}
    </ModuleFrame>
  )
}

function ProjectStage({ project }) {
  const images = useMemo(() => {
    if (Array.isArray(project.images) && project.images.length) {
      return project.images.filter(Boolean)
    }
    return project.image ? [project.image] : []
  }, [project])
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setIndex(0)
    setOpen(false)
  }, [project.id])

  const safeIndex = images.length ? index % images.length : 0

  function step(delta) {
    if (images.length < 2) return
    setIndex((current) => (current + delta + images.length) % images.length)
  }

  return (
    <article className="work">
      <div className="work__heading">
        <h2 className="work-title">{project.title}</h2>
        <div className="work__tags">
          {project.featured ? <span className="tag">Destacado</span> : null}
          {project.demoUrl ? <span className="tag tag--ghost">Demo</span> : null}
        </div>
      </div>

      <div
        className="frame"
        tabIndex={images.length > 1 ? 0 : undefined}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault()
            step(1)
          }
          if (event.key === 'ArrowLeft') {
            event.preventDefault()
            step(-1)
          }
        }}
      >
        {images.length ? (
          images.map((src, imageIndex) => (
            <img
              key={src}
              src={contentUrl(src)}
              alt=""
              className={imageIndex === safeIndex ? 'is-active' : ''}
              draggable={false}
            />
          ))
        ) : (
          <div className="frame__empty">{project.title.charAt(0)}</div>
        )}
        {images.length > 1 ? (
          <div className="frame__bar">
            <button type="button" onClick={() => step(-1)}>
              Ant
            </button>
            <div className="dots">
              {images.map((src, imageIndex) => (
                <button
                  key={src}
                  type="button"
                  className={imageIndex === safeIndex ? 'is-active' : ''}
                  aria-label={`Imagen ${imageIndex + 1}`}
                  onClick={() => setIndex(imageIndex)}
                />
              ))}
            </div>
            <button type="button" onClick={() => step(1)}>
              Sig
            </button>
          </div>
        ) : null}
      </div>

      <p className="prose work__summary">{project.summary}</p>
      {(project.stack || []).length ? (
        <ul className="chips">
          {project.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      ) : null}

      {project.description ? (
        <Drawer kicker="01" title="Desarrollo" open={open} onToggle={() => setOpen((value) => !value)}>
          <p className="prose">{project.description}</p>
        </Drawer>
      ) : null}

      {project.demoUrl ? (
        <div className="actions">
          <a className="btn" href={project.demoUrl} target="_blank" rel="noreferrer">
            Ver demo
          </a>
        </div>
      ) : null}
    </article>
  )
}
