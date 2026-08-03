function emptyCategory() {
  return {
    id: `category-${Date.now()}`,
    name: 'Nueva categoría',
    items: ['Nueva tecnología'],
  }
}

export default function SkillsEditor({ skills, setSkills, onSave }) {
  const categories = skills.categories || []

  function updateMeta(field, value) {
    setSkills((prev) => ({ ...prev, [field]: value }))
  }

  function updateCategory(index, patch) {
    setSkills((prev) => ({
      ...prev,
      categories: prev.categories.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }))
  }

  async function removeCategory(index) {
    const ok = window.confirm('¿Eliminar esta categoría? Se guarda al instante.')
    if (!ok) return
    const next = {
      ...skills,
      categories: skills.categories.filter((_, i) => i !== index),
    }
    setSkills(next)
    await onSave(next)
  }

  async function addCategory() {
    const next = {
      ...skills,
      categories: [...(skills.categories || []), emptyCategory()],
    }
    setSkills(next)
    await onSave(next)
  }

  return (
    <div>
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>Skills / Stack</h2>
          <div className="row">
            <button className="btn" onClick={addCategory}>
              Agregar categoría
            </button>
            <button className="btn btn-primary" onClick={() => onSave(skills)}>
              Guardar skills
            </button>
          </div>
        </div>

        <div className="grid">
          <label>
            Título de sección
            <input
              value={skills.title || ''}
              onChange={(e) => updateMeta('title', e.target.value)}
            />
          </label>
          <label>
            Intro
            <textarea
              rows={3}
              value={skills.intro || ''}
              onChange={(e) => updateMeta('intro', e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="project-list">
        {categories.map((category, index) => (
          <article className="project-card" key={category.id}>
            <header>
              <strong>{category.name || 'Sin nombre'}</strong>
              <button className="btn btn-danger" onClick={() => removeCategory(index)}>
                Eliminar
              </button>
            </header>
            <div className="grid grid-2">
              <label>
                ID
                <input
                  value={category.id}
                  onChange={(e) => updateCategory(index, { id: e.target.value })}
                />
              </label>
              <label>
                Nombre
                <input
                  value={category.name}
                  onChange={(e) => updateCategory(index, { name: e.target.value })}
                />
              </label>
              <label style={{ gridColumn: '1 / -1' }}>
                Tecnologías (una por línea)
                <textarea
                  rows={5}
                  value={(category.items || []).join('\n')}
                  onChange={(e) =>
                    updateCategory(index, {
                      items: e.target.value
                        .split('\n')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </label>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
