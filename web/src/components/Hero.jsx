import { useEffect, useState } from 'react'
import './Hero.css'

function contentUrl(path) {
  if (!path) return ''
  return `/content/${path.replace(/^\//, '')}`
}

const FLOAT_LINES = [
  'const app = createApp({ desktop: true })',
  'await syncStock()',
  'gemini.complete(product)',
  'deploy("netlify") → ok',
  'removeBackground(photo)',
  'ship("idea → producto")',
]

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

  const [mode, setMode] = useState('photo') // photo | boot | code
  const [typed, setTyped] = useState('')
  const [floatText, setFloatText] = useState('')
  const [floatIndex, setFloatIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  // Código flotante sobre la foto (etapa foto)
  useEffect(() => {
    if (reducedMotion || paused || mode !== 'photo') return undefined

    let cancelled = false
    let timeouts = []
    const wait = (ms) =>
      new Promise((resolve) => {
        const id = setTimeout(resolve, ms)
        timeouts.push(id)
      })

    async function typeFloat() {
      while (!cancelled) {
        const line = FLOAT_LINES[floatIndex % FLOAT_LINES.length]
        setFloatText('')
        for (let i = 1; i <= line.length; i += 1) {
          if (cancelled) return
          setFloatText(line.slice(0, i))
          await wait(28)
        }
        await wait(1400)
        if (cancelled) return
        setFloatIndex((n) => n + 1)
      }
    }

    typeFloat()
    return () => {
      cancelled = true
      timeouts.forEach(clearTimeout)
    }
  }, [reducedMotion, paused, mode, floatIndex])

  // Ciclo foto → boot → ventana de código
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
        await wait(5200)
        if (cancelled) break

        setMode('boot')
        await wait(700)
        if (cancelled) break

        setMode('code')
        setTyped('')

        for (let i = 1; i <= CODE_SNIPPET.length; i += 1) {
          if (cancelled) break
          setTyped(CODE_SNIPPET.slice(0, i))
          await wait(CODE_SNIPPET[i - 1] === '\n' ? 45 : 16)
        }

        await wait(3000)
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
      if (current === 'code') {
        setTyped('')
        return 'photo'
      }
      setTyped(CODE_SNIPPET)
      return 'code'
    })
    window.setTimeout(() => setPaused(false), 6000)
  }

  const planeClass = [
    'hero__photo-plane',
    mode === 'boot' ? 'hero__photo-plane--boot' : '',
    mode === 'code' ? 'hero__photo-plane--code' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section className="hero" id="top">
      <div className={planeClass} aria-hidden={!imageSrc}>
        {imageSrc ? (
          <img src={`${imageSrc}?v=normal`} alt="" className="hero__photo" />
        ) : (
          <div className="hero__photo hero__photo--placeholder" />
        )}

        <div className="hero__float" aria-hidden="true">
          <div className="hero__float-chip">
            <span className="hero__float-prompt">›</span>
            <span>{floatText}</span>
            {mode === 'photo' ? <span className="hero__caret hero__caret--inline" /> : null}
          </div>
          <div className="hero__float-tags">
            <span>Java</span>
            <span>React</span>
            <span>Electron</span>
            <span>Capacitor</span>
          </div>
        </div>

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
            {mode === 'code' ? 'Foto' : '</>'}
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
