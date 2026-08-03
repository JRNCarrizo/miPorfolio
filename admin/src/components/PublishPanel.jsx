import { useState } from 'react'

export default function PublishPanel({ setStatus }) {
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [localStatus, setLocalStatus] = useState('')
  const [error, setError] = useState('')

  async function publish() {
    setBusy(true)
    setError('')
    setLocalStatus('')
    try {
      const result = await window.adminApi.publish(message)
      const text = result.message || 'Listo'
      setLocalStatus(text)
      setStatus(text)
      if (!result.empty) setMessage('')
    } catch (err) {
      const text = err?.message || 'Error al publicar'
      setError(text)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card">
      <h2>Publicar en Netlify</h2>
      <p className="muted">
        Guarda primero los cambios en las otras pestañas. Este botón hace{' '}
        <strong>git add content/</strong>, commit y <strong>push</strong> al remote. Netlify
        redeploya solo.
      </p>
      <p className="muted">
        Si borraste proyectos y no aparecen eliminados en la web publicada, es porque falta
        Publicar (push). En local, recargá la web después de guardar.
      </p>
      <p className="muted">
        Necesitás tener el repo conectado a GitHub y credenciales configuradas (SSH o Git Credential
        Manager).
      </p>

      <label>
        Mensaje de commit
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="content: update projects and profile"
        />
      </label>

      <div className="row" style={{ marginTop: '1rem' }}>
        <button className="btn btn-primary" disabled={busy} onClick={publish}>
          {busy ? 'Publicando...' : 'Publicar ahora'}
        </button>
      </div>

      {localStatus ? <p className="status status--ok">{localStatus}</p> : null}
      {error ? <p className="status status--error">{error}</p> : null}
    </div>
  )
}
