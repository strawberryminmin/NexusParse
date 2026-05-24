import { IconCheck, IconWarning } from '../Icons'

function ScoreRing({ score }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const color =
    score >= 80 ? '#10b981' :
    score >= 60 ? '#22d3ee' :
    '#ef4444'

  const bg = 'rgba(255, 255, 255, 0.015)'

  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl p-6"
      style={{
        background: bg,
        border: `1px solid rgba(109, 40, 217, 0.18)`,
        backdropFilter: 'blur(10px)',
        boxShadow: `0 0 20px ${color}10`
      }}>
      <div style={{ position: 'relative', width: 130, height: 130 }}>
        <svg width="130" height="130" viewBox="0 0 130 130">
          {/* Background ring */}
          <circle
            cx="65" cy="65" r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth="10"
          />
          {/* Score ring */}
          <circle
            cx="65" cy="65" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="score-ring"
            style={{
              transition: 'stroke-dashoffset 1s ease',
              filter: `drop-shadow(0 0 8px ${color})`
            }}
          />
        </svg>
        {/* Score Text */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 32, fontWeight: 900, color: '#ffffff', fontFamily: "'Orbitron', sans-serif" }}>{score}</span>
          <span style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Score</span>
        </div>
      </div>
      <p style={{ fontSize: 13, fontWeight: 800, color, marginTop: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Overall Score
      </p>
    </div>
  )
}

function ProgressBar({ label, value }) {
  const color =
    value >= 80 ? '#10b981' :
    value >= 60 ? '#22d3ee' :
    value >= 40 ? '#c084fc' :
    '#ef4444'

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 600 }}>
          {label}
        </span>
        <span style={{ fontSize: 13.5, color, fontWeight: 800, fontFamily: "'Orbitron', sans-serif" }}>
          {value}
        </span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${value}%`, background: `linear-gradient(90deg, #6d28d9, ${color})` }}
        />
      </div>
    </div>
  )
}

function StrengthItem({ text }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="flex items-center justify-center rounded-full border"
        style={{
          width: 22, height: 22,
          background: 'rgba(16, 185, 129, 0.06)',
          borderColor: 'rgba(16, 185, 129, 0.25)',
          color: '#34d399',
          flexShrink: 0,
          marginTop: 1,
        }}>
        <IconCheck />
      </div>
      <p style={{ fontSize: 13.5, color: '#cbd5e1', lineHeight: 1.6 }}>
        {text}
      </p>
    </div>
  )
}

function FlagItem({ text }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="flex items-center justify-center rounded-full border"
        style={{
          width: 22, height: 22,
          background: 'rgba(239, 68, 68, 0.06)',
          borderColor: 'rgba(239, 68, 68, 0.25)',
          color: '#fca5a5',
          flexShrink: 0,
          marginTop: 1,
        }}>
        <IconWarning />
      </div>
      <p style={{ fontSize: 13.5, color: '#cbd5e1', lineHeight: 1.6 }}>
        {text}
      </p>
    </div>
  )
}

