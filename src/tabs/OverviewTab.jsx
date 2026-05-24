import {
  IconMail, IconPhone, IconLocation,
  IconLinkedIn, IconGitHub, IconGlobe, IconBriefcase
} from '../Icons'

function Avatar({ name, photo }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'
  
  if (photo) {
    return (
      <div className="flex items-center justify-center rounded-2xl overflow-hidden border"
        style={{
          width: 64, height: 64, flexShrink: 0,
          borderColor: 'rgba(34, 211, 238, 0.3)',
          boxShadow: '0 0 15px rgba(34, 211, 238, 0.15)'
        }}>
        <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center rounded-2xl font-bold border"
      style={{
        width: 64,
        height: 64,
        background: 'linear-gradient(135deg, rgba(109, 40, 217, 0.2) 0%, rgba(34, 211, 238, 0.15) 100%)',
        color: '#22d3ee',
        borderColor: 'rgba(34, 211, 238, 0.3)',
        fontSize: 22,
        flexShrink: 0,
        boxShadow: '0 0 15px rgba(34, 211, 238, 0.15)',
        textShadow: '0 0 8px rgba(34, 211, 238, 0.5)'
      }}>
      {initials}
    </div>
  )
}

function StatCard({ label, value, badge, badgeColor }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl p-6 card-hover"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(109, 40, 217, 0.15)',
        flex: 1,
        minWidth: 0,
        textAlign: 'center',
        backdropFilter: 'blur(10px)'
      }}>
      {badge ? (
        <span className="rounded-full px-4 py-1.5 font-bold border"
          style={{
            background: 'rgba(34, 211, 238, 0.08)',
            borderColor: 'rgba(34, 211, 238, 0.3)',
            color: '#22d3ee',
            fontSize: 13,
            marginBottom: 8,
            boxShadow: '0 0 10px rgba(34, 211, 238, 0.1)'
          }}>
          {value}
        </span>
      ) : (
        <p style={{ fontSize: 26, fontWeight: 800, color: '#ffffff', marginBottom: 6, fontFamily: "'Orbitron', sans-serif" }}>
          {value}
        </p>
      )}
      <p style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</p>
    </div>
  )
}

function RecommendationBanner({ recommendation, summary }) {
  const config = {
    'Strong Yes': { bg: 'rgba(16, 185, 129, 0.06)', border: 'rgba(16, 185, 129, 0.3)', dot: '#10b981', text: '#34d399', shadow: '0 0 20px rgba(16, 185, 129, 0.15)' },
    'Yes':        { bg: 'rgba(6, 182, 212, 0.06)', border: 'rgba(6, 182, 212, 0.3)', dot: '#06b6d4', text: '#22d3ee', shadow: '0 0 20px rgba(6, 182, 212, 0.15)' },
    'Maybe':      { bg: 'rgba(245, 158, 11, 0.06)', border: 'rgba(245, 158, 11, 0.3)', dot: '#f59e0b', text: '#fbbf24', shadow: '0 0 20px rgba(245, 158, 11, 0.15)' },
    'No':         { bg: 'rgba(239, 68, 68, 0.06)', border: 'rgba(239, 68, 68, 0.3)', dot: '#ef4444', text: '#fca5a5', shadow: '0 0 20px rgba(239, 68, 68, 0.15)' },
  }
  const c = config[recommendation] || config['Maybe']
  return (
    <div className="rounded-2xl p-5"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        boxShadow: c.shadow,
        backdropFilter: 'blur(10px)'
      }}>
      <div className="flex items-center gap-2 mb-3">
        <div style={{
          width: 9, height: 9, borderRadius: '50%',
          background: c.dot, flexShrink: 0,
          boxShadow: `0 0 10px ${c.dot}`
        }} />
        <p style={{ fontWeight: 800, color: c.text, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Hiring Recommendation: {recommendation}
        </p>
      </div>
      {summary && (
        <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.7 }}>
          {summary}
        </p>
      )}
    </div>
  )
}

