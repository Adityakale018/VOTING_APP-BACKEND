import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiCheckCircle, FiAward, FiUsers, FiBarChart2 } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { candidateService } from '../services/candidateService'
import { authService } from '../services/authService'
import { useAuth } from '../hooks/useAuth'
import { getInitials, getErrorMessage } from '../utils/helpers'
import { SkeletonCard } from '../components/common/LoadingSpinner'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const [candidatesData, profileData] = await Promise.all([
          candidateService.getCandidates(),
          authService.getProfile(),
        ])
        setCandidates(Array.isArray(candidatesData) ? candidatesData : candidatesData.candidates || [])
        setProfile(profileData)
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const hasVoted = profile?.isvoted === true

  const filtered = candidates.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.party?.toLowerCase().includes(search.toLowerCase())
  )

  const partyColors = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-amber-600',
    'from-pink-500 to-rose-600',
  ]

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Welcome back,{' '}
                <span className="gradient-text">{profile?.name || user?.name || 'Voter'}</span>
              </h1>
              <p className="text-white/50 mt-2">
                {hasVoted
                  ? 'You have already cast your vote. Thank you for participating!'
                  : 'Choose your candidate and make your vote count.'}
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-4">
              <div className="glass px-5 py-3 text-center">
                <div className="text-2xl font-bold gradient-text">{candidates.length}</div>
                <div className="text-white/50 text-xs">Candidates</div>
              </div>
              <div className={`glass px-5 py-3 text-center ${hasVoted ? 'border-green-500/30' : ''}`}>
                <div className={`text-2xl font-bold ${hasVoted ? 'text-green-400' : 'text-yellow-400'}`}>
                  {hasVoted ? '✓' : '○'}
                </div>
                <div className="text-white/50 text-xs">{hasVoted ? 'Voted' : 'Not Voted'}</div>
              </div>
            </div>
          </div>

          {/* Voted Banner */}
          {hasVoted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400"
            >
              <FiCheckCircle size={20} />
              <span className="font-medium">Your vote has been recorded successfully. Democracy thanks you!</span>
            </motion.div>
          )}
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mb-8 max-w-md"
        >
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates or parties..."
            className="input-field pl-12"
          />
        </motion.div>

        {/* Candidates Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/40">
            <FiUsers size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-xl">No candidates found</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
              hidden: {},
            }}
          >
            {filtered.map((candidate, index) => (
              <motion.div
                key={candidate._id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass p-6 flex flex-col gap-4"
              >
                {/* Avatar */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${partyColors[index % partyColors.length]} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                  {getInitials(candidate.name)}
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-lg font-bold text-white">{candidate.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <FiAward className="text-violet-400" size={14} />
                    <span className="text-white/60 text-sm">{candidate.party}</span>
                  </div>
                </div>

                {/* Vote count */}
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <FiBarChart2 size={14} />
                  <span>{candidate.voteCount || 0} votes</span>
                </div>

                {/* Vote Button */}
                <button
                  onClick={() => !hasVoted && navigate('/vote')}
                  disabled={hasVoted}
                  className={`mt-auto w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    hasVoted
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20 cursor-not-allowed'
                      : 'btn-primary cursor-pointer'
                  }`}
                >
                  {hasVoted ? (
                    <span className="flex items-center justify-center gap-2">
                      <FiCheckCircle size={16} />
                      Already Voted
                    </span>
                  ) : (
                    'Vote Now'
                  )}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
