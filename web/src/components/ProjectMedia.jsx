import { useEffect, useMemo, useState } from 'react'

function contentUrl(path) {
  if (!path) return ''
  return `/content/${path.replace(/^\//, '')}`
}

export default function ProjectMedia({ project }) {
  const imageKey =
    Array.isArray(project.images) && project.images.length
      ? project.images.filter(Boolean).join('|')
      : project.image || ''

  const images = useMemo(
    () => (imageKey ? imageKey.split('|') : []),
    [imageKey],
  )
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [project.id, imageKey])

  useEffect(() => {
    if (images.length < 2) return undefined

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length)
    }, 3200)

    return () => window.clearInterval(id)
  }, [imageKey, images.length])

  if (!images.length) {
    return (
      <div className="project__placeholder">
        <span>{project.title.charAt(0)}</span>
      </div>
    )
  }

  return (
    <div className="project__slideshow" data-count={images.length}>
      {images.map((src, i) => (
        <img
          key={src}
          src={contentUrl(src)}
          alt=""
          loading={i === 0 ? 'eager' : 'lazy'}
          className={i === index ? 'is-active' : ''}
          draggable={false}
        />
      ))}
      {images.length > 1 ? (
        <div className="project__dots" aria-hidden="true">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              className={i === index ? 'is-active' : ''}
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                setIndex(i)
              }}
              aria-label={`Imagen ${i + 1}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
