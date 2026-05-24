# 📄 AI Resume Parser

> Lightning-fast, **100% offline** AI-powered resume analysis built with React + Vite. Parse PDFs and text resumes instantly — no server, no uploads, complete privacy.

---

## 🚀 Quick Start

### One-Click Launch (Recommended)
1. Navigate to `c:\Users\jasmi\Desktop\pinnacle\ParserAG\`
2. **Double-click** `start-resume-parser.bat`
3. The app opens automatically at **http://localhost:3000**

### Manual Start (Terminal)
```bash
cd resume-parser
npm install        # first time only
npm run dev        # starts server + opens browser
```

### Run directly in VS Code (F5)
We have added a `.vscode` launch and task configuration:
1. Open the root `ParserAG` folder in VS Code.
2. Press `F5` (or go to **Run & Debug** in the sidebar and click **Launch NexusParse (Chrome)** or **Launch NexusParse (Edge)**).
3. VS Code will automatically start the Vite server and open the app in a new browser window.


---

## ✨ Features

| Feature | Description |
|---|---|
| 🎓 **Student Resume Boost** | Structured recommendations for internships and first jobs |
| 🧠 **AI Skill Extraction** | Auto-detect technical, soft, and industry-specific skills |
| 🔍 **Job Description Match** | See how well your resume fits any real job posting |
| 🗂️ **ATS Optimizer** | Format checks to pass automated resume screening systems |
| ✍️ **Actionable Feedback** | Improve language, bullet points and impact statements |
| 📌 **Career Ready Summary** | Concise summary for applications and interviews |
| 🔒 **100% Private** | All processing is local — your data never leaves your browser |
| ⚡ **Instant Results** | Parse resumes in milliseconds with no server round-trips |

---

## 📊 Analysis Tabs

The app provides **6 analysis tabs** after parsing a resume:

| Tab | What It Shows |
|---|---|
| 🏠 **Overview** | Candidate summary, contact info, hire score, quick stats |
| 💼 **Experience** | Work history timeline with roles, companies, and dates |
| ⚡ **Skills** | Categorized skills with proficiency bars (technical, soft, tools) |
| 🎓 **Education & Certs** | Degrees, institutions, graduation years, certifications |
| ⭐ **AI Insights** | Hire recommendation, strengths, weaknesses, improvement tips |
| `{}` **Raw JSON** | Full parsed data as structured JSON for developers |

---

## 🔧 Core Functions

### `parseResume(text)` — `src/parser.js`
The heart of the app. Takes raw resume text and extracts structured data using regex pattern matching.

- **`extractName(text)`** — Detects candidate name from the top of the resume
- **`extractEmail(text)`** — Regex email pattern extraction
- **`extractPhone(text)`** — International phone number detection
- **`extractLinkedIn(text)`** — LinkedIn URL extraction
- **`extractSkills(text)`** — Categorizes skills into technical/soft/tools buckets
- **`extractExperience(text)`** — Parses job titles, companies, dates, descriptions
- **`extractEducation(text)`** — Extracts degrees, institutions, graduation years
- **`extractCertifications(text)`** — Detects certification names and issuers
- **`calculateHireScore(data)`** — AI score (0–100) based on experience, skills, education
- **`generateInsights(data)`** — Produces strengths, weaknesses, and improvement tips

### `readFileAsText(file)` — `src/pdfReader.js`
Reads uploaded files and returns plain text.
- Handles **PDF** files via `pdfjs-dist` (renders all pages, extracts text content)
- Handles **TXT** files via `FileReader` API

### React Hooks & Components — `src/App.jsx`
- **`ParticleCanvas()`** — Animated HTML5 canvas with 80 connected floating particles
- **`useReveal()`** — `IntersectionObserver` hook for scroll-triggered animations
- **`Reveal({ children, delay, dir })`** — Wrapper component that animates children on scroll
- **`useTyping(words, speed, pause)`** — Typewriter animation cycling through words
- **`Counter({ target, suffix, dur })`** — Animated number counter that counts up on scroll
- **`handleFile(f)`** — Validates and sets the uploaded file
- **`handleDrop(e)`** — Drag-and-drop handler
- **`handleParse()`** — Orchestrates file reading → parsing → results display
- **`handleReset()`** — Clears all state and returns to home screen

### Tab Components — `src/tabs/`
- **`OverviewTab`** — Summary card, contact info, hire score ring, key stats
- **`ExperienceTab`** — Timeline view of work history entries
- **`SkillsTab`** — Skill badges grouped by category with progress bars
- **`EducationTab`** — Education cards + certification list
- **`InsightsTab`** — AI hire recommendation, score breakdown, tips
- **`RawJsonTab`** — Pretty-printed JSON of the full parsed result

### Icon Components — `src/Icons.jsx`
SVG icon set: `IconUpload`, `IconFile`, `IconClose`, `IconRefresh`, `IconLock`, `IconStar`

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.2.0 | UI framework, state management, hooks |
| **Vite** | 5.0.8 | Dev server, HMR, production bundler |
| **Tailwind CSS** | 3.4.1 | Utility-first styling framework |
| **PDF.js** (`pdfjs-dist`) | 3.11.174 | PDF text extraction in the browser |
| **PostCSS** | 8.4.33 | CSS processing pipeline |
| **Autoprefixer** | 10.4.17 | Cross-browser CSS vendor prefixes |
| **@vitejs/plugin-react** | 4.2.1 | React fast-refresh + JSX support |

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| Primary Blue | `#3b82f6` | Buttons, borders, progress bars |
| Accent Purple | `#8b5cf6` | Gradients, highlights |
| Cyan | `#22d3ee` | Status badges, typing cursor, glows |
| Background | `#050714` | Base dark background |
| Surface | `rgba(255,255,255,0.03)` | Cards, panels |
| Text Primary | `#e2e8f0` | Headings, body text |
| Text Muted | `#64748b` | Subtitles, descriptions |

