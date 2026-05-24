import { useState, useEffect, useRef } from 'react'
import { readFileAsText } from './pdfReader'
import { parseResume } from './parser'
import OverviewTab from './tabs/OverviewTab'
import ExperienceTab from './tabs/ExperienceTab'
import SkillsTab from './tabs/SkillsTab'
import EducationTab from './tabs/EducationTab'
import InsightsTab from './tabs/InsightsTab'
import RawJsonTab from './tabs/RawJsonTab'
import JDMatcherTab from './tabs/JDMatcherTab'

const TABS = [
  { id: 'overview',   label: 'Overview',    icon: '◈' },
  { id: 'experience', label: 'Experience',  icon: '◉' },
  { id: 'skills',     label: 'Skills',      icon: '◆' },
  { id: 'education',  label: 'Education',   icon: '◇' },
  { id: 'jdmatch',    label: 'JD Matcher',  icon: '⚡' },
  { id: 'insights',   label: 'AI Insights', icon: '✦' },
  { id: 'rawjson',    label: 'Raw JSON',    icon: '⟨⟩' },
]

const FEATURES = [
  { icon: '◈', title: 'Student Resume Boost',   desc: 'Structured recommendations for internships and first jobs', color: '#7c3aed' },
  { icon: '◉', title: 'AI Skill Extraction',    desc: 'Auto-detect technical, soft and industry-specific skills', color: '#6d28d9' },
  { icon: '◆', title: 'Job Description Match',  desc: 'See how well your resume fits any real job posting',       color: '#0891b2' },
  { icon: '◇', title: 'ATS Optimizer',          desc: 'Format checks to pass automated resume screening systems', color: '#22d3ee' },
  { icon: '✦', title: 'Actionable Feedback',    desc: 'Improve language, bullet points and impact statements',    color: '#8b5cf6' },
  { icon: '⬡', title: 'Career Ready Summary',   desc: 'Concise summary for applications and interviews',          color: '#06b6d4' },
]

// ── Aurora Background ────────────────────────────────────────────────────────
function AuroraBackground() {
  return (
    <div className="aurora-bg">
      <div className="aurora-band aurora-1" />
      <div className="aurora-band aurora-2" />
      <div className="aurora-band aurora-3" />
      <div className="aurora-grid" />
      <div className="aurora-scan" />
    </div>
  )
}

// ── Particle Canvas ──────────────────────────────────────────────────────────
function ParticleCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')
    let raf
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight }
    resize(); window.addEventListener('resize', resize)
    const cols = ['#7c3aed','#6d28d9','#0891b2','#22d3ee','#8b5cf6']
    const pts = Array.from({ length: 70 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
      r: Math.random() * 1.8 + .4, col: cols[Math.floor(Math.random() * cols.length)],
      op: Math.random() * .45 + .12,
    }))
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height)
      pts.forEach((p, i) => {
        pts.slice(i + 1).forEach(q => {
          const dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx*dx+dy*dy)
          if (d < 120) { ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.strokeStyle=`rgba(109,40,217,${.1*(1-d/120)})`; ctx.lineWidth=.4; ctx.stroke() }
        })
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        ctx.fillStyle = p.col + Math.floor(p.op*255).toString(16).padStart(2,'0'); ctx.fill()
        p.x+=p.vx; p.y+=p.vy
        if(p.x<0||p.x>c.width) p.vx*=-1
        if(p.y<0||p.y>c.height) p.vy*=-1
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }} />
}

// ── Scroll Reveal ────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if(e.isIntersecting) setVis(true) }, { threshold:.1 })
    if(ref.current) o.observe(ref.current)
    return () => o.disconnect()
  }, [])
  return [ref, vis]
}
function Reveal({ children, delay=0, dir='up' }) {
  const [ref, vis] = useReveal()
  const map = { up:'translateY(32px)', down:'translateY(-32px)', left:'translateX(-32px)', right:'translateX(32px)' }
  return (
    <div ref={ref} style={{ opacity:vis?1:0, transform:vis?'none':map[dir]||map.up, transition:`opacity .65s ease ${delay}ms,transform .65s cubic-bezier(.16,1,.3,1) ${delay}ms` }}>
      {children}
    </div>
  )
}

// ── Typing Hook ──────────────────────────────────────────────────────────────
function useTyping(words, spd=88, pause=2200) {
  const [txt, setTxt] = useState('')
  const [wi, setWi]   = useState(0)
  const [del, setDel] = useState(false)
  useEffect(() => {
    const cur = words[wi]
    const t = setTimeout(() => {
      if (!del) {
        setTxt(cur.slice(0, txt.length+1))
        if(txt.length+1===cur.length) setTimeout(()=>setDel(true), pause)
      } else {
        setTxt(cur.slice(0, txt.length-1))
        if(txt.length-1===0) { setDel(false); setWi((wi+1)%words.length) }
      }
    }, del ? spd/2 : spd)
    return () => clearTimeout(t)
  }, [txt, del, wi, words, spd, pause])
  return txt
}

