import { motion } from 'framer-motion'

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className={`${sizes[size]} relative`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <div className={`${sizes[size]} rounded-full border-4 border-violet-500/20 border-t-violet-500 absolute inset-0`} />
        <div className={`${sizes[size]} rounded-full border-4 border-transparent border-r-blue-500/50 absolute inset-0`} style={{ animationDelay: '0.15s' }} />
      </motion.div>
      {text && <p className="text-white/60 text-sm animate-pulse">{text}</p>}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading VoteX..." />
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="glass p-6 space-y-4">
      <div className="skeleton h-12 w-12 rounded-full" />
      <div className="skeleton h-5 w-3/4 rounded-lg" />
      <div className="skeleton h-4 w-1/2 rounded-lg" />
      <div className="skeleton h-4 w-2/3 rounded-lg" />
      <div className="skeleton h-10 w-full rounded-xl" />
    </div>
  )
}
