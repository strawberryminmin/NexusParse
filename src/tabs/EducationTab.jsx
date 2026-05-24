import { IconCheck } from '../Icons'

function EducationCard({ edu }) {
  const { institution, year, gpa, honors } = edu
  return (
    <div
      className="rounded-2xl p-6 card-hover animate-fadeIn"
      style={{
        background: 'rgba(255, 255, 255, 0.015)',
        border: '1px solid rgba(109, 40, 217, 0.18)',
        backdropFilter: 'blur(10px)'
      }}>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className="flex items-center justify-center rounded-xl border"
            style={{
              width: 44, height: 44,
              background: 'rgba(109, 40, 217, 0.1)',
              borderColor: 'rgba(109, 40, 217, 0.25)',
              color: '#a78bfa',
              fontSize: 20,
              flexShrink: 0,
            }}>
            ◈
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: '#ffffff', marginBottom: 4, letterSpacing: '-0.010em' }}>
              {institution || 'Unknown Institution'}
            </h3>
          </div>
        </div>

        {year && (
          <span
            className="rounded-full px-3 py-1 border"
            style={{
              background: 'rgba(34, 211, 238, 0.08)',
              borderColor: 'rgba(34, 211, 238, 0.25)',
              color: '#22d3ee',
              fontSize: 12,
              fontWeight: 700,
              flexShrink: 0,
            }}>
            {year}
          </span>
        )}
      </div>

      {/* GPA & Honors */}
      {(gpa || honors) && (
        <div className="flex flex-wrap gap-4 mt-4 pt-4"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          {gpa && (
            <span style={{ fontSize: 12.5, color: '#cbd5e1' }}>
              GPA / CGPA: <strong style={{ color: '#ffffff' }}>{gpa}</strong>
            </span>
          )}
          {honors && (
            <span className="badge" style={{ background: 'rgba(124, 58, 237, 0.08)', borderColor: 'rgba(124, 58, 237, 0.25)', color: '#c4b5fd' }}>
              {honors}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

function CertificationCard({ cert }) {
  const { name, issuer, year } = cert
  return (
    <div
      className="flex items-center gap-4 rounded-xl p-4 card-hover animate-fadeIn"
      style={{
        background: 'rgba(255, 255, 255, 0.015)',
        border: '1px solid rgba(109, 40, 217, 0.18)',
        backdropFilter: 'blur(10px)'
      }}>

      <div
        className="flex items-center justify-center rounded-full border"
        style={{
          width: 32, height: 32,
          background: 'rgba(16, 185, 129, 0.06)',
          borderColor: 'rgba(16, 185, 129, 0.25)',
          color: '#34d399',
          flexShrink: 0,
        }}>
        <IconCheck />
      </div>

      <div className="flex-1 min-w-0">
        <p style={{ fontSize: 13.5, fontWeight: 700, color: '#ffffff' }}>
          {name}
        </p>
        {issuer && (
          <p style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>
            {issuer}
          </p>
        )}
      </div>

      {year && (
        <span
          className="rounded-full px-3 py-1 border"
          style={{
            background: 'rgba(59, 130, 246, 0.06)',
            borderColor: 'rgba(59, 130, 246, 0.25)',
            color: '#60a5fa',
            fontSize: 11,
            fontWeight: 700,
            flexShrink: 0,
          }}>
          {year}
        </span>
      )}
    </div>
  )
}

function ProjectCard({ project }) {
  const { name, description, tech, link, impact } = project
  return (
    <div
      className="rounded-2xl p-6 card-hover animate-fadeIn"
      style={{
        background: 'rgba(255, 255, 255, 0.015)',
        border: '1px solid rgba(109, 40, 217, 0.18)',
        backdropFilter: 'blur(10px)'
      }}>

      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 style={{ fontSize: 15, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
          {name}
        </h3>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: 12,
              color: '#22d3ee',
              textDecoration: 'none',
              flexShrink: 0,
              fontWeight: 600,
            }}
            className="hover:underline"
          >
            Link ↗
          </a>
        )}
      </div>

      {description && (
        <p style={{ fontSize: 13.5, color: '#cbd5e1', lineHeight: 1.7, marginBottom: 12 }}>
          {description}
        </p>
      )}

      {impact && (
        <p style={{ fontSize: 13, color: '#34d399', fontWeight: 600, marginBottom: 12 }}>
          Impact: <span style={{ fontWeight: 400, color: '#cbd5e1' }}>{impact}</span>
        </p>
      )}

      {tech && tech.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tech.map((t, i) => (
            <span
              key={i}
              className="badge"
              style={{
                fontSize: 11,
                padding: '3px 10px',
                background: 'rgba(168, 85, 247, 0.06)',
                borderColor: 'rgba(168, 85, 247, 0.25)',
                color: '#c084fc',
              }}>
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function EducationTab({ data }) {
  const { education, certifications, projects } = data

  return (
    <div className="flex flex-col gap-8 animate-fadeIn">

      {/* Education */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
            Education
          </h2>
          <span
            className="rounded-full px-2.5 py-0.5 border"
            style={{
              background: 'rgba(109, 40, 217, 0.08)',
              borderColor: 'rgba(109, 40, 217, 0.25)',
              color: '#c4b5fd',
              fontSize: 12,
              fontWeight: 700,
            }}>
            {education?.length || 0}
          </span>
        </div>

        {education && education.length > 0 ? (
          <div className="flex flex-col gap-3.5">
            {education.map((edu, i) => (
              <EducationCard key={i} edu={edu} />
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-10 rounded-2xl border"
            style={{
              background: 'rgba(255, 255, 255, 0.015)',
              borderColor: 'rgba(109, 40, 217, 0.18)',
              backdropFilter: 'blur(10px)'
            }}>
            <p style={{ fontSize: 28, color: '#64748b', marginBottom: 8 }}>⬡</p>
            <p style={{ fontSize: 14, color: '#64748b', fontWeight: 600 }}>
              No education details found
            </p>
          </div>
        )}
      </div>

      {/* Certifications */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
            Certifications
          </h2>
          <span
            className="rounded-full px-2.5 py-0.5 border"
            style={{
              background: 'rgba(109, 40, 217, 0.08)',
              borderColor: 'rgba(109, 40, 217, 0.25)',
              color: '#c4b5fd',
              fontSize: 12,
              fontWeight: 700,
            }}>
            {certifications?.length || 0}
          </span>
        </div>

        {certifications && certifications.length > 0 ? (
          <div className="flex flex-col gap-3.5">
            {certifications.map((cert, i) => (
              <CertificationCard key={i} cert={cert} />
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-10 rounded-2xl border"
            style={{
              background: 'rgba(255, 255, 255, 0.015)',
              borderColor: 'rgba(109, 40, 217, 0.18)',
              backdropFilter: 'blur(10px)'
            }}>
            <p style={{ fontSize: 28, color: '#64748b', marginBottom: 8 }}>⬡</p>
            <p style={{ fontSize: 14, color: '#64748b', fontWeight: 600 }}>
              No certifications found
            </p>
          </div>
        )}
      </div>

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
              Projects
            </h2>
            <span
              className="rounded-full px-2.5 py-0.5 border"
              style={{
                background: 'rgba(109, 40, 217, 0.08)',
                borderColor: 'rgba(109, 40, 217, 0.25)',
                color: '#c4b5fd',
                fontSize: 12,
                fontWeight: 700,
              }}>
              {projects.length}
            </span>
          </div>
          <div className="flex flex-col gap-3.5">
            {projects.map((project, i) => (
              <ProjectCard key={i} project={project} />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}