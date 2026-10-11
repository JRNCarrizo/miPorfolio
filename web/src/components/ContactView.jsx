import { buildChannels } from '../lib/content'
import { CopyButton, ModuleFrame, ModuleHead, SideList } from './ui'

export default function ContactView({ profile, active, onSelect, motion, headingRef }) {
  const channels = buildChannels(profile)
  const current = channels.find((channel) => channel.id === active) || channels[0]
  const items = channels.map((channel, index) => ({
    id: channel.id,
    index: String(index + 1).padStart(2, '0'),
    label: channel.label,
    meta: channel.hint,
  }))

  return (
    <ModuleFrame
      motion={motion}
      index="05"
      sidebar={<SideList label="Canales" items={items} activeId={current?.id} onSelect={onSelect} />}
    >
      <ModuleHead
        index="05"
        kicker="Contacto"
        title="Contacto"
        deck={profile.contactTitle}
        headingRef={headingRef}
      />
      {profile.contactIntro ? <p className="prose">{profile.contactIntro}</p> : null}
      {current ? (
        <div key={current.id} className="pane channel">
          <p className="kicker">{current.hint}</p>
          <h2 className="channel__name">{current.label}</h2>
          <p className="mono-value">{current.value}</p>
          {profile.location ? <p className="pane-note">{profile.location}</p> : null}
          <div className="actions">
            <a
              className="btn"
              href={current.href}
              target={current.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={current.href.startsWith('mailto:') ? undefined : 'noreferrer'}
            >
              Abrir {current.label}
            </a>
            {current.copy ? <CopyButton value={current.copy} /> : null}
          </div>
        </div>
      ) : null}
    </ModuleFrame>
  )
}