// ── Animated Counter ─────────────────────────────────────────────────────────
function Counter({ target, suffix='', dur=1800 }) {
  const [n, setN] = useState(0)
  const [ref, vis] = useReveal()
  useEffect(() => {
    if(!vis) return
    const t0 = Date.now()
    const id = setInterval(() => {
      const p = Math.min((Date.now()-t0)/dur, 1)
      setN(Math.floor((1-Math.pow(1-p,3))*target))
      if(p>=1) clearInterval(id)
    }, 16)
    return () => clearInterval(id)
  }, [vis, target, dur])
  return <span ref={ref}>{n}{suffix}</span>
}

// ── Brand Name ───────────────────────────────────────────────────────────────
function BrandName({ size = '1.05rem' }) {
  return (
    <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:size, fontWeight:900, letterSpacing:'-.01em', lineHeight:1 }}>
      <span className="brand-nexus">Nexus</span><span className="brand-parse">Parse</span>
    </span>
  )
}

// ── Logo SVG ─────────────────────────────────────────────────────────────────
function AppLogo({ size = 44 }) {
  return (
    <img src="/logo.png" alt="NexusParse logo" className="app-logo" style={{ width:size, height:size }} />
  )
}

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [file, setFile]           = useState(null)
  const [pasteMode, setPasteMode] = useState(false)
  const [pasteText, setPasteText] = useState('')
  const [dragging, setDragging]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [result, setResult]       = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [error, setError]         = useState('')
  const [mousePos, setMousePos]   = useState({ x: 0, y: 0 })
  const fileInputRef = useRef()
  const typed = useTyping(['Resumes', 'Profiles', 'CVs', 'Documents'], 85, 2200)

  useEffect(() => {
    const h = e => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', h)
    return () => window.removeEventListener('mousemove', h)
  }, [])

  const handleFile = f => {
    if (!f) return
    if (!f.name.endsWith('.pdf') && !f.name.endsWith('.txt'))
      return setError('Only PDF and TXT files are supported.')
    setError(''); setFile(f); setResult(null)
  }
  const handleDrop = e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }
  const handleParse = async () => {
    setError(''); setLoading(true)
    try {
      const text = pasteMode ? pasteText : await readFileAsText(file)
      if (!text || text.trim().length < 20) throw new Error('Could not extract enough text. Try a different file.')
      setResult(parseResume(text)); setActiveTab('overview')
    } catch (err) {
      setError(err.message || 'Something went wrong.'); setResult(null)
    } finally { setLoading(false) }
  }
  const handleReset = () => {
    setFile(null); setPasteText(''); setResult(null); setError(''); setLoading(false); setActiveTab('overview')
  }
  const canParse = pasteMode ? pasteText.trim().length > 50 : !!file

  // ── HOME VIEW ─────────────────────────────────────────────────────────────
  if (!result) return (
    <div style={{ background:'#020410', minHeight:'100vh', color:'#e2e8f0', overflowX:'hidden' }}>
      <AuroraBackground />
      <ParticleCanvas />

      {/* Mouse-parallax orbs */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
        <div style={{ position:'absolute', width:'500px', height:'500px', borderRadius:'50%', filter:'blur(90px)', background:'radial-gradient(circle,rgba(109,40,217,.18),transparent 70%)', left:`${mousePos.x*.016-250}px`, top:`${mousePos.y*.016-250}px`, transition:'left 1.4s ease-out, top 1.4s ease-out' }} />
        <div style={{ position:'absolute', width:'400px', height:'400px', borderRadius:'50%', filter:'blur(80px)', background:'radial-gradient(circle,rgba(34,211,238,.1),transparent 70%)', right:`${-mousePos.x*.01+100}px`, bottom:`${-mousePos.y*.01+200}px`, transition:'right 1.8s ease-out, bottom 1.8s ease-out' }} />
      </div>

      {/* ── NAV ── */}
      <nav className="nav-glass" style={{ position:'sticky', top:0, zIndex:100 }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <AppLogo size={44} />
            <div>
              <BrandName size="1.1rem" />
              <div style={{ fontSize:'10px', color:'#334155', letterSpacing:'.18em', textTransform:'uppercase', marginTop:'2px' }}>AI Resume Intelligence</div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <span className="status-pill">
              <span className="status-dot" />
              Local Engine Active
            </span>
            <button onClick={() => fileInputRef.current.click()} className="btn-nav">Upload Resume</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position:'relative', zIndex:1, minHeight:'100vh', display:'flex', alignItems:'center' }}>
        <div className="max-w-7xl mx-auto px-6 py-24 w-full">
          <div style={{ display:'grid', gridTemplateColumns:'1.3fr 0.7fr', gap:'64px', alignItems:'center' }}>

            {/* Left */}
            <div style={{ display:'flex', flexDirection:'column', gap:'28px' }}>
              <Reveal>
                <div className="badge-hero">
                  <span className="badge-dot" />
                  AI-Powered Analysis &bull; 100% Private &bull; Offline First
                </div>
              </Reveal>

              <Reveal delay={100}>
                <h1 className="hero-heading">
                  Parse Your<br />
                  <span className="gradient-text">{typed}<span className="typing-cursor">|</span></span>
                  <br />Instantly
                </h1>
              </Reveal>

              <Reveal delay={200}>
                <p className="hero-sub">
                  Drop your resume and get AI-powered insights in seconds. Extract skills, experience,
                  education, and hiring scores — all offline, all private, zero server needed.
                </p>
              </Reveal>

              <Reveal delay={300}>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'14px' }}>
                  <button onClick={() => fileInputRef.current.click()} className="btn-primary-hero">
                    Upload Resume
                  </button>
                  <button onClick={() => setPasteMode(m => !m)} className="btn-secondary-hero">
                    Paste Text
                  </button>
                </div>
              </Reveal>

              <Reveal delay={400}>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'32px', paddingTop:'8px' }}>
                  {[
                    { val:100, suf:'%',      label:'Offline' },
                    { val:0,   suf:' uploads',label:'to server' },
                    { val:6,   suf:' tabs',   label:'of insights' },
                  ].map((s,i) => (
                    <div key={i} className="stat-mini">
                      <div className="stat-mini-val"><Counter target={s.val} suffix={s.suf} /></div>
                      <div className="stat-mini-label">{s.label}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Upload Card */}
            <Reveal delay={180} dir="right">
              <div className="upload-card">
                <div className="upload-card-header">
                  <span style={{ fontWeight:700 }}>Drop Resume Here</span>
                  <span className="pill-sm">PDF · TXT</span>
                </div>

                {pasteMode ? (
                  <div className="paste-container">
                    <textarea
                      className="paste-textarea"
                      placeholder="Paste your resume text here..."
                      value={pasteText}
                      onChange={e => setPasteText(e.target.value)}
                      rows={8}
                    />
                  </div>
                ) : (
                  <div
                    className={`drop-zone ${dragging ? 'drop-zone-active' : ''}`}
                    onClick={() => fileInputRef.current.click()}
                    onDragOver={e => { e.preventDefault(); setDragging(true) }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                  >
                    <div className="drop-icon">{dragging ? '↓' : '⬡'}</div>
                    <div className="drop-text">Drop your file here</div>
                    <div className="drop-sub">Click or drag to upload PDF or TXT</div>
                  </div>
                )}

                {file && !pasteMode && (
                  <div className="file-pill">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
                    <div>
                      <div style={{ fontWeight:700, fontSize:'.88rem' }}>{file.name}</div>
                      <div style={{ fontSize:'.74rem', color:'#334155' }}>{(file.size/1024).toFixed(1)} KB ready</div>
                    </div>
                  </div>
                )}

                {canParse && (
                  <button onClick={handleParse} disabled={loading} className={`parse-btn ${loading?'parse-btn-loading':''}`}>
                    {loading ? <><span className="spinner" /> Analyzing…</> : 'Start Parsing'}
                  </button>
                )}
                {error && <div className="error-box">{error}</div>}

                <div className="tech-pills">
                  {['React 18','Vite 5','PDF.js','Local AI','TailwindCSS'].map(t => (
                    <span key={t} className="tech-pill">{t}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section-features" style={{ position:'relative', zIndex:1 }}>
        <div className="max-w-7xl mx-auto px-6 py-24">
          <Reveal>
            <div className="section-header">
              <div className="section-badge">Capabilities</div>
              <h2 className="section-title">Everything You Need</h2>
              <p className="section-sub">Six powerful tools to analyze, parse and understand any resume instantly.</p>
            </div>
          </Reveal>
          <div className="features-grid">
            {FEATURES.map((f,i) => (
              <Reveal key={i} delay={i*80} dir={i%2===0?'left':'right'}>
                <div className="feature-card" style={{ '--accent': f.color }}>
                  <div className="feature-icon-wrap">
                    <span className="feature-icon">{f.icon}</span>
                  </div>
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-desc">{f.desc}</p>
                  <div className="feature-line" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ position:'relative', zIndex:1 }}>
        <div className="max-w-7xl mx-auto px-6 py-24">
          <Reveal>
            <div className="section-header">
              <div className="section-badge">Process</div>
              <h2 className="section-title">How It Works</h2>
              <p className="section-sub">Four steps from upload to full AI-powered insights.</p>
            </div>
          </Reveal>
          <div className="steps-grid">
            {[
              { num:'01', icon:'↑', title:'Upload Resume',  desc:'Drop a PDF or paste text directly into the app' },
              { num:'02', icon:'◉', title:'AI Analysis',    desc:'Advanced local regex and pattern matching runs instantly' },
              { num:'03', icon:'◆', title:'Extract Data',   desc:'Skills, experience, education and certs pulled out' },
              { num:'04', icon:'▣', title:'Get Insights',   desc:'Detailed analytics, hire scores and AI recommendations' },
            ].map((s,i) => (
              <Reveal key={i} delay={i*120}>
                <div className="step-card">
                  <div className="step-num">{s.num}</div>
                  <div className="step-icon-wrap"><span style={{ fontSize:'1.3rem' }}>{s.icon}</span></div>
                  <h3 className="step-title">{s.title}</h3>
                  <p className="step-desc">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIVACY ── */}
      <section style={{ position:'relative', zIndex:1 }}>
        <div className="max-w-7xl mx-auto px-6 py-20">
          <Reveal>
            <div className="privacy-banner">
              <div className="privacy-icon-wrap">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#lg1)" strokeWidth="2">
                  <defs><linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div style={{ flex:1 }}>
                <h2 style={{ fontSize:'2rem', fontWeight:900, marginBottom:'10px' }}>100% Private & Offline</h2>
                <p style={{ color:'#334155', lineHeight:1.8, fontSize:'.95rem' }}>
                  Your resume never leaves your browser. No server uploads, no tracking, no data collection.
                  All processing happens locally using JavaScript — completely in your control.
                </p>
              </div>
              <button onClick={() => fileInputRef.current.click()} className="btn-primary-hero" style={{ flexShrink:0 }}>
                Try It Now
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer-section" style={{ position:'relative', zIndex:1 }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:'20px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <AppLogo size={38} />
              <div>
                <BrandName size=".95rem" />
                <div className="footer-brand-sub" style={{ marginTop:'3px' }}>Built with React · Vite · PDF.js</div>
              </div>
            </div>
            <div className="copyright-glow">
              © 2026 All Rights Reserved · Made by Jasmine Tripathy · 100% Local
            </div>
            <div className="tech-pills">
              {['React','Vite','TailwindCSS','PDF.js'].map(t => <span key={t} className="tech-pill">{t}</span>)}
            </div>
          </div>
        </div>
      </footer>

      <input ref={fileInputRef} type="file" accept=".pdf,.txt" className="hidden" onChange={e => handleFile(e.target.files[0])} />
    </div>
  )

  // ── RESULTS VIEW ──────────────────────────────────────────────────────────
  return (
    <div style={{ background:'#020410', minHeight:'100vh', color:'#e2e8f0' }}>
      <AuroraBackground />
      <ParticleCanvas />

      <div className="results-header" style={{ position:'sticky', top:0, zIndex:100 }}>
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <AppLogo size={38} />
            <div>
              <BrandName size="1rem" />
              <div style={{ fontSize:'11px', color:'#22d3ee', opacity:.55, marginTop:'2px' }}>Analysis Results</div>
            </div>
          </div>
          <button onClick={handleReset} className="btn-back">← Back</button>
        </div>
      </div>

      <div className="tab-bar" style={{ position:'sticky', top:'61px', zIndex:99 }}>
        <div className="max-w-7xl mx-auto px-8" style={{ display:'flex', gap:'4px', overflowX:'auto' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab-btn ${activeTab===tab.id?'tab-btn-active':''}`}>
              <span style={{ fontSize:'.85rem' }}>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8" style={{ position:'relative', zIndex:1 }}>
        <div className="tab-content-anim" key={activeTab}>
          {activeTab==='overview'   && <OverviewTab   data={result} />}
          {activeTab==='experience' && <ExperienceTab data={result} />}
          {activeTab==='skills'     && <SkillsTab     data={result} />}
          {activeTab==='education'  && <EducationTab  data={result} />}
          {activeTab==='jdmatch'    && <JDMatcherTab    data={result} />}
          {activeTab==='insights'   && <InsightsTab   data={result} />}
          {activeTab==='rawjson'    && <RawJsonTab    data={result} />}
        </div>
      </div>
    </div>
  )
}
