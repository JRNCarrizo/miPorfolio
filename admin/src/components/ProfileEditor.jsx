export default function ProfileEditor({ profile, setProfile, onSave, setStatus }) {
  function update(field, value) {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  async function pickImage() {
    const result = await window.adminApi.uploadImage({ suggestedName: 'profile' })
    if (result.ok) {
      update('profileImage', result.relativePath)
      setStatus(`Imagen de perfil: ${result.relativePath}`)
    }
  }

  async function pickCv() {
    const result = await window.adminApi.uploadCv()
    if (result.ok) {
      update('cvFile', result.fileName)
      setStatus(`CV actualizado: ${result.fileName}`)
    }
  }

  return (
    <div className="card">
      <h2>Perfil</h2>
      <div className="grid grid-2">
        <label>
          Nombre
          <input value={profile.name || ''} onChange={(e) => update('name', e.target.value)} />
        </label>
        <label>
          Nombre corto (nav)
          <input
            value={profile.shortName || ''}
            onChange={(e) => update('shortName', e.target.value)}
          />
        </label>
        <label>
          Rol
          <input value={profile.role || ''} onChange={(e) => update('role', e.target.value)} />
        </label>
        <label>
          Tagline
          <input
            value={profile.tagline || ''}
            onChange={(e) => update('tagline', e.target.value)}
          />
        </label>
        <label style={{ gridColumn: '1 / -1' }}>
          Título Sobre mí
          <input
            value={profile.aboutTitle || ''}
            onChange={(e) => update('aboutTitle', e.target.value)}
          />
        </label>
        <label style={{ gridColumn: '1 / -1' }}>
          Bio (separá párrafos con línea vacía)
          <textarea
            rows={8}
            value={profile.bio || ''}
            onChange={(e) => update('bio', e.target.value)}
          />
        </label>
        <label>
          Título objetivos
          <input
            value={profile.objectivesTitle || ''}
            onChange={(e) => update('objectivesTitle', e.target.value)}
          />
        </label>
        <label style={{ gridColumn: '1 / -1' }}>
          Objetivos (separá párrafos con línea vacía)
          <textarea
            rows={5}
            value={profile.objectives || ''}
            onChange={(e) => update('objectives', e.target.value)}
          />
        </label>
        <label>
          Ubicación
          <input
            value={profile.location || ''}
            onChange={(e) => update('location', e.target.value)}
          />
        </label>
        <label>
          Email
          <input value={profile.email || ''} onChange={(e) => update('email', e.target.value)} />
        </label>
        <label>
          Teléfono (visible)
          <input value={profile.phone || ''} onChange={(e) => update('phone', e.target.value)} />
        </label>
        <label>
          WhatsApp (solo números, con código país)
          <input
            value={profile.whatsapp || ''}
            onChange={(e) => update('whatsapp', e.target.value)}
            placeholder="541138332282"
          />
        </label>
        <label>
          Instagram
          <input
            value={profile.instagram || ''}
            onChange={(e) => update('instagram', e.target.value)}
          />
        </label>
        <label>
          LinkedIn
          <input
            value={profile.linkedin || ''}
            onChange={(e) => update('linkedin', e.target.value)}
          />
        </label>
        <label>
          GitHub
          <input value={profile.github || ''} onChange={(e) => update('github', e.target.value)} />
        </label>
        <label>
          Imagen de perfil
          <div className="row">
            <input
              value={profile.profileImage || ''}
              onChange={(e) => update('profileImage', e.target.value)}
            />
            <button type="button" className="btn" onClick={pickImage}>
              Subir
            </button>
          </div>
        </label>
        <label>
          Archivo CV
          <div className="row">
            <input
              value={profile.cvFile || ''}
              onChange={(e) => update('cvFile', e.target.value)}
            />
            <button type="button" className="btn" onClick={pickCv}>
              Subir PDF
            </button>
          </div>
        </label>
      </div>
      <div className="row" style={{ marginTop: '1rem' }}>
        <button className="btn btn-primary" onClick={onSave}>
          Guardar perfil
        </button>
      </div>
    </div>
  )
}
