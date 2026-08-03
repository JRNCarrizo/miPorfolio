import { useReveal } from '../hooks/useReveal'
import './Skills.css'

export default function Skills({ skillsData }) {
  const { ref, visible } = useReveal()
  const categories = skillsData?.categories || []

  return (
    <section className="section skills" id="stack" ref={ref}>
      <div className={`container reveal ${visible ? 'visible' : ''}`}>
        <p className="section-label">Stack</p>
        <h2 className="section-title">
          {skillsData?.title || 'Tecnologías con las que trabajo'}
        </h2>
        <p className="section-lead">
          {skillsData?.intro ||
            'Desarrollo soluciones completas, desde el backend hasta la interfaz de usuario.'}
        </p>

        <div className="skills__groups">
          {categories.map((category, groupIndex) => (
            <div
              key={category.id}
              className="skills__group"
              style={{ transitionDelay: `${groupIndex * 60}ms` }}
            >
              <h3 className="skills__group-title">{category.name}</h3>
              <ul className="skills__list">
                {(category.items || []).map((item) => (
                  <li key={item} className="skills__item">
                    <span className="skills__dot" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
