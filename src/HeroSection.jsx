import { useState, useEffect } from 'react'
import { IconUpload, IconLock } from './Icons'

export default function HeroSection({ onGetStarted }) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState([])

  useEffect(() => {
    setIsAnimating(true)

    // Generate floating particles
    const newParticles = Array.from({ length: 20 }).map(() => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 5
    }))
    setParticles(newParticles)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#0a0e27' }}>
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{
            background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
            left: `${-150 + mousePos.x * 0.05}px`,
            top: `${-150 + mousePos.y * 0.05}px`,
            transition: 'all 0.5s ease-out'
          }}
        />
        <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }}
        />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
        />
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-blue-400 opacity-30"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `float ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl">

          {/* Main content */}
          <div className={`text-center space-y-10 transition-all duration-1200 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

            {/* Icon - Interactive */}
            <div className="flex justify-center">
              <div className="relative group cursor-pointer">
                {/* Glow ring effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-pulse" />

                {/* Main icon */}
                <div className="relative w-40 h-40 rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 flex items-center justify-center shadow-2xl border border-white/10 group-hover:border-white/20 transition-all duration-500 group-hover:scale-110"
                  style={{
                    boxShadow: '0 25px 50px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                  }}>
                  <span className="text-7xl group-hover:scale-125 transition-transform duration-500">📊</span>
                </div>
              </div>
            </div>

            {/* Main heading - Animated gradient */}
            <div className="space-y-6" style={{ transitionDelay: '100ms' }}>
              <h1 className="text-7xl md:text-8xl font-black tracking-tight leading-tight" style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #22d3ee 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientShift 4s ease infinite'
              }}>
                Resume Parser
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-light">
                Lightning-fast AI-powered analysis. Extract, analyze, and understand resumes instantly.
              </p>
            </div>

            {/* CTA Button - Premium animated */}
            <div className="pt-4" style={{ transitionDelay: '200ms' }}>
              <button
                onClick={onGetStarted}
                className="group relative inline-flex items-center justify-center gap-3 px-12 py-6 text-xl font-bold text-white rounded-2xl overflow-hidden transition-all duration-500 hover:scale-110 active:scale-95 hover:-translate-y-2"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  boxShadow: '0 25px 50px rgba(59, 130, 246, 0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                  background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)'
                }} />
                <span className="relative flex items-center gap-3">
                  <IconUpload style={{ width: '24px', height: '24px' }} />
                  Start Parsing
                </span>
                <span className="text-2xl relative group-hover:translate-x-1 transition-transform duration-300">→</span>
              </button>
            </div>

            {/* Stats with animation */}
            <div className="grid grid-cols-3 gap-8 pt-16" style={{ transitionDelay: '300ms' }}>
              {[
                { number: '100%', label: 'Offline', icon: '⚡' },
                { number: 'AI', label: 'Powered', icon: '🤖' },
                { number: '🔒', label: 'Private', icon: '' }
              ].map((stat, i) => (
                <div
                  key={i}
                  className="group cursor-default transition-all duration-500 hover:scale-110"
                  style={{
                    transitionDelay: `${400 + i * 100}ms`
                  }}
                >
                  <div className="p-6 rounded-2xl backdrop-blur-xl border border-white/10 bg-white/5 group-hover:bg-white/10 group-hover:border-blue-400/30 transition-all duration-500">
                    <div className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm md:text-base text-gray-400 group-hover:text-gray-200 transition-colors duration-300">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature highlight card */}
            <div className={`mt-16 p-8 rounded-3xl backdrop-blur-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-500 group cursor-default hover:scale-105 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{
              transitionDelay: '600ms',
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1)'
            }}>
              <div className="flex items-center justify-center gap-4 text-gray-300 group-hover:text-gray-100 transition-colors duration-300">
                <IconLock style={{ width: '20px', height: '20px', color: '#22d3ee' }} />
                <span className="text-base md:text-lg font-medium">Your data stays private • No uploads • No tracking</span>
              </div>
            </div>

            {/* Scroll hint */}
            <div className={`mt-16 flex flex-col items-center gap-4 transition-all duration-1000 ${isAnimating ? 'opacity-100' : 'opacity-0'}`} style={{
              transitionDelay: '800ms'
            }}>
              <p className="text-sm text-gray-500 font-medium">Scroll down to upload</p>
              <div className="animate-bounce">
                <svg className="w-6 h-6 text-blue-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(10px); }
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  )
}
