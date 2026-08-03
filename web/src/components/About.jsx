import { useReveal } from '../hooks/useReveal'
import './About.css'

export default function About({ profile }) {
  const { ref, visible } = useReveal()
  const bioParagraphs = (profile.bio || '').split('\n\n').filter(Boolean)
  const objectiveParagraphs = (profile.objectives || '').split('\n\n').filter(Boolean)

  return (
    <section className="section about" id="sobre-mi" ref={ref}>
      <div className={`container reveal ${visible ? 'visible' : ''}`}>
        <p className="section-label">Sobre mí</p>
        <h2 className="section-title">
          {profile.aboutTitle || 'Software que impulsa procesos reales'}
        </h2>
        {bioParagraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 32)} className="about__text">
            {paragraph}
          </p>
        ))}

        <div className="about__objectives-block">
          <h3 className="about__objectives-title">
            {profile.objectivesTitle || 'Mi objetivo'}
          </h3>
          {objectiveParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="about__objectives">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
