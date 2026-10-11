import { pad2, projectsWithSkill } from '../lib/content'
import { ModuleFrame, ModuleHead, SideList } from './ui'

export default function StackView({
  skillsData,
  projects,
  active,
  onSelect,
  onOpenProject,
  motion,
  headingRef,
}) {
  const categories = skillsData?.categories || []
  const [categoryId, skillName] = String(active || '').split('::')
  const category = categories.find((item) => item.id === categoryId) || categories[0]

  const items = categories.map((item, index) => ({
    id: item.id,
    index: pad2(index + 1),
    label: item.name,
    meta: `× ${(item.items || []).length}`,
  }))

  return (
    <ModuleFrame
      motion={motion}
      index="03"
      sidebar={
        <SideList
          label="Categorías"
          items={items}
          activeId={category?.id}
          onSelect={onSelect}
        />
      }
    >
      <ModuleHead
        index="03"
        kicker="Stack"
        title="Stack"
        deck={skillsData?.title}
        headingRef={headingRef}
      />
      {skillsData?.intro ? <p className="prose">{skillsData.intro}</p> : null}
      {category ? (
        <div key={category.id} className="pane">
          <h2 className="pane-title">{category.name}</h2>
          <p className="pane-note">
            Elegí una tecnología para ver en qué proyectos de la obra aparece.
          </p>
          <div className="tiles">
            {(category.items || []).map((skill) => {
              const count = projectsWithSkill(skill, projects).length
              const selected = skillName === skill
              return (
                <button
                  key={skill}
                  type="button"
                  className={selected ? 'tile is-active' : 'tile'}
                  aria-pressed={selected}
                  onClick={() => onSelect(`${category.id}::${skill}`)}
                >
                  <span className="tile__name">{skill}</span>
                  <span className="tile__count">{count ? pad2(count) : '·'}</span>
                </button>
              )
            })}
          </div>
          {skillName ? (
            <SkillProjects skill={skillName} projects={projects} onOpenProject={onOpenProject} />
          ) : null}
        </div>
      ) : null}
    </ModuleFrame>
  )
}

function SkillProjects({ skill, projects, onOpenProject }) {
  const list = projectsWithSkill(skill, projects)

  return (
    <div className="skill-use">
          <p className="pane-note">
            {list.length
              ? `${skill} aparece en ${pad2(list.length)} ${list.length === 1 ? 'proyecto' : 'proyectos'}.`
              : `${skill} forma parte del stack general.`}
          </p>
      <div className="records">
        {list.map((project, index) => (
          <button
            key={project.id}
            type="button"
            className="record"
            onClick={() => onOpenProject(project.id)}
          >
            <span className="record__index">{pad2(index + 1)}</span>
            <span>
              <span className="record__title">{project.title}</span>
              <span className="record__meta">{(project.stack || []).join(' · ')}</span>
            </span>
            <span className="record__go">Abrir</span>
          </button>
        ))}
      </div>
    </div>
  )
}
