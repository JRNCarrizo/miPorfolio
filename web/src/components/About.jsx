import { useReveal } from '../hooks/useReveal'
import Typewriter from './Typewriter'
import './About.css'

export default function About({ profile }) {
  const { ref, visible } = useReveal()
  const bioParagraphs = (profile.bio || '').split('\n\n').filter(Boolean)
  const objectiveParagraphs = (profile.objectives || '').split('\n\n').filter(Boolean)
  const aboutTitle = profile.aboutTitle || 'Software que impulsa procesos reales'

  return (
    <section className="section about" id="sobre-mi" ref={ref}>
      <div className={`container reveal ${visible ? 'visible' : ''}`}>
        <Typewriter text="Sobre mí" as="p" className="section-label" speed={42} />
        <Typewriter
          text={aboutTitle}
          as="h2"
          className="section-title"
          speed={24}
          startDelay={700}
        />
        {bioParagraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 32)} className="about__text">
            {paragraph}
          </p>
        ))}

        <div className="about__objectives-block">
          <Typewriter
            text={profile.objectivesTitle || 'Mi objetivo'}
            as="h3"
            className="about__objectives-title"
            speed={36}
            startDelay={200}
          />
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
