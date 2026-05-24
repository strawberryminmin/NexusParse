import { useState } from 'react'

export default function JDMatcherTab({ data }) {
  const [jd, setJd] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [convertedText, setConvertedText] = useState(null)

  const handleMatch = () => {
    if (!jd.trim()) return
    setLoading(true)
    setTimeout(() => {
      const jdWords = jd.toLowerCase().split(/[\s,.\-();/]+/)
      const resumeSkills = [
        ...data.skills.technical,
        ...data.skills.tools,
        ...data.skills.soft
      ].map(s => s.toLowerCase())

      // Find matches & missing
      const matched = resumeSkills.filter(s => jdWords.includes(s) || jd.toLowerCase().includes(s))
      // Extract key tech terms from JD that candidate lacks
      const keyJDTechs = [
        'react','angular','vue','node','python','java','c++','golang','aws','docker','kubernetes',
        'terraform','ci/cd','sql','nosql','graphql','typescript','django','flask',
        'pandas','numpy','tensorflow','pytorch','scikit-learn','machine learning','deep learning'
      ]
      const missing = keyJDTechs.filter(tech => jd.toLowerCase().includes(tech) && !resumeSkills.includes(tech))

      // Match Score calculation
      let score = 30 // baseline
      if (matched.length) score += Math.min(50, matched.length * 8)
      if (data.current_title && jd.toLowerCase().includes(data.current_title.toLowerCase())) score += 15
      if (missing.length) score -= Math.min(20, missing.length * 4)
      score = Math.max(10, Math.min(99, score))

      // Recommendations
      const recommendations = [
        'Add matching experience descriptions focusing on deliverables and metrics.',
        `Highlight your skills in: ${matched.slice(0, 5).join(', ')}.`,
      ]
      if (missing.length) {
        recommendations.push(`Consider learning or adding relevant project work in: ${missing.slice(0, 3).join(', ')} to boost alignment.`)
      }

      setResults({
        score,
        matched: Array.from(new Set(matched)),
        missing: Array.from(new Set(missing)),
        recommendations
      })
      setConvertedText(null)
      setLoading(false)
    }, 1200)
  }

  const handleConvert = () => {
    if (!results) return
    setLoading(true)
    setTimeout(() => {
      const cleanJdTitle = jd.match(/(?:title|role|position|looking for)[:\s]*([^\n,]+)/i)?.[1] || data.current_title || 'Software Engineer'
      
      const optimizedSummary = `Results-driven ${data.ai_insights?.candidate_level || 'Junior'} Professional specializing in ${data.ai_insights?.primary_domain || 'General Software Engineering'}, equipped with a strong background in ${[...results.matched, ...data.skills.technical.slice(0, 3)].slice(0, 5).join(', ')}. Proven track record of building performant, reliable architectures and seeking to leverage technical expertise to deliver immediate impact in a ${cleanJdTitle.trim()} role.`

      const optimizedBullets = [
        `Spearheaded development of scalable software applications, leveraging ${[...results.matched, 'modern paradigms'].slice(0, 3).join(', ')} to improve operational efficiency by 25%.`,
        `Collaborated with cross-functional teams to design, test, and deploy production-ready systems aligning closely with client specifications.`,
        `Optimized performance bottlenecks and enhanced test coverage, securing an overall system reliability rating of 99.8%.`
      ]

      setConvertedText({
        title: cleanJdTitle.trim(),
        summary: optimizedSummary,
        bullets: optimizedBullets,
        injectedSkills: results.missing.slice(0, 4)
      })
      setLoading(false)
    }, 1500)
  }

  const downloadPdf = () => {
    if (!convertedText) return

    const name = data.candidate?.name || 'Candidate Name'
    const email = data.candidate?.email || ''
    const phone = data.candidate?.phone || ''
    const location = data.candidate?.location || ''
    const linkedin = data.candidate?.linkedin || ''
    const github = data.candidate?.github || ''
    const website = data.candidate?.website || ''

    // Collect tailored technical skills
    const updatedTechnicalSkills = Array.from(new Set([
      ...results.matched,
      ...convertedText.injectedSkills,
      ...data.skills.technical
    ]))
    const tools = data.skills.tools || []
    const soft = data.skills.soft || []
    const languages = data.skills.languages || []
    const achievements = data.achievements || []
    const hobbies = data.hobbies || []

    // Build experiences html (keep all original bullets as requested)
    const experiencesHtml = (data.experience || []).map((exp) => {
      const title = exp.title || 'Professional Role'
      const company = exp.company || 'Organization'
      const dateRange = [exp.start_date, exp.end_date].filter(Boolean).join(' — ')
      const loc = exp.location || ''
      const bulletsHtml = (exp.bullets || []).map(b => `<li>${b}</li>`).join('')

      return `
        <div class="entry">
          <div class="entry-header">
            <span class="entry-title">${title}</span>
            <span class="entry-date">${dateRange}</span>
          </div>
          <div class="entry-sub">
            <span class="entry-company">${company}</span>
            ${loc ? `<span class="entry-loc">${loc}</span>` : ''}
          </div>
          <ul class="bullets">${bulletsHtml}</ul>
        </div>
      `
    }).join('')

    // Build education html
    const educationHtml = (data.education || []).map(edu => {
      const inst = edu.institution || 'Institution'
      const deg = edu.degree || ''
      const field = edu.field || ''
      const yr = edu.year || ''
      const gpa = edu.gpa || ''
      const honors = edu.honors || ''

      return `
        <div class="entry">
          <div class="entry-header">
            <span class="entry-title">${inst}</span>
            <span class="entry-date">${yr}</span>
          </div>
          <div class="entry-sub">
            <span class="entry-company">${[deg, field].filter(Boolean).join(', ')}</span>
            ${gpa ? `<span class="entry-loc">GPA: ${gpa}</span>` : ''}
          </div>
          ${honors ? `<div style="font-size: 12px; margin-top: 3px; color: #475569;">Honors: ${honors}</div>` : ''}
        </div>
      `
    }).join('')

    // Build projects html
    const projectsHtml = (data.projects || []).map(proj => {
      const name = proj.name || 'Project Name'
      const desc = proj.description || ''
      const techList = proj.tech ? proj.tech.join(', ') : ''
      const link = proj.link ? `<a href="${proj.link}" target="_blank" style="text-decoration:none; color:#0d9488;">Link ↗</a>` : ''
      const impact = proj.impact ? `<div style="font-size: 12px; color:#0d9488; margin-top: 3px; font-weight: 500;">Impact: ${proj.impact}</div>` : ''

      return `
        <div class="entry">
          <div class="entry-header">
            <span class="entry-title">${name} ${link}</span>
          </div>
          <p style="margin: 4px 0 3px 0; font-size: 13px; color:#334155; line-height: 1.6;">${desc}</p>
          ${techList ? `<div style="font-size: 12px; color:#7c3aed; font-weight: 600;">Tech: ${techList}</div>` : ''}
          ${impact}
        </div>
      `
    }).join('')

    // Build certifications html
    const certificationsHtml = (data.certifications || []).map(cert => {
      return `<li><strong>${cert.name}</strong> ${cert.issuer ? `(${cert.issuer})` : ''} ${cert.year ? `— ${cert.year}` : ''}</li>`
    }).join('')

    // Build achievements html
    const achievementsHtml = achievements.map(ach => {
      return `<li>${ach}</li>`
    }).join('')

    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>${name.replace(/\s+/g, '_')}_Optimized_Resume</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: 'Inter', sans-serif;
              color: #1e293b;
              background: #ffffff;
              line-height: 1.6;
              padding: 50px;
              font-size: 13.5px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #94a3b8;
              padding-bottom: 15px;
              margin-bottom: 24px;
            }
            .name {
              font-size: 28px;
              font-weight: 800;
              color: #0f172a;
              letter-spacing: -0.025em;
              margin-bottom: 6px;
            }
            .contact-info {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 14px;
              font-size: 12px;
              color: #475569;
            }
            .contact-info a {
              color: #475569;
              text-decoration: none;
            }
            .contact-info a:hover {
              text-decoration: underline;
            }
            .section {
              margin-bottom: 24px;
            }
            .section-title {
              font-size: 14px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #0f172a;
              border-bottom: 1.5px solid #475569;
              padding-bottom: 4px;
              margin-bottom: 12px;
            }
            .summary {
              font-size: 13px;
              color: #334155;
              line-height: 1.6;
            }
            .entry {
              margin-bottom: 14px;
            }
            .entry-header {
              display: flex;
              justify-content: space-between;
              font-weight: 600;
              font-size: 13.5px;
              color: #0f172a;
            }
            .entry-title {
              font-weight: 750;
            }
            .entry-date {
              font-size: 12.5px;
              color: #64748b;
              font-weight: 500;
            }
            .entry-sub {
              display: flex;
              justify-content: space-between;
              font-size: 12.5px;
              color: #475569;
              margin-top: 2px;
            }
            .entry-company {
              font-weight: 600;
              color: #0d9488;
            }
            .entry-loc {
              font-style: italic;
            }
            .bullets {
              margin-top: 6px;
              padding-left: 18px;
              list-style-type: square;
              color: #334155;
              font-size: 13px;
            }
            .bullets li {
              margin-bottom: 4px;
              line-height: 1.6;
            }
            .skills-grid {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }
            .skills-row {
              display: flex;
              gap: 8px;
              font-size: 13px;
            }
            .skills-label {
              font-weight: 700;
              color: #0f172a;
              width: 140px;
              flex-shrink: 0;
            }
            .skills-val {
              color: #334155;
            }
            @media print {
              body {
                padding: 0;
              }
              @page {
                margin: 1.5cm;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="name">${name}</h1>
            <div class="contact-info">
              ${phone ? `<span>${phone}</span>` : ''}
              ${email ? `<span>|</span> <a href="mailto:${email}">${email}</a>` : ''}
              ${location ? `<span>|</span> <span>${location}</span>` : ''}
              ${linkedin ? `<span>|</span> <a href="${linkedin}" target="_blank">LinkedIn</a>` : ''}
              ${github ? `<span>|</span> <a href="${github}" target="_blank">GitHub</a>` : ''}
              ${website ? `<span>|</span> <a href="${website}" target="_blank">Portfolio</a>` : ''}
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">Professional Summary</h2>
            <p class="summary">${convertedText.summary}</p>
          </div>

          ${experiencesHtml ? `
          <div class="section">
            <h2 class="section-title">Professional Experience</h2>
            ${experiencesHtml}
          </div>
          ` : ''}

          ${projectsHtml ? `
          <div class="section">
            <h2 class="section-title">Projects</h2>
            ${projectsHtml}
          </div>
          ` : ''}

          <div class="section">
            <h2 class="section-title">Core Skills</h2>
            <div class="skills-grid">
              ${updatedTechnicalSkills.length ? `
                <div class="skills-row">
                  <span class="skills-label">Technical Skills:</span>
                  <span class="skills-val">${updatedTechnicalSkills.join(', ')}</span>
                </div>
              ` : ''}
              ${tools.length ? `
                <div class="skills-row">
                  <span class="skills-label">Tools & Platforms:</span>
                  <span class="skills-val">${tools.join(', ')}</span>
                </div>
              ` : ''}
              ${soft.length ? `
                <div class="skills-row">
                  <span class="skills-label">Soft Skills:</span>
                  <span class="skills-val">${soft.join(', ')}</span>
                </div>
              ` : ''}
              ${languages.length ? `
                <div class="skills-row">
                  <span class="skills-label">Languages:</span>
                  <span class="skills-val">${languages.join(', ')}</span>
                </div>
              ` : ''}
            </div>
          </div>

          ${educationHtml ? `
          <div class="section">
            <h2 class="section-title">Education</h2>
            ${educationHtml}
          </div>
          ` : ''}

          ${achievementsHtml ? `
          <div class="section">
            <h2 class="section-title">Achievements & Awards</h2>
            <ul style="padding-left: 18px; line-height: 1.6; color:#334155; font-size: 13px; list-style-type: square;">
              ${achievementsHtml}
            </ul>
          </div>
          ` : ''}

          ${certificationsHtml ? `
          <div class="section">
            <h2 class="section-title">Certifications</h2>
            <ul style="padding-left: 18px; line-height: 1.6; color:#334155; font-size: 13px; list-style-type: square;">
              ${certificationsHtml}
            </ul>
          </div>
          ` : ''}

          ${hobbies.length ? `
          <div class="section">
            <h2 class="section-title">Hobbies & Interests</h2>
            <p style="font-size: 13px; color:#334155;">${hobbies.join(', ')}</p>
          </div>
          ` : ''}
          
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="md:grid-cols-hero">
        
        {/* Left: Input Job Description */}
        <div className="rounded-2xl p-6"
          style={{
            background: 'rgba(255, 255, 255, 0.015)',
            border: '1px solid rgba(109, 40, 217, 0.18)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em', marginBottom: '4px' }}>
              Target Job Description
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b' }}>
              Paste the target job description details below to analyze compatibility and optimize matching score.
            </p>
          </div>
          
          <textarea
            className="paste-textarea"
            placeholder="Paste target job description here..."
            value={jd}
            onChange={e => setJd(e.target.value)}
            rows={10}
            style={{
              flexGrow: 1,
              background: 'rgba(2, 4, 16, 0.6)',
              border: '1px solid rgba(109, 40, 217, 0.25)',
              color: '#e2e8f0'
            }}
          />

          <button
            onClick={handleMatch}
            disabled={loading || !jd.trim()}
            className="parse-btn"
            style={{ marginTop: 0 }}
          >
            {loading ? <span className="spinner" /> : 'Compare Alignment'}
          </button>
        </div>

        {/* Right: Comparative Analysis */}
        <div className="rounded-2xl p-6 flex flex-col gap-5 justify-between"
          style={{
            background: 'rgba(255, 255, 255, 0.015)',
            border: '1px solid rgba(109, 40, 217, 0.18)',
            backdropFilter: 'blur(20px)'
          }}>
          {!results ? (
            <div className="flex flex-col items-center justify-center text-center h-full py-20" style={{ color: '#334155' }}>
              <span style={{ fontSize: '3.5rem', marginBottom: '12px' }}>✦</span>
              <p style={{ fontSize: '14px', fontWeight: 600 }}>Awaiting Job Description comparison</p>
              <p style={{ fontSize: '11px', maxWidth: '280px', marginTop: '4px' }}>Input target JD details on the left and start analysis to generate alignment scores.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5 h-full justify-between">
              
              {/* Top: Circle Progress & Matched/Missing details */}
              <div className="flex flex-col gap-4">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ position: 'relative', width: 90, height: 90 }}>
                    <svg width="90" height="90" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="45" cy="45" r="38" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                      <circle cx="45" cy="45" r="38" fill="transparent"
                        stroke={results.score >= 80 ? '#10b981' : results.score >= 60 ? '#22d3ee' : '#f59e0b'}
                        strokeWidth="6"
                        strokeDasharray={2 * Math.PI * 38}
                        strokeDashoffset={2 * Math.PI * 38 * (1 - results.score / 100)}
                        strokeLinecap="round"
                        style={{ filter: `drop-shadow(0 0 6px ${results.score >= 80 ? '#10b981' : '#22d3ee'})` }}
                      />
                    </svg>
                    <div style={{
                      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', fontFamily: "'Orbitron', sans-serif" }}>
                        {results.score}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 900, color: '#ffffff' }}>JD Match Readiness</h4>
                    <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                      {results.score >= 80 ? 'Excellent Match! Ready for submission.' : results.score >= 55 ? 'Moderate Match. Some adjustments recommended.' : 'Low alignment. Optimize resume structure.'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <span style={{ fontSize: '11px', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
                      Matched Skills ({results.matched.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {results.matched.length ? results.matched.map(s => (
                        <span key={s} className="badge" style={{ background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.25)', color: '#34d399' }}>
                          {s}
                        </span>
                      )) : <span style={{ fontSize: '12px', color: '#334155' }}>None detected</span>}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
                      Missing / Recommended Skills ({results.missing.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {results.missing.length ? results.missing.map(s => (
                        <span key={s} className="badge" style={{ background: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.25)', color: '#facc15' }}>
                          {s}
                        </span>
                      )) : <span style={{ fontSize: '12px', color: '#335055' }}>No major skill gaps identified</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom: Convert Trigger */}
              <button
                onClick={handleConvert}
                disabled={loading}
                className="parse-btn"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
                  boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)'
                }}
              >
                Convert & Optimize Resume
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Conversion Output Panel */}
      {convertedText && (
        <div className="rounded-2xl p-6 animate-fadeIn"
          style={{
            background: 'rgba(255, 255, 255, 0.015)',
            border: '1px solid rgba(109, 40, 217, 0.25)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em' }}>
                Optimized Resume Content (Tailored to Job Profile)
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                Suggested changes to merge into your resume for maximum ATS scoring against the target job.
              </p>
            </div>
            
            <button
              onClick={downloadPdf}
              className="btn-nav"
              style={{
                background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
                boxShadow: '0 4px 14px rgba(6, 182, 212, 0.2)'
              }}
            >
              Download Optimized Resume (.pdf)
            </button>
          </div>

          <div className="flex flex-col gap-4" style={{ background: 'rgba(2, 4, 16, 0.5)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#22d3ee', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Target Role Title</span>
              <p style={{ fontSize: '15px', color: '#ffffff', fontWeight: 700, marginTop: '2px' }}>{convertedText.title}</p>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: '#22d3ee', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tailored Summary</span>
              <p style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: 1.7, marginTop: '4px' }}>{convertedText.summary}</p>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: '#22d3ee', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Suggested Experience Bullet points</span>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px', paddingLeft: '16px', listStyleType: 'square', fontSize: '13.5px', color: '#cbd5e1', lineHeight: 1.6 }}>
                {convertedText.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>

            {convertedText.injectedSkills.length > 0 && (
              <div>
                <span style={{ fontSize: '11px', color: '#22d3ee', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Keywords to Inject</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {convertedText.injectedSkills.map(s => (
                    <span key={s} className="badge" style={{ background: 'rgba(109, 40, 217, 0.08)', borderColor: 'rgba(109, 40, 217, 0.35)', color: '#c4b5fd' }}>
                      + {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
