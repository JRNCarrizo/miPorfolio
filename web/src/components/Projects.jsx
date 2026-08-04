import { useReveal } from '../hooks/useReveal'
import Typewriter from './Typewriter'
import './Projects.css'

function contentUrl(path) {
  if (!path) return ''
  return `/content/${path.replace(/^\//, '')}`
}

export default function Projects({ projectsData }) {
  const { ref, visible } = useReveal(0.08)
  const projects = projectsData?.projects || []
  const label = projectsData?.label || 'Proyectos'
  const title =
    projectsData?.title || 'Soluciones desarrolladas para resolver problemas reales'

  return (
    <section className="section projects" id="proyectos" ref={ref}>
      <div className={`container reveal ${visible ? 'visible' : ''}`}>
        <Typewriter text={label} as="p" className="section-label" speed={42} />
        <Typewriter text={title} as="h2" className="section-title" speed={20} startDelay={650} />
        <p className="section-lead section-lead--wide">
          {projectsData?.intro ||
            'Cada proyecto nace de una necesidad concreta: optimizar procesos, automatizar tareas y facilitar el trabajo de las personas.'}
        </p>

        <div className="projects__grid">
          {projects.map((project, i) => {
            const img = contentUrl(project.image)
            const Wrapper = project.demoUrl ? 'a' : 'article'
            const wrapperProps = project.demoUrl
              ? {
                  href: project.demoUrl,
                  target: '_blank',
                  rel: 'noreferrer',
                  className: 'project',
                }
              : { className: 'project project--static' }

            return (
              <Wrapper
                key={project.id}
                {...wrapperProps}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="project__media">
                  {img ? (
                    <img src={img} alt="" loading="lazy" />
                  ) : (
                    <div className="project__placeholder">
                      <span>{project.title.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="project__body">
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <ul className="project__stack">
                    {(project.stack || []).map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                  {project.demoUrl ? (
                    <span className="project__cta">Ver demo →</span>
                  ) : null}
                </div>
              </Wrapper>
            )
          })}
        </div>
      </div>
    </section>
  )
}
