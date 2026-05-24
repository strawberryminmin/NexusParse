import { IconBriefcase, IconCalendar, IconLocation } from '../Icons'

function TechBadge({ tech }) {
  return (
    <span className="badge"
      style={{
        background: 'rgba(34, 211, 238, 0.08)',
        borderColor: 'rgba(34, 211, 238, 0.25)',
        color: '#22d3ee',
        fontSize: 11,
        padding: '3px 10px',
      }}>
      {tech}
    </span>
  )
}

function EmploymentBadge({ type }) {
  if (!type) return null
  const colors = {
    'full-time':   { bg: 'rgba(16, 185, 129, 0.06)', border: 'rgba(16, 185, 129, 0.25)', color: '#34d399' },
    'part-time':   { bg: 'rgba(245, 158, 11, 0.06)',  border: 'rgba(245, 158, 11, 0.25)',  color: '#facc15' },
    'contract':    { bg: 'rgba(249, 115, 22, 0.06)',  border: 'rgba(249, 115, 22, 0.25)',  color: '#ff983f' },
    'freelance':   { bg: 'rgba(168, 85, 247, 0.06)',  border: 'rgba(168, 85, 247, 0.25)',  color: '#c084fc' },
    'internship':  { bg: 'rgba(59, 130, 246, 0.06)',  border: 'rgba(59, 130, 246, 0.25)',  color: '#60a5fa' },
    'remote':      { bg: 'rgba(6, 182, 212, 0.06)',   border: 'rgba(6, 182, 212, 0.25)',   color: '#22d3ee' },
    'hybrid':      { bg: 'rgba(255, 255, 255, 0.04)',  border: 'rgba(255, 255, 255, 0.08)',  color: '#cbd5e1' },
  }
  const key = type.toLowerCase().replace(/\s+/g, '-')
  const c = colors[key] || { bg: 'rgba(255, 255, 255, 0.04)', border: 'rgba(255, 255, 255, 0.08)', color: '#94a3b8' }
  return (
    <span className="badge"
      style={{ background: c.bg, borderColor: c.border, color: c.color, fontSize: 11, padding: '3px 10px' }}>
      {type}
    </span>
  )
}

function ExperienceCard({ exp, isLast }) {
  const {
    company, title, employment_type,
    start_date, end_date, location,
    bullets, technologies_used
  } = exp

  const dateRange = [start_date, end_date].filter(Boolean).join(' — ')

  return (
    <div className="flex gap-4">

      {/* Timeline */}
      <div className="flex flex-col items-center" style={{ paddingTop: 4 }}>
        <div className="timeline-dot" />
        {!isLast && <div className="timeline-line" style={{ flex: 1, marginTop: 6 }} />}
      </div>

      {/* Card */}
      <div className="flex-1 pb-6">
        <div className="rounded-2xl p-6 card-hover"
          style={{
            background: 'rgba(255, 255, 255, 0.015)',
            border: '1px solid rgba(109, 40, 217, 0.18)',
            backdropFilter: 'blur(10px)'
          }}>

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: '#ffffff', marginBottom: 4, letterSpacing: '-0.01em' }}>
                {company}
              </h3>
              {title && (
                <p style={{ fontSize: 13.5, color: '#22d3ee', fontWeight: 600 }}>
                  {title}
                </p>
              )}
            </div>
            <EmploymentBadge type={employment_type} />
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 mb-4">
            {dateRange && (
              <div className="flex items-center gap-2"
                style={{ fontSize: 12.5, color: '#64748b' }}>
                <IconCalendar />
                <span style={{ color: '#cbd5e1' }}>{dateRange}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2"
                style={{ fontSize: 12.5, color: '#64748b' }}>
                <IconLocation />
                <span style={{ color: '#cbd5e1' }}>{location}</span>
              </div>
            )}
          </div>

          {/* Bullets */}
          {bullets && bullets.length > 0 && (
            <ul className="flex flex-col gap-2.5 mb-5"
              style={{ paddingLeft: 0, listStyle: 'none' }}>
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#a78bfa', flexShrink: 0, marginTop: 7,
                    boxShadow: '0 0 6px #a78bfa'
                  }} />
                  <span style={{ fontSize: 13.5, color: '#cbd5e1', lineHeight: 1.65 }}>
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* Tech Tags */}
          {technologies_used && technologies_used.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4"
              style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
              {technologies_used.map((tech, i) => (
                <TechBadge key={i} tech={tech} />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default function ExperienceTab({ data }) {
  const { experience } = data

  if (!experience || experience.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 border rounded-2xl"
        style={{
          background: 'rgba(255, 255, 255, 0.015)',
          borderColor: 'rgba(109, 40, 217, 0.18)',
          backdropFilter: 'blur(10px)'
        }}>
        <div style={{ fontSize: 32, color: '#64748b' }}>⬡</div>
        <p style={{ fontSize: 15, color: '#ffffff', fontWeight: 700 }}>
          No work experience found
        </p>
        <p style={{ fontSize: 13, color: '#64748b' }}>
          The resume may not have a clearly labeled Experience section
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <IconBriefcase />
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
          Work Experience
        </h2>
        <span className="rounded-full px-2.5 py-0.5 border"
          style={{
            background: 'rgba(109, 40, 217, 0.08)',
            borderColor: 'rgba(109, 40, 217, 0.25)',
            color: '#c4b5fd',
            fontSize: 12,
            fontWeight: 700
          }}>
          {experience.length}
        </span>
      </div>

      <div>
        {experience.map((exp, i) => (
          <ExperienceCard
            key={i}
            exp={exp}
            isLast={i === experience.length - 1}
          />
        ))}
      </div>
    </div>
  )
}