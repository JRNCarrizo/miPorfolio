import { useReveal } from '../hooks/useReveal'
import Typewriter from './Typewriter'
import ProjectMedia from './ProjectMedia'
import './Projects.css'

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
          {projects.map((project, i) => (
            <article
              key={project.id}
              className="project"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="project__media">
                <ProjectMedia project={project} />
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
                  <a
                    className="project__cta"
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ver demo →
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
