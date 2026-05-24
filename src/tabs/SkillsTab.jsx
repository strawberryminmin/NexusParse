function SkillBadge({ skill, bg, color }) {
  return (
    <span
      className="badge"
      style={{
        display: 'inline-block',
        padding: '5px 14px',
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 600,
        background: bg,
        color: color,
        border: `1px solid ${color}44`,
        boxShadow: `0 0 10px ${color}10`,
      }}>
      {skill}
    </span>
  )
}

function SkillSection({ title, icon, skills, bg, color, emptyMsg }) {
  return (
    <div
      className="rounded-2xl p-6 card-hover animate-fadeIn"
      style={{
        background: 'rgba(255, 255, 255, 0.015)',
        border: '1px solid rgba(109, 40, 217, 0.18)',
        backdropFilter: 'blur(10px)'
      }}>
      <div className="flex items-center gap-3.5 mb-4">
        <span style={{ fontSize: 18, color: color }}>{icon}</span>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
          {title}
        </h3>
        <span
          className="rounded-full px-2.5 py-0.5 border"
          style={{
            background: bg,
            borderColor: `${color}33`,
            color: color,
            fontSize: 12,
            fontWeight: 700,
          }}>
          {skills.length}
        </span>
      </div>

      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2.5">
          {skills.map((skill, i) => (
            <SkillBadge key={i} skill={skill} bg={bg} color={color} />
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 13.5, color: '#64748b', fontStyle: 'italic' }}>
          {emptyMsg}
        </p>
      )}
    </div>
  )
}

export default function SkillsTab({ data }) {
  const { skills } = data

  const totalSkills =
    (skills?.technical?.length || 0) +
    (skills?.tools?.length || 0) +
    (skills?.soft?.length || 0) +
    (skills?.languages?.length || 0)

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
          Skills Overview
        </h2>
        <span
          className="rounded-full px-3.5 py-1 border"
          style={{
            background: 'rgba(34, 211, 238, 0.08)',
            borderColor: 'rgba(34, 211, 238, 0.25)',
            color: '#22d3ee',
            fontSize: 12,
            fontWeight: 700,
          }}>
          {totalSkills} skills found
        </span>
      </div>

      {/* Technical Skills */}
      <SkillSection
        title="Technical Skills"
        icon="⚡"
        skills={skills?.technical || []}
        bg="rgba(59, 130, 246, 0.06)"
        color="#60a5fa"
        emptyMsg="No technical skills identified"
      />

      {/* Tools & Platforms */}
      <SkillSection
        title="Tools & Platforms"
        icon="🛠"
        skills={skills?.tools || []}
        bg="rgba(168, 85, 247, 0.06)"
        color="#c084fc"
        emptyMsg="No tools or platforms identified"
      />

      {/* Soft Skills */}
      <SkillSection
        title="Soft Skills"
        icon="✦"
        skills={skills?.soft || []}
        bg="rgba(16, 185, 129, 0.06)"
        color="#34d399"
        emptyMsg="No soft skills identified"
      />

      {/* Languages */}
      <SkillSection
        title="Languages"
        icon="⬡"
        skills={skills?.languages || []}
        bg="rgba(249, 115, 22, 0.06)"
        color="#ff983f"
        emptyMsg="No languages identified"
      />

      {/* Empty State */}
      {totalSkills === 0 && (
        <div
          className="flex flex-col items-center justify-center py-16 gap-3"
          style={{
            background: 'rgba(255, 255, 255, 0.015)',
            border: '1px solid rgba(109, 40, 217, 0.18)',
            borderRadius: 16,
            backdropFilter: 'blur(10px)'
          }}>
          <div style={{ fontSize: 40, color: '#3b82f6' }}>⬡</div>
          <p style={{ fontSize: 15, color: '#ffffff', fontWeight: 700 }}>
            No skills detected
          </p>
          <p style={{ fontSize: 13, color: '#64748b' }}>
            Try uploading a more detailed resume
          </p>
        </div>
      )}
    </div>
  )
}