import { useReveal } from '../hooks/useReveal'
import './Contact.css'

export default function Contact({ profile }) {
  const { ref, visible } = useReveal()
  const whatsappUrl = `https://wa.me/${profile.whatsapp}`

  const links = [
    {
      label: 'WhatsApp',
      value: profile.phone,
      href: whatsappUrl,
    },
    {
      label: 'Email',
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    {
      label: 'Instagram',
      value: '@tuideadigital.app',
      href: profile.instagram,
    },
    {
      label: 'LinkedIn',
      value: 'Jorge Carrizo',
      href: profile.linkedin,
    },
  ]

  return (
    <section className="section contact" id="contacto" ref={ref}>
      <div className={`container reveal ${visible ? 'visible' : ''}`}>
        <p className="section-label">Contacto</p>
        <h2 className="section-title">Hablemos de tu próximo proyecto</h2>
        <p className="section-lead">
          Escribime por WhatsApp, mail o redes. Estoy en Buenos Aires, Argentina.
        </p>

        <div className="contact__grid">
          {links.map((item) => (
            <a
              key={item.label}
              className="contact__item"
              href={item.href}
              target={item.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}
            >
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
