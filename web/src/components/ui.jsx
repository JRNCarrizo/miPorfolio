import { useContext, useEffect, useId, useRef, useState } from 'react'
import { PanelsContext, usePanelQuery } from '../lib/panels'

function useHoverPeek(active, setPeek) {
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  function onEnter() {
    if (!active) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setPeek(true), 80)
  }

  function onLeave() {
    window.clearTimeout(timer.current)
    setPeek(false)
  }

  return { onEnter, onLeave }
}

export function ModuleFrame({ motion = 'forward', sidebar, index, children }) {
  const panels = useContext(PanelsContext)
  const stacked = usePanelQuery(800)
  const railFolded = panels?.railFolded
  const railPeek = panels?.railPeek
  const narrow = Boolean(railFolded && !railPeek && !stacked)
  const peek = useHoverPeek(Boolean(railFolded && !stacked), panels?.setRailPeek ?? (() => {}))
  const moduleClass = [
    'module',
    motion === 'back' ? 'is-back' : '',
    narrow ? 'is-rail-folded' : '',
  ]
    .filter(Boolean)
    .join(' ')

  function onToggle() {
    panels?.setRailPeek(false)
    if (railFolded && !railPeek) panels?.setRailFolded(false)
    else panels?.setRailFolded(true)
  }

  return (
    <div className={moduleClass}>
      <aside className="sidebar" onMouseEnter={peek.onEnter} onMouseLeave={peek.onLeave}>
        <button
          type="button"
          className="fold"
          aria-expanded={!narrow}
          aria-label={narrow ? 'Desplegar la barra lateral' : 'Plegar la barra lateral'}
          onClick={onToggle}
        >
          <span className="fold__label">{narrow ? 'Abrir' : 'Plegar'}</span>
          <span className="fold__chev" aria-hidden="true" />
        </button>
        <div className="sidebar__body">{sidebar}</div>
      </aside>
      <div className="stage">
        <div className="stage__view">
          <p className="watermark" aria-hidden="true">
            {index}
          </p>
          {children}
        </div>
      </div>
    </div>
  )
}

export function ModuleHead({ index, kicker, role, title, deck, titleClass = '', headingRef }) {
  return (
    <header className="module-head">
      <p className="kicker">
        <span>{index}</span>
        {' · '}
        {kicker}
      </p>
      {role ? <p className="role">{role}</p> : null}
      <h1 ref={headingRef} tabIndex={-1} className={titleClass}>
        {title}
      </h1>
      {deck ? <p className="deck">{deck}</p> : null}
    </header>
  )
}

export function SideList({ label, items, activeId, onSelect }) {
  const labelId = useId()

  function onKeyDown(event) {
    if (!items.length) return
    const current = items.findIndex((item) => item.id === activeId)
    let next = current
    if (event.key === 'ArrowDown') {
      next = (current + 1) % items.length
    } else if (event.key === 'ArrowUp') {
      next = (current - 1 + items.length) % items.length
    } else if (event.key === 'Home') {
      next = 0
    } else if (event.key === 'End') {
      next = items.length - 1
    } else {
      return
    }

    event.preventDefault()
    const item = items[next]
    if (!item) return
    onSelect(item.id)
    const button = event.currentTarget.querySelector(`[data-id="${CSS.escape(item.id)}"]`)
    button?.focus()
  }

  return (
    <nav className="side" aria-label={label}>
      {label ? (
        <p className="side__label" id={labelId}>
          {label}
        </p>
      ) : null}
      <div
        className="side-list"
        role="group"
        aria-labelledby={label ? labelId : undefined}
        onKeyDown={onKeyDown}
      >
        {items.map((item) => {
          const active = item.id === activeId
          return (
            <button
              key={item.id}
              type="button"
              data-id={item.id}
              className={active ? 'side-btn is-active' : 'side-btn'}
              aria-current={active ? 'true' : undefined}
              title={item.label}
              onClick={() => onSelect(item.id)}
            >
              <span className="side-btn__index">{item.index}</span>
              <span className="side-btn__copy">
                <span className="side-btn__label">{item.label}</span>
                {item.meta ? <span className="side-btn__meta">{item.meta}</span> : null}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export function Drawer({ kicker, title, open, onToggle, children }) {
  const panelId = useId()

  return (
    <div className={open ? 'drawer is-open' : 'drawer'}>
      <button
        type="button"
        className="drawer__trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="drawer__kicker">{kicker}</span>
        <span className="drawer__title">{title}</span>
        <span className="drawer__mark" aria-hidden="true" />
      </button>
      <div className="drawer__panel" id={panelId} inert={open ? undefined : true}>
        <div className="drawer__inner">
          <div className="drawer__body">{children}</div>
        </div>
      </div>
    </div>
  )
}

export function Corners() {
  return (
    <>
      <i className="corner corner--tl" aria-hidden="true" />
      <i className="corner corner--tr" aria-hidden="true" />
      <i className="corner corner--bl" aria-hidden="true" />
      <i className="corner corner--br" aria-hidden="true" />
    </>
  )
}

export function CopyButton({ value, label = 'Copiar', className = 'btn btn--ghost' }) {
  const [done, setDone] = useState(false)

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setDone(true)
      window.setTimeout(() => setDone(false), 1600)
    } catch {
      setDone(false)
    }
  }

  return (
    <button type="button" className={className} onClick={onCopy}>
      {done ? 'Copiado' : label}
    </button>
  )
}