export default function OverviewTab({ data }) {
  const { candidate, current_title, summary, total_experience_years, ai_insights } = data
  const atsScore = ai_insights?.ats_score || 0

  const levelColors = {
    Junior:    { bg: 'rgba(59, 130, 246, 0.08)', border: 'rgba(59, 130, 246, 0.3)', color: '#60a5fa' },
    Mid:       { bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.3)', color: '#34d399' },
    Senior:    { bg: 'rgba(234, 179, 8, 0.08)',  border: 'rgba(234, 179, 8, 0.3)',  color: '#facc15' },
    Lead:      { bg: 'rgba(249, 115, 22, 0.08)',  border: 'rgba(249, 115, 22, 0.3)',  color: '#ff983f' },
    Executive: { bg: 'rgba(168, 85, 247, 0.08)',  border: 'rgba(168, 85, 247, 0.3)',  color: '#c084fc' },
  }
  const lc = levelColors[ai_insights?.candidate_level] || levelColors.Junior

  // Setup ATS Score circle status
  let atsColor = '#ef4444'
  if (atsScore >= 80) atsColor = '#10b981'
  else if (atsScore >= 60) atsColor = '#3b82f6'
  else if (atsScore >= 40) atsColor = '#f59e0b'

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      
      {/* Top Section: Profile Card & ATS Score Meter side-by-side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '24px' }} className="md:grid-cols-hero">
        
        {/* Candidate Profile Card */}
        <div className="rounded-2xl p-6"
          style={{
            background: 'rgba(255, 255, 255, 0.015)',
            border: '1px solid rgba(109, 40, 217, 0.18)',
            backdropFilter: 'blur(20px)'
          }}>
          <div className="flex items-start gap-5">
            <Avatar name={candidate?.name} photo={candidate?.photo} />
            <div className="flex-1 min-w-0">
              <h2 style={{ fontSize: 24, fontWeight: 900, color: '#ffffff', marginBottom: 6, letterSpacing: '-0.02em' }}>
                {candidate?.name || 'Unknown Candidate'}
              </h2>
              {current_title && (
                <div className="flex items-center gap-1.5" style={{ color: '#94a3b8', fontSize: 14, marginBottom: 12 }}>
                  <IconBriefcase />
                  <span style={{ fontWeight: 500 }}>{current_title}</span>
                </div>
              )}

              {/* Contact Row */}
              <div className="flex flex-wrap gap-4" style={{ marginBottom: 16 }}>
                {candidate?.email && (
                  <div className="flex items-center gap-2" style={{ fontSize: 13, color: '#64748b' }}>
                    <IconMail /><span style={{ color: '#94a3b8' }}>{candidate.email}</span>
                  </div>
                )}
                {candidate?.phone && (
                  <div className="flex items-center gap-2" style={{ fontSize: 13, color: '#64748b' }}>
                    <IconPhone /><span style={{ color: '#94a3b8' }}>{candidate.phone}</span>
                  </div>
                )}
                {candidate?.location && (
                  <div className="flex items-center gap-2" style={{ fontSize: 13, color: '#64748b' }}>
                    <IconLocation /><span style={{ color: '#94a3b8' }}>{candidate.location}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex gap-2.5">
                {candidate?.linkedin && (
                  <a href={candidate.linkedin} target="_blank" rel="noreferrer"
                    className="flex items-center justify-center rounded-xl transition-all border"
                    style={{
                      width: 36, height: 36,
                      background: 'rgba(59, 130, 246, 0.05)',
                      color: '#60a5fa',
                      borderColor: 'rgba(59, 130, 246, 0.2)',
                    }}>
                    <IconLinkedIn />
                  </a>
                )}
                {candidate?.github && (
                  <a href={candidate.github} target="_blank" rel="noreferrer"
                    className="flex items-center justify-center rounded-xl transition-all border"
                    style={{
                      width: 36, height: 36,
                      background: 'rgba(255, 255, 255, 0.02)',
                      color: '#cbd5e1',
                      borderColor: 'rgba(255, 255, 255, 0.08)',
                    }}>
                    <IconGitHub />
                  </a>
                )}
                {candidate?.website && (
                  <a href={candidate.website} target="_blank" rel="noreferrer"
                    className="flex items-center justify-center rounded-xl transition-all border"
                    style={{
                      width: 36, height: 36,
                      background: 'rgba(16, 185, 129, 0.05)',
                      color: '#34d399',
                      borderColor: 'rgba(16, 185, 129, 0.2)',
                    }}>
                    <IconGlobe />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ATS Score Circular Meter */}
        <div className="rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.015)',
            border: '1px solid rgba(109, 40, 217, 0.18)',
            backdropFilter: 'blur(20px)',
            textAlign: 'center'
          }}>
          <div style={{ position: 'relative', width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContext: 'center' }}>
            <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="55" cy="55" r="48" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
              <circle cx="55" cy="55" r="48" fill="transparent" stroke={atsColor} strokeWidth="8"
                strokeDasharray={2 * Math.PI * 48}
                strokeDashoffset={2 * Math.PI * 48 * (1 - atsScore / 100)}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  filter: `drop-shadow(0 0 8px ${atsColor})`
                }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff', fontFamily: "'Orbitron', sans-serif" }}>
                {atsScore}
              </span>
              <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Score
              </span>
            </div>
          </div>
          <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#22d3ee', marginTop: '14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ATS Suitability
          </h3>
          <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
            {atsScore >= 80 ? 'Highly Optimised' : atsScore >= 60 ? 'Standard Readiness' : 'Needs Optimization'}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <StatCard
          label="Years Experience"
          value={`${total_experience_years} yrs`}
        />
        <StatCard
          label="Candidate Level"
          value={ai_insights?.candidate_level || 'Junior'}
          badge
          badgeColor={lc.bg}
        />
        <StatCard
          label="Primary Domain"
          value={ai_insights?.primary_domain || 'General'}
        />
      </div>

      {/* Summary Section */}
      {summary && (
        <div className="rounded-2xl p-6"
          style={{
            background: 'rgba(255, 255, 255, 0.015)',
            border: '1px solid rgba(109, 40, 217, 0.18)',
            backdropFilter: 'blur(20px)'
          }}>
          <h3 style={{ fontSize: 12, fontWeight: 800, color: '#64748b',
            textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
            Professional Summary
          </h3>
          <p style={{ fontSize: 14.5, color: '#cbd5e1', lineHeight: 1.75 }}>
            {summary}
          </p>
        </div>
      )}

      {/* Recommendation Banner */}
      {ai_insights?.hiring_recommendation && (
        <RecommendationBanner
          recommendation={ai_insights.hiring_recommendation}
          summary={ai_insights.summary_for_hr}
        />
      )}

    </div>
  )
}