export default function InsightsTab({ data }) {
  const insights = data?.ai_insights
  if (!insights) return null

  const {
    overall_score,
    score_breakdown,
    top_strengths,
    potential_red_flags,
    culture_fit_signals,
    recommended_roles,
    hiring_recommendation,
    summary_for_hr,
  } = insights

  const recConfig = {
    'Strong Yes': { bg: 'rgba(16, 185, 129, 0.06)', border: 'rgba(16, 185, 129, 0.3)', color: '#34d399' },
    'Yes':        { bg: 'rgba(6, 182, 212, 0.06)',  border: 'rgba(6, 182, 212, 0.3)',  color: '#22d3ee' },
    'Maybe':      { bg: 'rgba(245, 158, 11, 0.06)',  border: 'rgba(245, 158, 11, 0.3)',  color: '#facc15' },
    'No':         { bg: 'rgba(239, 68, 68, 0.06)',  border: 'rgba(239, 68, 68, 0.3)',  color: '#fca5a5' },
  }
  const rc = recConfig[hiring_recommendation] || recConfig['Maybe']

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">

      {/* Score + Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '0.7fr 1.3fr', gap: '24px' }} className="md:grid-cols-hero">

        {/* Score Ring */}
        <div style={{ minWidth: 200 }}>
          <ScoreRing score={overall_score || 0} />
        </div>

        {/* Breakdown */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(255, 255, 255, 0.015)',
            border: '1px solid rgba(109, 40, 217, 0.18)',
            backdropFilter: 'blur(10px)',
            minWidth: 220,
          }}>
          <h3 style={{
            fontSize: 12, fontWeight: 800, color: '#64748b',
            textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 18,
          }}>
            Score Breakdown
          </h3>
          <div className="flex flex-col gap-4.5">
            <ProgressBar label="Experience"   value={score_breakdown?.experience   || 0} />
            <ProgressBar label="Skills"       value={score_breakdown?.skills       || 0} />
            <ProgressBar label="Education"    value={score_breakdown?.education    || 0} />
            <ProgressBar label="Achievements" value={score_breakdown?.achievements || 0} />
          </div>
        </div>
      </div>

      {/* Strengths */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: 'rgba(255, 255, 255, 0.015)',
          border: '1px solid rgba(109, 40, 217, 0.18)',
          backdropFilter: 'blur(10px)'
        }}>
        <h3 style={{
          fontSize: 12, fontWeight: 800, color: '#64748b',
          textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16,
        }}>
          Top Strengths
        </h3>
        {top_strengths && top_strengths.length > 0 ? (
          <div className="flex flex-col gap-3.5">
            {top_strengths.map((s, i) => <StrengthItem key={i} text={s} />)}
          </div>
        ) : (
          <p style={{ fontSize: 13.5, color: '#64748b', fontStyle: 'italic' }}>
            No strengths identified
          </p>
        )}
      </div>

      {/* Red Flags */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: 'rgba(255, 255, 255, 0.015)',
          border: '1px solid rgba(109, 40, 217, 0.18)',
          backdropFilter: 'blur(10px)'
        }}>
        <h3 style={{
          fontSize: 12, fontWeight: 800, color: '#64748b',
          textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16,
        }}>
          Potential Red Flags
        </h3>
        {potential_red_flags && potential_red_flags.length > 0 ? (
          <div className="flex flex-col gap-3.5">
            {potential_red_flags.map((f, i) => <FlagItem key={i} text={f} />)}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-full border"
              style={{
                width: 22, height: 22,
                background: 'rgba(16, 185, 129, 0.06)',
                borderColor: 'rgba(16, 185, 129, 0.25)',
                color: '#34d399'
              }}>
              <IconCheck />
            </div>
            <p style={{ fontSize: 13.5, color: '#34d399', fontWeight: 600 }}>
              None identified
            </p>
          </div>
        )}
      </div>

      {/* Culture Fit */}
      {culture_fit_signals && culture_fit_signals.length > 0 && (
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(255, 255, 255, 0.015)',
            border: '1px solid rgba(109, 40, 217, 0.18)',
            backdropFilter: 'blur(10px)'
          }}>
          <h3 style={{
            fontSize: 12, fontWeight: 800, color: '#64748b',
            textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16,
          }}>
            Culture Fit Signals
          </h3>
          <div className="flex flex-col gap-2.5">
            {culture_fit_signals.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <span style={{ color: '#22d3ee', fontSize: 14 }}>◈</span>
                <p style={{ fontSize: 13.5, color: '#cbd5e1' }}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Roles */}
      {recommended_roles && recommended_roles.length > 0 && (
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(255, 255, 255, 0.015)',
            border: '1px solid rgba(109, 40, 217, 0.18)',
            backdropFilter: 'blur(10px)'
          }}>
          <h3 style={{
            fontSize: 12, fontWeight: 800, color: '#64748b',
            textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16,
          }}>
            Recommended Roles
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {recommended_roles.map((role, i) => (
              <span
                key={i}
                className="badge"
                style={{
                  padding: '6px 14px',
                  background: 'rgba(109, 40, 217, 0.08)',
                  borderColor: 'rgba(109, 40, 217, 0.25)',
                  color: '#c4b5fd',
                }}>
                {role}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* HR Summary */}
      {summary_for_hr && (
        <div
          className="rounded-2xl p-6"
          style={{
            background: rc.bg,
            border: `1px solid ${rc.border}`,
            backdropFilter: 'blur(10px)'
          }}>
          <h3 style={{
            fontSize: 12, fontWeight: 800,
            color: rc.color,
            textTransform: 'uppercase',
            letterSpacing: '0.12em', marginBottom: 12,
          }}>
            HR Summary — {hiring_recommendation}
          </h3>
          <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.75 }}>
            {summary_for_hr}
          </p>
        </div>
      )}

    </div>
  )
}