const TECH_SKILLS = [
  'javascript','typescript','python','java','c\\+\\+','c#','ruby','go','golang','rust','swift','kotlin',
  'php','scala','perl','r','matlab','sql','nosql','html','css','sass','less',
  'react','angular','vue','svelte','next\\.?js','nuxt','gatsby','remix',
  'node\\.?js','express','fastify','django','flask','spring','rails','laravel',
  'asp\\.net','graphql','rest','api','microservices',
  'aws','azure','gcp','docker','kubernetes','terraform','ansible','jenkins','ci/cd',
  'mongodb','postgresql','mysql','redis','elasticsearch','dynamodb','firebase','supabase',
  'git','linux','bash','powershell','nginx','apache',
  'tensorflow','pytorch','keras','scikit-learn','scikit','pandas','numpy','opencv',
  'machine learning','deep learning','nlp','computer vision','data science',
  'blockchain','web3','solidity','ethereum',
  'figma','sketch','adobe','photoshop','illustrator',
  'unity','unreal','three\\.?js','webgl',
  'selenium','cypress','jest','mocha','pytest','junit',
  'agile','scrum','kanban','jira','confluence',
  'tableau','power bi','looker','d3\\.?js',
  'spark','hadoop','kafka','airflow','snowflake','databricks',
  'ios','android','react native','flutter','swiftui','objective-c',
  'tailwind','bootstrap','material.ui','chakra',
  'webpack','vite','rollup','babel','eslint',
  'oauth','jwt','saml','ssl','tls','encryption',
  'rabbitmq','celery','websocket','grpc','protobuf',
  'xgboost','lightgbm','transformers','bert','llm','reinforcement learning',
  'yolo','image processing','object detection','face recognition',
  'etl','data pipeline','data warehouse','data engineering',
]

const SOFT_SKILLS = [
  'leadership','communication','teamwork','problem solving','critical thinking',
  'time management','adaptability','creativity','collaboration','mentoring',
  'strategic planning','decision making','conflict resolution','negotiation',
  'presentation','public speaking','analytical','detail oriented','self motivated',
  'project management','stakeholder management','cross functional','team building',
]

const TOOLS = [
  'vs code','visual studio','intellij','eclipse','xcode','android studio',
  'postman','insomnia','swagger','github','gitlab','bitbucket',
  'slack','teams','zoom','notion','trello','asana','monday',
  'datadog','splunk','grafana','prometheus','new relic','sentry',
  'heroku','vercel','netlify','cloudflare','digitalocean',
  'stripe','twilio','sendgrid','auth0','okta',
  'salesforce','hubspot','zendesk','intercom',
  'figma','miro','lucidchart',
]

const LANGUAGES = [
  'english','spanish','french','german','chinese','mandarin','cantonese',
  'japanese','korean','hindi','arabic','portuguese','russian','italian',
  'dutch','swedish','turkish','polish','thai','vietnamese','indonesian',
  'tamil','telugu','bengali','urdu','persian','hebrew','odia','marathi',
]

const DEGREE_PATTERNS = [
  /\b(ph\.?d|doctorate|doctor of)\b/i,
  /\b(master'?s?|m\.?s\.?|m\.?a\.?|mba|m\.?tech|m\.?eng|m\.?sc)\b/i,
  /\b(bachelor'?s?|b\.?s\.?|b\.?a\.?|b\.?tech|b\.?eng|b\.?sc|b\.?com)\b/i,
  /\b(associate'?s?|a\.?s\.?|a\.?a\.?)\b/i,
  /\b(diploma|certificate|certification)\b/i,
]

const CERT_KEYWORDS = [
  'aws certified','azure certified','google certified','pmp','scrum master',
  'cissp','ceh','comptia','cisco','ccna','ccnp',
  'oracle certified','salesforce certified','hubspot certified',
  'google analytics','meta certified',
  'itil','prince2','six sigma','lean','togaf',
  'cfa','cpa','frm','certified','certification','license','licensed',
  'hackathon','view certificate','internal hackathon',
]

function extractEmail(text) {
  const m = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/)
  return m ? m[0] : ''
}

function extractPhone(text) {
  const m = text.match(/(?:\+?\d{1,3}[\s\-.]?)?\(?\d{2,4}\)?[\s\-.]?\d{3,4}[\s\-.]?\d{3,4}/)
  return m ? m[0].trim() : ''
}

function extractLinkedIn(text) {
  const m = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_]+\/?/i)
  return m ? (m[0].startsWith('http') ? m[0] : 'https://' + m[0]) : ''
}

