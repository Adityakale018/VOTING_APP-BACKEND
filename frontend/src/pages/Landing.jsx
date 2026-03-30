import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShield, FiUsers, FiBarChart2, FiArrowRight, FiCheck } from 'react-icons/fi'
import { useAuth } from '../hooks/useAuth'

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: Math.random() * 6 + 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 6,
  duration: Math.random() * 4 + 4,
}))

const features = [
  {
    icon: <FiShield className="w-6 h-6" />,
    title: 'Secure Voting',
    description: 'Military-grade JWT authentication ensures your vote is safe and tamper-proof.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: <FiUsers className="w-6 h-6" />,
    title: 'Verified Identity',
    description: 'Aadhar-based identity verification prevents duplicate voting and fraud.',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: <FiBarChart2 className="w-6 h-6" />,
    title: 'Live Results',
    description: 'Watch real-time vote counts update as citizens cast their democratic voice.',
    color: 'from-emerald-500 to-teal-600',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Landing() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-900/10 rounded-full blur-3xl" />

        {/* Floating particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle bg-violet-400/20"
            style={{
              width: p.size + 'px',
              height: p.size + 'px',
              left: p.x + '%',
              top: p.y + '%',
              animationDelay: p.delay + 's',
              animationDuration: p.duration + 's',
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-16 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-medium mb-8">
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
            Secure. Transparent. Democratic.
          </motion.div>

          {/* Main Heading */}
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="text-white">Your Voice,</span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Your Power
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
            VoteX brings democracy to the digital age. Cast your vote securely, verify your identity,
            and watch real-time results — all from anywhere, anytime.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="btn-primary flex items-center justify-center gap-2 text-lg px-8 py-4"
              >
                Go to Dashboard
                <FiArrowRight />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn-primary flex items-center justify-center gap-2 text-lg px-8 py-4"
                >
                  Get Started Free
                  <FiArrowRight />
                </Link>
                <Link
                  to="/login"
                  className="btn-secondary flex items-center justify-center gap-2 text-lg px-8 py-4"
                >
                  Sign In
                </Link>
              </>
            )}
            <Link
              to="/results"
              className="flex items-center justify-center gap-2 text-lg px-8 py-4 rounded-xl text-white/70 hover:text-white border border-white/10 hover:border-white/30 transition-all duration-300"
            >
              <FiBarChart2 />
              View Live Results
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6 text-white/40 text-sm mb-20">
            {['One Person, One Vote', 'End-to-End Encrypted', 'Real-Time Results', 'Aadhar Verified'].map((badge) => (
              <div key={badge} className="flex items-center gap-2">
                <FiCheck className="text-violet-400" />
                {badge}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          className="relative z-10 w-full max-w-6xl mx-auto px-4 pb-20"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, staggerChildren: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Why Choose <span className="gradient-text">VoteX?</span>
          </h2>
          <p className="text-white/50 text-center mb-12 max-w-xl mx-auto">
            Built with modern technology to ensure every vote counts and every voice is heard.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="glass p-8 text-center group cursor-default"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
