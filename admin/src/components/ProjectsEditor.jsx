function emptyProject() {
  return {
    id: `project-${Date.now()}`,
    title: 'Nuevo proyecto',
    summary: '',
    description: '',
    stack: [],
    image: '',
    demoUrl: '',
    repoUrl: '',
    featured: false,
    order: 99,
  }
}

export default function ProjectsEditor({ projects, setProjects, onSave, setStatus }) {
  const list = projects.projects || []

  function updateProject(index, patch) {
    setProjects((prev) => ({
      ...prev,
      projects: prev.projects.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }))
  }

  async function removeProject(index) {
    const current = list[index]
    const ok = window.confirm(
      `¿Eliminar "${current?.title || 'este proyecto'}"?\nSe guarda en disco al instante. Después usá Publicar para actualizar la web.`,
    )
    if (!ok) return

    const next = {
      ...projects,
      projects: projects.projects.filter((_, i) => i !== index),
    }
    setProjects(next)
    await onSave(next)
    setStatus('Proyecto eliminado y guardado. Publicá para que desaparezca de la web.')
  }

  async function addProject() {
    const next = {
      ...projects,
      projects: [...projects.projects, emptyProject()],
    }
    setProjects(next)
    await onSave(next)
  }

  async function uploadImage(index, title) {
    const result = await window.adminApi.uploadImage({
      suggestedName: title || `project-${index + 1}`,
    })
    if (result.ok) {
      const next = {
        ...projects,
        projects: projects.projects.map((item, i) =>
          i === index ? { ...item, image: result.relativePath } : item,
        ),
      }
      setProjects(next)
      await onSave(next)
      setStatus(`Imagen guardada: ${result.relativePath}`)
    }
  }

  return (
    <div>
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>Proyectos</h2>
          <div className="row">
            <button className="btn" onClick={addProject}>
              Agregar
            </button>
            <button className="btn btn-primary" onClick={() => onSave(projects)}>
              Guardar proyectos
            </button>
          </div>
        </div>
        <div className="grid" style={{ marginTop: '1rem' }}>
          <label>
            Label
            <input
              value={projects.label || ''}
              onChange={(e) => setProjects((prev) => ({ ...prev, label: e.target.value }))}
            />
          </label>
          <label>
            Título
            <input
              value={projects.title || ''}
              onChange={(e) => setProjects((prev) => ({ ...prev, title: e.target.value }))}
            />
          </label>
          <label style={{ gridColumn: '1 / -1' }}>
            Intro
            <textarea
              rows={4}
              value={projects.intro || ''}
              onChange={(e) => setProjects((prev) => ({ ...prev, intro: e.target.value }))}
            />
          </label>
        </div>
        <p className="muted">
          Eliminar / agregar / subir imagen se guardan solos en <code>content/</code>. Para que se
          vea en el sitio publicado, usá la pestaña <strong>Publicar</strong>.
        </p>
      </div>

      <div className="project-list">
        {list.map((project, index) => (
          <article className="project-card" key={project.id}>
            <header>
              <strong>
                #{index + 1} {project.title || 'Sin título'}
              </strong>
              <div className="row">
                {project.featured ? <span className="chip">Featured</span> : null}
                <button className="btn btn-danger" onClick={() => removeProject(index)}>
                  Eliminar
                </button>
              </div>
            </header>

            <div className="grid grid-2">
              <label>
                ID
                <input value={project.id} onChange={(e) => updateProject(index, { id: e.target.value })} />
              </label>
              <label>
                Orden
                <input
                  type="number"
                  value={project.order}
                  onChange={(e) => updateProject(index, { order: Number(e.target.value) || 0 })}
                />
              </label>
              <label>
                Título
                <input
                  value={project.title}
                  onChange={(e) => updateProject(index, { title: e.target.value })}
                />
              </label>
              <label>
                Featured
                <select
                  value={project.featured ? 'yes' : 'no'}
                  onChange={(e) => updateProject(index, { featured: e.target.value === 'yes' })}
                >
                  <option value="yes">Sí</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label style={{ gridColumn: '1 / -1' }}>
                Resumen
                <textarea
                  value={project.summary}
                  onChange={(e) => updateProject(index, { summary: e.target.value })}
                />
              </label>
              <label style={{ gridColumn: '1 / -1' }}>
                Descripción
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(index, { description: e.target.value })}
                />
              </label>
              <label style={{ gridColumn: '1 / -1' }}>
                Stack (coma)
                <input
                  value={(project.stack || []).join(', ')}
                  onChange={(e) =>
                    updateProject(index, {
                      stack: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </label>
              <label>
                Demo URL
                <input
                  value={project.demoUrl || ''}
                  onChange={(e) => updateProject(index, { demoUrl: e.target.value })}
                />
              </label>
              <label>
                Repo URL
                <input
                  value={project.repoUrl || ''}
                  onChange={(e) => updateProject(index, { repoUrl: e.target.value })}
                />
              </label>
              <label style={{ gridColumn: '1 / -1' }}>
                Imagen
                <div className="row">
                  <input
                    value={project.image || ''}
                    onChange={(e) => updateProject(index, { image: e.target.value })}
                  />
                  <button type="button" className="btn" onClick={() => uploadImage(index, project.id)}>
                    Subir
                  </button>
                </div>
              </label>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