### Key Animations
- **Particle Canvas** — 80 connected floating dots with connecting lines
- **Typing Effect** — Cycles: Resumes → Profiles → CVs → Documents
- **Scroll Reveal** — `IntersectionObserver` fade-up on enter viewport
- **Animated Counters** — Count-up numbers with easing on scroll
- **Floating Orbs** — Mouse-parallax gradient orbs in background
- **Shimmer Buttons** — Light sweep effect on hover
- **Glow Pulse** — Logo and status badge pulsing glow

---

## 📁 File Structure

```
ParserAG/
├── start-resume-parser.bat    # One-click launcher
├── README.md                  # This file
└── resume-parser/
    ├── index.html             # HTML entry point
    ├── vite.config.js         # Vite config (port 3000, auto-open)
    ├── package.json           # Dependencies
    ├── tailwind.config.js     # Tailwind config
    └── src/
        ├── main.jsx           # React entry point
        ├── App.jsx            # Main app component + all hooks
        ├── parser.js          # Resume parsing engine (regex/AI)
        ├── pdfReader.js       # PDF + TXT file reader
        ├── Icons.jsx          # SVG icon components
        ├── index.css          # Global styles + animations
        └── tabs/
            ├── OverviewTab.jsx
            ├── ExperienceTab.jsx
            ├── SkillsTab.jsx
            ├── EducationTab.jsx
            ├── InsightsTab.jsx
            └── RawJsonTab.jsx
```

---

## 🌐 App URL

```
http://localhost:3000
```

The port is pinned to **3000** in `vite.config.js` and Vite will auto-open your default browser on startup.

---

## 🔒 Privacy Guarantee

- ✅ **Zero network requests** for resume data
- ✅ **No analytics or tracking**
- ✅ **No cookies or localStorage** used for resume content
- ✅ **All parsing in-browser** via JavaScript
- ✅ **Works fully offline** after first install

---

*Built with ❤️ by Jasmine · 2026*
