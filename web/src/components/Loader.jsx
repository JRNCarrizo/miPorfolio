import './Loader.css'

export default function Loader({ message = 'Cargando', error = '' }) {
  if (error) {
    return (
      <div className="loader loader--error" role="alert">
        <div className="loader__panel">
          <p className="loader__label">Error</p>
          <p className="loader__text">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader__panel">
        <div className="loader__mark" aria-hidden="true" />
        <p className="loader__brand">Carrizo Jorge</p>
        <p className="loader__code">
          <span className="loader__prompt">›</span> {message}
          <span className="loader__dots" aria-hidden="true">
            <i /><i /><i />
          </span>
        </p>
        <div className="loader__bar" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  )
}
