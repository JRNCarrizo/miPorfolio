import { useState } from 'react'
import { contentUrl, pad2, paragraphs, sentence } from '../lib/content'
import { Drawer, ModuleFrame, ModuleHead, SideList } from './ui'

export default function ProfileView({ profile, active, onSelect, onNavigate, motion, headingRef }) {
  const bio = paragraphs(profile.bio)
  const goals = paragraphs(profile.objectives)
  const cvHref = contentUrl(profile.cvFile)

  const items = [
    { id: 'bio', index: '01', label: 'Biografía', meta: `${pad2(bio.length)} bloques` },
    { id: 'objetivo', index: '02', label: profile.objectivesTitle || 'Objetivo', meta: 'Dirección' },
    { id: 'datos', index: '03', label: 'Datos', meta: profile.location || 'Contacto' },
  ]

  return (
    <ModuleFrame
      motion={motion}
      index="02"
      sidebar={<SideList label="Dossier" items={items} activeId={active} onSelect={onSelect} />}
    >
      <ModuleHead
        index="02"
        kicker="Perfil"
        title={active === 'objetivo' ? profile.objectivesTitle || 'Objetivo' : profile.aboutTitle || 'Perfil'}
        deck={active === 'datos' ? profile.location : profile.tagline}
        headingRef={headingRef}
      />
      <div key={active} className="pane">
        {active === 'bio' ? <Chapter blocks={bio} /> : null}
        {active === 'objetivo' ? <Chapter blocks={goals} /> : null}
        {active === 'datos' ? (
          <DataSheet profile={profile} cvHref={cvHref} onNavigate={onNavigate} />
        ) : null}
      </div>
    </ModuleFrame>
  )
}

function Chapter({ blocks }) {
  const [openId, setOpenId] = useState(blocks[0] ? '0' : '')

  return (
    <div className="chapter">
      {blocks.map((paragraph, index) => {
        const id = String(index)
        return (
          <Drawer
            key={id}
            kicker={pad2(index + 1)}
            title={sentence(paragraph)}
            open={openId === id}
            onToggle={() => setOpenId((current) => (current === id ? '' : id))}
          >
            <p className="prose">{paragraph}</p>
          </Drawer>
        )
      })}
    </div>
  )
}

function DataSheet({ profile, cvHref, onNavigate }) {
  const rows = [
    ['Ubicación', profile.location],
    ['Email', profile.email],
    ['Teléfono', profile.phone],
    ['GitHub', profile.github],
  ].filter(([, value]) => value)

  return (
    <div className="datasheet">
      <dl className="facts facts--stage">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="actions">
        {cvHref ? (
          <a className="btn" href={cvHref} download>
            Descargar CV
          </a>
        ) : null}
        <button type="button" className="btn btn--ghost" onClick={() => onNavigate('contacto')}>
          Ir a contacto
        </button>
      </div>
    </div>
  )
}
