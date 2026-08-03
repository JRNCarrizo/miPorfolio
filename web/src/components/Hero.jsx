import { useEffect, useState } from 'react'
import './Hero.css'

function contentUrl(path) {
  if (!path) return ''
  return `/content/${path.replace(/^\//, '')}`
}

const CODE_SNIPPET = `// Jorge Carrizo · Full Stack
const stack = [
  "Java", "Spring", "React",
  "Electron", "Capacitor", "Python"
];

async function ship(idea) {
  const product = await build(idea, {
    desktop: true,
    mobile: true,
    ai: "cursor + gemini"
  });

  return product.deploy();
}

ship("resolver un problema real");`

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return reduced
}

export default function Hero({ profile }) {
  const imageSrc = contentUrl(profile.profileImage)
  const cvHref = contentUrl(profile.cvFile)
  const reducedMotion = usePrefersReducedMotion()

  const [mode, setMode] = useState('photo') // photo | code
  const [typed, setTyped] = useState('')
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (reducedMotion || paused) return undefined

    let cancelled = false
    let timeouts = []

    const wait = (ms) =>
      new Promise((resolve) => {
        const id = setTimeout(resolve, ms)
        timeouts.push(id)
      })

    async function runLoop() {
      while (!cancelled) {
        setMode('photo')
        setTyped('')
        await wait(4200)
        if (cancelled) break

        setMode('code')
        setTyped('')

        for (let i = 1; i <= CODE_SNIPPET.length; i += 1) {
          if (cancelled) break
          setTyped(CODE_SNIPPET.slice(0, i))
          await wait(CODE_SNIPPET[i - 1] === '\n' ? 45 : 16)
        }

        await wait(2800)
        if (cancelled) break
      }
    }

    runLoop()

    return () => {
      cancelled = true
      timeouts.forEach(clearTimeout)
    }
  }, [reducedMotion, paused])

  function toggleMode() {
    if (reducedMotion) return
    setPaused(true)
    setMode((current) => {
      const next = current === 'photo' ? 'code' : 'photo'
      if (next === 'code') setTyped(CODE_SNIPPET)
      else setTyped('')
      return next
    })
    // Reanuda el ciclo automático después de unos segundos
    window.setTimeout(() => setPaused(false), 6000)
  }

  return (
    <section className="hero" id="top">
      <div
        className={`hero__photo-plane ${mode === 'code' ? 'hero__photo-plane--code' : ''}`}
        aria-hidden={!imageSrc}
      >
        {imageSrc ? (
          <img
            src={`${imageSrc}?v=normal`}
            alt=""
            className="hero__photo"
          />
        ) : (
          <div className="hero__photo hero__photo--placeholder" />
        )}

        <div className="hero__code" aria-hidden="true">
          <div className="hero__code-bar">
            <span />
            <span />
            <span />
            <em>build.tsx</em>
          </div>
          <pre className="hero__code-body">
            <code>
              {typed}
              {mode === 'code' ? <span className="hero__caret" /> : null}
            </code>
          </pre>
        </div>

        {!reducedMotion ? (
          <button
            type="button"
            className="hero__swap"
            onClick={toggleMode}
            aria-label={mode === 'photo' ? 'Ver código' : 'Ver foto'}
          >
            {mode === 'photo' ? '</>' : 'Foto'}
          </button>
        ) : null}
      </div>

      <div className="hero__veil" aria-hidden="true" />

      <div className="hero__content container">
        <div className="hero__copy">
          <p className="hero__role">{profile.role}</p>
          <h1 className="hero__name">{profile.name}</h1>
          <p className="hero__tagline">{profile.tagline}</p>
          <div className="hero__actions">
            <a className="btn btn-primary" href="#contacto">
              Contactame
            </a>
            <a className="btn btn-ghost" href={cvHref} download>
              Descargar CV
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