function extractGitHub(text) {
  const m = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9\-_]+\/?/i)
  return m ? (m[0].startsWith('http') ? m[0] : 'https://' + m[0]) : ''
}

function extractWebsite(text) {
  const urls = text.match(/https?:\/\/[^\s,;)]+/gi) || []
  return urls.find(u => !u.includes('linkedin.com') && !u.includes('github.com')) || ''
}

function extractName(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  for (const line of lines.slice(0, 5)) {
    const clean = line.replace(/[^a-zA-Z\s.\-']/g, '').trim()
    if (clean.length >= 3 && clean.length <= 50 && /^[A-Z]/.test(clean)) {
      const words = clean.split(/\s+/)
      if (words.length >= 2 && words.length <= 4 && words.every(w => /^[A-Z][a-z]/.test(w) || w.length <= 3)) {
        return clean
      }
    }
  }
  const first = lines[0]?.replace(/[^a-zA-Z\s.\-']/g, '').trim()
  if (first && first.length > 2 && first.length < 60) return first
  return 'Unknown Candidate'
}

function extractLocation(text) {
  const patterns = [
    /(?:location|address|based in|located in)[:\s]*([^\n,]{3,40})/i,
    /([A-Z][a-z]+(?:\s[A-Z][a-z]+)?,\s*(?:AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|UK|US|USA|Canada|India|Australia|Germany|France)(?:\s+\d{5})?)\b/
  ]
  for (const p of patterns) {
    const m = text.match(p)
    if (m && !/(?:stack|frameworks?|skills?|technologies?|tools?)/i.test(m[0])) return m[1].trim()
  }
  return ''
}

function matchKeywords(text, keywords) {
  const lower = text.toLowerCase()
  const found = []
  for (const kw of keywords) {
    const regex = new RegExp('\\b' + kw + '\\b', 'i')
    if (regex.test(lower) && !found.some(f => f.toLowerCase() === kw.toLowerCase())) {
      const m = text.match(new RegExp('\\b' + kw + '\\b', 'i'))
      found.push(m ? m[0] : kw)
    }
  }
  return found
}

function extractSections(text) {
  const sectionHeaders = /^(?:#{1,3}\s*)?(?:\*{0,2})(experience|work\s*(?:experience|history)|employment|professional\s*experience|education|academic|skills|technical\s*skills|certifications?|certificates?|projects?|achievements?|awards?|summary|profile|objective|about\s*me|publications?|volunteer|languages?)/im
  const lines = text.split('\n')
  const sections = {}
  let currentSection = 'header'
  let sectionLines = []
  for (const line of lines) {
    const m = line.trim().match(sectionHeaders)
    if (m) {
      if (sectionLines.length) sections[currentSection] = sectionLines.join('\n')
      currentSection = m[1].toLowerCase().replace(/\s+/g, '_')
      sectionLines = []
    } else {
      sectionLines.push(line)
    }
  }
  if (sectionLines.length) sections[currentSection] = sectionLines.join('\n')
  return sections
}

function extractExperience(text) {
  const sections = extractSections(text)
  const expText = sections['experience'] || sections['work_experience'] ||
    sections['work_history'] || sections['employment'] ||
    sections['professional_experience'] || ''
  if (!expText.trim()) return []
  const entries = []
  const blocks = expText.split(/\n(?=(?:[A-Z][^\n]*(?:company|inc|corp|ltd|llc|technologies|solutions|group|systems|labs?|\d{4}\s*[-–]\s*(?:\d{4}|present|current))))/i)
  for (const block of blocks) {
    if (block.trim().length < 10) continue
    const lines = block.split('\n').filter(l => l.trim())
    if (!lines.length) continue
    const company = lines[0]?.replace(/[\*#]/g, '').trim() || ''
    const titleLine = lines[1]?.replace(/[\*#]/g, '').trim() || ''
    const dateMatch = block.match(/(\w+\.?\s*\d{4}|\d{4})\s*[-–]\s*(\w+\.?\s*\d{4}|\d{4}|present|current)/i)
    const locMatch = block.match(/(?:location:?\s*)([^\n]+)/i)
    const bullets = lines.slice(2).map(l => l.replace(/^[\s•\-\*▸►◆○●]+/, '').trim()).filter(l => l.length > 10)
    const techs = matchKeywords(block, TECH_SKILLS)
    if (company) {
      entries.push({
        company, title: titleLine || '',
        employment_type: block.match(/\b(full.time|part.time|contract|freelance|intern(?:ship)?|remote|hybrid)\b/i)?.[1] || '',
        start_date: dateMatch?.[1] || '', end_date: dateMatch?.[2] || '',
        duration: '', location: locMatch?.[1]?.trim() || '',
        bullets, technologies_used: techs.slice(0, 10),
      })
    }
  }
  return entries
}

function extractAcademicYear(line) {
  const rangeMatch = line.match(/\b(19|20)\d{2}\s*[-–]\s*((?:19|20)?\d{2}|present|current)\b/i)
  if (rangeMatch) {
    let end = rangeMatch[2]
    if (end.length === 2 && /^\d+$/.test(end)) {
      end = '20' + end
    }
    return end
  }
  const years = line.match(/\b(19|20)\d{2}\b/g)
  if (years && years.length > 0) {
    return years[years.length - 1]
  }
  return ''
}

function extractEducation(text) {
  const sections = extractSections(text)
  const eduText = sections['education'] || sections['academic'] || ''
  const searchSpace = eduText.trim() ? eduText : text
  const lines = searchSpace.split('\n').map(l => l.trim()).filter(Boolean)
  const entries = []
  let current = null

  for (const line of lines) {
    const isInstitution = /university|college|institute|school|academy/i.test(line)
    const academicYear = extractAcademicYear(line)

    if (isInstitution) {
      if (current && current.institution && !line.toLowerCase().includes(current.institution.toLowerCase())) {
        entries.push(current)
      }
      current = { institution: line.replace(/[\*#•\-]/g, '').trim(), year: academicYear || '' }
    } else if (current && academicYear && !current.year) {
      current.year = academicYear
    }
  }
  if (current && current.institution) {
    entries.push(current)
  }
  return entries
}

function extractCertifications(text) {
  const sections = extractSections(text)
  const certText = sections['certifications'] || sections['certificates'] || sections['certification'] || ''
  const certs = []
  const allText = certText || text
  const lines = allText.split('\n')
  for (const line of lines) {
    const lower = line.toLowerCase()
    if (CERT_KEYWORDS.some(kw => lower.includes(kw)) && line.trim().length > 5) {
      const yearMatch = line.match(/\b(19|20)\d{2}\b/)
      const clean = line.replace(/[\*#•\-]/g, '').trim()
      if (clean.length > 3 && clean.length < 150) {
        certs.push({ name: clean.replace(/\b(19|20)\d{2}\b/, '').trim(), issuer: '', year: yearMatch?.[0] || '' })
      }
    }
  }
  return certs.slice(0, 15)
}

function extractSummary(text) {
  const sections = extractSections(text)
  const sumText = sections['summary'] || sections['profile'] || sections['objective'] || sections['about_me'] || ''
  if (sumText.trim()) return sumText.split('\n').filter(l => l.trim()).slice(0, 4).join(' ').trim().slice(0, 500)
  const lines = text.split('\n')
  for (let i = 1; i < Math.min(lines.length, 15); i++) {
    if (lines[i].trim().length > 80) return lines[i].trim().slice(0, 500)
  }
  return ''
}

function extractTitle(text, experience) {
  if (experience.length > 0 && experience[0].title) return experience[0].title
  const m = text.match(/\b(?:title|role|position)\b[:\s]*([^\n]+)/i)
  return m ? m[1].trim() : ''
}

function estimateYears(experience) {
  if (!experience.length) return 0
  let total = 0
  for (const exp of experience) {
    const sy = exp.start_date?.match(/(19|20)\d{2}/)?.[0]
    let ey = exp.end_date?.match(/(19|20)\d{2}/)?.[0]
    if (exp.end_date?.match(/present|current/i)) ey = new Date().getFullYear().toString()
    if (sy && ey) total += Math.max(0, parseInt(ey) - parseInt(sy))
    else total += 1
  }
  return Math.min(total, 40)
}

// ── Smart Domain Detection ───────────────────────────────────────────────────
function detectDomain(data) {
  const corpus = [
    data.summary || '',
    data.current_title || '',
    ...data.skills.technical,
    ...data.skills.tools,
    ...(data.experience?.flatMap(e => [e.title, ...(e.bullets || [])]) || []),
  ].join(' ').toLowerCase()

  const score = (keywords, pts = 3) => keywords.reduce((s, k) => s + (corpus.includes(k) ? pts : 0), 0)

  const domains = {
    'AI & Machine Learning':       score(['machine learning','deep learning','neural network','tensorflow','pytorch','keras','scikit','xgboost','lightgbm','bert','llm','transformers','reinforcement learning','model training','artificial intelligence'], 4)
                                 + score(['python','ai','algorithm'], 1),
    'Computer Vision':             score(['computer vision','opencv','image processing','object detection','yolo','cnn','face recognition','image classification','segmentation','visual recognition'], 5),
    'Natural Language Processing': score(['nlp','natural language processing','text classification','sentiment analysis','named entity','tokenization','word2vec','bert','text mining','language model'], 5),
    'Machine Learning & Data Sci': score(['data science','pandas','numpy','matplotlib','seaborn','jupyter','statistics','regression','classification','clustering','eda','data analysis','feature engineering','data visualization'], 4),
    'Data Engineering':            score(['spark','hadoop','kafka','airflow','etl','data pipeline','databricks','snowflake','data warehouse','data engineer','hive','flink'], 5),
    'Full Stack Development':      score(['react','angular','vue','node','express','django','flask','html','css','api','backend','frontend','mongodb','postgresql','mysql'], 2),
    'Frontend Development':        score(['react','angular','vue','svelte','html','css','sass','tailwind','bootstrap','typescript','next.js','gatsby','ui','ux','responsive'], 3),
    'Backend Development':         score(['node','express','django','flask','spring','rails','laravel','api','rest','graphql','microservices','postgresql','mysql','redis','server'], 3),
    'DevOps & Cloud Engineering':  score(['docker','kubernetes','aws','azure','gcp','terraform','ansible','ci/cd','jenkins','devops','cloud','infrastructure','linux','nginx','helm'], 4),
    'Mobile Development':          score(['ios','android','react native','flutter','swift','kotlin','mobile','swiftui','objective-c'], 4),
    'UI/UX Design':                score(['figma','sketch','adobe xd','photoshop','illustrator','ui/ux','user experience','user interface','prototyping','wireframe','design system','usability'], 4),
    'Cybersecurity':               score(['cybersecurity','penetration testing','ethical hacking','cissp','ceh','vulnerability','siem','firewall','encryption','security audit','nmap','metasploit'], 5),
    'Blockchain & Web3':           score(['blockchain','web3','solidity','ethereum','smart contract','defi','nft','crypto','hardhat','truffle'], 5),
    'Game Development':            score(['unity','unreal','game','three.js','webgl','godot','opengl','physics engine','shader'], 5),
    'Data Science & Analytics':    score(['tableau','power bi','looker','d3','analytics','dashboard','reporting','excel','business intelligence','kpi','metrics'], 3),
  }

  const sorted = Object.entries(domains).sort((a, b) => b[1] - a[1])
  const [top1, top2] = sorted

  if (!top1 || top1[1] === 0) return 'General Software Engineering'

  // Compound domain logic
  const t1 = top1[0], t2 = top2?.[0], s1 = top1[1], s2 = top2?.[1] || 0

  if (t1 === 'AI & Machine Learning' && t2 === 'Computer Vision' && s2 >= 10) return 'AI & Computer Vision'
  if (t1 === 'Computer Vision' && t2 === 'AI & Machine Learning' && s2 >= 8) return 'AI & Computer Vision'
  if ((t1 === 'AI & Machine Learning' || t2 === 'AI & Machine Learning') &&
      (t1 === 'Natural Language Processing' || t2 === 'Natural Language Processing') && Math.min(s1,s2) >= 6) return 'AI & NLP Engineering'
  if ((t1 === 'AI & Machine Learning' || t2 === 'Machine Learning & Data Sci') && Math.min(s1,s2) >= 8) return 'Machine Learning & Data Science'
  if ((t1 === 'Frontend Development' && t2 === 'Backend Development' && s2 >= 8) ||
      (t1 === 'Backend Development' && t2 === 'Frontend Development' && s2 >= 8)) return 'Full Stack Development'

  return t1
}

// ── ATS Score ────────────────────────────────────────────────────────────────
function calculateATSScore(text, data) {
  let score = 0
  const textLower = text.toLowerCase()

  // Contact completeness (20 pts)
  if (data.candidate.email)    score += 5
  if (data.candidate.phone)    score += 5
  if (data.candidate.location) score += 4
  if (data.candidate.linkedin || data.candidate.github) score += 6

  // Summary/profile (10 pts)
  if (data.summary && data.summary.length > 50)  score += 10

  // Skills richness (20 pts)
  const totalSkills = data.skills.technical.length + data.skills.tools.length
  if (totalSkills >= 3)  score += 5
  if (totalSkills >= 8)  score += 5
  if (totalSkills >= 15) score += 5
  if (data.skills.soft.length >= 2) score += 5

  // Work experience (20 pts)
  if (data.experience.length > 0) score += 8
  if (data.experience.length >= 2) score += 7
  const hasBullets = data.experience.some(e => e.bullets?.length >= 2)
  if (hasBullets) score += 5

  // Education & certs (15 pts)
  if (data.education.length > 0)       score += 8
  if (data.certifications.length > 0)  score += 4
  if (data.certifications.length >= 3) score += 3

  // Section headers found (10 pts)
  const sections = ['experience','education','skills','summary','certification','project']
  score += Math.min(10, sections.filter(s => textLower.includes(s)).length * 2)

  // Formatting signals (5 pts)
  const hasBulletPoints = /[•\-\*▸►◆●]/.test(text)
  if (hasBulletPoints) score += 3
  if (text.length > 300) score += 2

  return Math.min(100, score)
}

function generateInsights(data, rawText = '') {
  const techCount = data.skills.technical.length
  const toolCount = data.skills.tools.length
  const softCount = data.skills.soft.length
  const expCount  = data.experience.length
  const eduCount  = data.education.length
  const certCount = data.certifications.length
  const years     = data.total_experience_years

  let level = 'Junior'
  if (years >= 12) level = 'Executive'
  else if (years >= 8) level = 'Lead'
  else if (years >= 5) level = 'Senior'
  else if (years >= 2) level = 'Mid'

  const expScore     = Math.min(100, Math.round((years * 8) + (expCount * 5)))
  const skillsScore  = Math.min(100, Math.round((techCount * 4) + (toolCount * 3) + (softCount * 3)))
  const eduScore     = Math.min(100, Math.round((eduCount * 25) + (certCount * 15)))
  const achieveScore = Math.min(100, Math.round((certCount * 10) + (data.achievements?.length || 0) * 15 + (data.projects?.length || 0) * 10))
  const overall      = Math.round((expScore * 0.35) + (skillsScore * 0.30) + (eduScore * 0.20) + (achieveScore * 0.15))
  const atsScore     = calculateATSScore(rawText, data)
  const domain       = detectDomain(data)

  const strengths = []
  if (techCount > 5)  strengths.push(`Strong technical foundation with ${techCount} technical skills`)
  if (years >= 5)     strengths.push(`${years}+ years of professional experience`)
  if (certCount > 0)  strengths.push(`Holds ${certCount} professional certification(s)`)
  if (softCount > 2)  strengths.push('Good soft skills and collaboration abilities')
  if (expCount > 3)   strengths.push('Diverse work experience across multiple roles')
  if (eduCount > 0)   strengths.push('Solid educational background')

  const flags = []
  if (years === 0 && expCount === 0) flags.push('No clear work experience listed')
  if (techCount === 0) flags.push('No technical skills identified')
  if (eduCount === 0)  flags.push('No formal education listed')

  let recommendation = 'Maybe'
  if (overall >= 80) recommendation = 'Strong Yes'
  else if (overall >= 65) recommendation = 'Yes'
  else if (overall < 40) recommendation = 'No'

  const summaryParts = [`This candidate is a ${level}-level professional`]
  if (domain !== 'General Software Engineering') summaryParts.push(`specializing in ${domain}`)
  summaryParts.push(`with ${years} year${years !== 1 ? 's' : ''} of experience.`)
  if (strengths.length) summaryParts.push(`Key strengths include: ${strengths.slice(0, 2).join(', ').toLowerCase()}.`)
  if (flags.length)     summaryParts.push(`Areas to note: ${flags.join(', ').toLowerCase()}.`)

  return {
    candidate_level: level,
    primary_domain: domain,
    top_strengths: strengths,
    potential_red_flags: flags,
    culture_fit_signals: data.skills.soft.map(s => `Shows ${s.toLowerCase()} capabilities`),
    recommended_roles: [data.current_title, ...(domain !== 'General Software Engineering' ? [domain + ' Engineer', domain + ' Specialist'] : [])].filter(Boolean).slice(0, 5),
    overall_score: overall,
    ats_score: atsScore,
    score_breakdown: { experience: expScore, skills: skillsScore, education: eduScore, achievements: achieveScore },
    hiring_recommendation: recommendation,
    summary_for_hr: summaryParts.join(' '),
  }
}

function extractProjects(text) {
  const sections = extractSections(text)
  const projText = sections['projects'] || sections['academic projects'] || sections['personal projects'] || ''
  if (!projText.trim()) return []

  const lines = projText.split('\n').map(l => l.trim()).filter(Boolean)
  const projects = []
  let current = null

  for (const line of lines) {
    const isBullet = /^[•\-\*▸►◆○●]/.test(line)
    const isHeading = !isBullet && (line.length < 60 && !line.endsWith('.') && /^[A-Z][a-zA-Z0-9\s\-\:\(\)]+$/.test(line) && line.split(' ').length <= 7)

    if (isHeading) {
      if (current) projects.push(current)
      current = {
        name: line.replace(/^[•\-\*\s]+/, '').trim(),
        description: '',
        tech: [],
        link: '',
        impact: ''
      }
    } else if (current) {
      const linkMatch = line.match(/https?:\/\/[^\s]+/)
      if (linkMatch && !current.link) {
        current.link = linkMatch[0]
      }
      
      const techMatch = line.match(/(?:tech(?:nology)?|stack|built with|using)[:\s]*([^\n.]+)/i)
      if (techMatch) {
        current.tech = techMatch[1].split(/,|-|\//).map(t => t.trim()).filter(Boolean)
      }

      const cleanLine = line.replace(/^[•\-\*\s]+/, '').trim()
      if (cleanLine.length > 5) {
        if (current.description) {
          current.description += '\n' + cleanLine
        } else {
          current.description = cleanLine
        }
      }
    }
  }

  if (current) projects.push(current)

  if (projects.length === 0 && projText.trim()) {
    const blocks = projText.split(/\n\s*\n/)
    for (const block of blocks) {
      const trimmed = block.trim()
      if (trimmed) {
        const lines = trimmed.split('\n').map(l => l.trim())
        projects.push({
          name: lines[0] || 'Project Details',
          description: lines.slice(1).map(l => l.replace(/^[•\-\*\s]+/, '')).join('\n') || lines[0],
          tech: [],
          link: '',
          impact: ''
        })
      }
    }
  }

  return projects
}

function extractAchievements(text) {
  const sections = extractSections(text)
  const achText = sections['achievements'] || sections['awards'] || ''
  if (!achText.trim()) return []
  return achText.split('\n').map(l => l.replace(/[•\-\*\.]/g, '').trim()).filter(Boolean)
}

function extractHobbies(text) {
  const sections = extractSections(text)
  const hobbiesText = sections['hobbies'] || sections['interests'] || ''
  if (!hobbiesText.trim()) return []
  if (hobbiesText.includes(',')) {
    return hobbiesText.split(',').map(h => h.replace(/[•\-\*\.]/g, '').trim()).filter(Boolean)
  }
  return hobbiesText.split('\n').map(h => h.replace(/[•\-\*\.]/g, '').trim()).filter(Boolean)
}

export function parseResume(text) {
  const experience     = extractExperience(text)
  const education      = extractEducation(text)
  const certifications = extractCertifications(text)
  const technical      = matchKeywords(text, TECH_SKILLS)
  const soft           = matchKeywords(text, SOFT_SKILLS)
  const tools          = matchKeywords(text, TOOLS)
  const languages      = matchKeywords(text, LANGUAGES)
  const summary        = extractSummary(text)
  const currentTitle   = extractTitle(text, experience)
  const years          = estimateYears(experience)
  const projects       = extractProjects(text)
  const achievements   = extractAchievements(text)
  const hobbies        = extractHobbies(text)

  const data = {
    candidate: {
      name: extractName(text), email: extractEmail(text),
      phone: extractPhone(text), location: extractLocation(text),
      linkedin: extractLinkedIn(text), github: extractGitHub(text),
      website: extractWebsite(text), portfolio: '',
    },
    current_title: currentTitle, summary,
    total_experience_years: years,
    skills: { technical, soft, tools, languages },
    experience, education, certifications,
    projects, achievements, publications: [], volunteer: [],
    hobbies,
    raw_text: text,
  }
  data.ai_insights = generateInsights(data, text)
  return data
}