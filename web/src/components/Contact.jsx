import { useReveal } from '../hooks/useReveal'
import Typewriter from './Typewriter'
import './Contact.css'

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.3-1.65a11.9 11.9 0 0 0 5.76 1.47h.01c6.55 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.45-8.44ZM12.07 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.64-.24-.37a9.86 9.86 0 0 1-1.51-5.27c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 6.98c0 5.45-4.44 9.88-9.9 9.88Zm5.43-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47a8.9 8.9 0 0 1-1.64-2.04c-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z"
      />
    </svg>
  )
}

function IconEmail() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"
      />
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm11 1.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5Z"
      />
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4.98 3.5A2.5 2.5 0 1 1 2.5 6a2.5 2.5 0 0 1 2.48-2.5ZM3 8.75h3.96V21H3V8.75ZM9.34 8.75H13.1v1.68h.05c.52-.98 1.8-2.02 3.71-2.02 3.97 0 4.7 2.61 4.7 6.01V21H17.6v-5.9c0-1.41-.03-3.22-1.96-3.22-1.96 0-2.26 1.53-2.26 3.12V21H9.34V8.75Z"
      />
    </svg>
  )
}

export default function Contact({ profile }) {
  const { ref, visible } = useReveal()
  const whatsappUrl = `https://wa.me/${profile.whatsapp}`

  const links = [
    {
      label: 'WhatsApp',
      value: profile.phone,
      href: whatsappUrl,
      icon: <IconWhatsApp />,
    },
    {
      label: 'Email',
      value: profile.email,
      href: `mailto:${profile.email}`,
      icon: <IconEmail />,
    },
    {
      label: 'Instagram',
      value: '@tuideadigital.app',
      href: profile.instagram,
      icon: <IconInstagram />,
    },
    {
      label: 'LinkedIn',
      value: 'Jorge Carrizo',
      href: profile.linkedin,
      icon: <IconLinkedIn />,
    },
  ]

  return (
    <section className="section contact" id="contacto" ref={ref}>
      <div className={`container reveal ${visible ? 'visible' : ''}`}>
        <Typewriter text="Contacto" as="p" className="section-label" speed={42} />
        <Typewriter
          text={profile.contactTitle || 'Conversemos sobre tu próximo proyecto'}
          as="h2"
          className="section-title"
          speed={22}
          startDelay={650}
        />
        <p className="section-lead section-lead--wide">
          {profile.contactIntro ||
            'Desarrollo soluciones a medida para empresas y profesionales.'}
        </p>
        {profile.location ? (
          <p className="contact__location">📍 {profile.location}</p>
        ) : null}

        <div className="contact__grid">
          {links.map((item) => (
            <a
              key={item.label}
              className="contact__item"
              href={item.href}
              target={item.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}
            >
              <div className="contact__item-top">
                <span className="contact__icon">{item.icon}</span>
                <span className="contact__label">{item.label}</span>
              </div>
              <strong>{item.value}</strong>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
