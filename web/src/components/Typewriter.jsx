import { useEffect, useRef, useState } from 'react'

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

export default function Typewriter({
  text,
  as: Tag = 'span',
  className = '',
  speed = 28,
  startDelay = 120,
  showCaret = true,
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [typed, setTyped] = useState('')
  const [done, setDone] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return undefined
    if (reducedMotion) {
      setTyped(text)
      setDone(true)
      return undefined
    }

    let cancelled = false
    const timeouts = []
    const wait = (ms) =>
      new Promise((resolve) => {
        const id = setTimeout(resolve, ms)
        timeouts.push(id)
      })

    async function run() {
      setTyped('')
      setDone(false)
      await wait(startDelay)
      if (cancelled) return

      for (let i = 1; i <= text.length; i += 1) {
        if (cancelled) return
        setTyped(text.slice(0, i))
        await wait(speed)
      }

      if (!cancelled) setDone(true)
    }

    run()

    return () => {
      cancelled = true
      timeouts.forEach(clearTimeout)
    }
  }, [visible, text, speed, startDelay, reducedMotion])

  return (
    <Tag ref={ref} className={`typewriter ${className}`.trim()}>
      {typed || '\u00A0'}
      {showCaret && visible && !done ? (
        <span className="typewriter__caret" aria-hidden="true" />
      ) : null}
    </Tag>
  )
}
