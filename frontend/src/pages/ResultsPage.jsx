import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FiAward, FiBarChart2, FiRefreshCw, FiUsers } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { candidateService } from '../services/candidateService'
import { getErrorMessage } from '../utils/helpers'
import LoadingSpinner from '../components/common/LoadingSpinner'

const POLL_INTERVAL = 10 // seconds

function CountUp({ target, duration = 2000 }) {
  const [count, setCount] = useState(0)
  const frameRef = useRef()
  const startRef = useRef()

  useEffect(() => {
    startRef.current = null
    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp
      const progress = Math.min((timestamp - startRef.current) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration])

  return <span>{count}</span>
}

export default function ResultsPage() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [countdown, setCountdown] = useState(POLL_INTERVAL)
  const pollRef = useRef(null)
  const countdownRef = useRef(null)

  const fetchResults = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const data = await candidateService.getVoteCount()
      const sorted = (Array.isArray(data) ? data : data.results || []).sort(
        (a, b) => (b.voteCount || 0) - (a.voteCount || 0)
      )
      setResults(sorted)
      setLastUpdated(new Date())
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  const resetCountdown = useCallback(() => {
    setCountdown(POLL_INTERVAL)
    clearInterval(countdownRef.current)
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : POLL_INTERVAL))
    }, 1000)
  }, [])

  // Auto-poll every POLL_INTERVAL seconds
  useEffect(() => {
    fetchResults()
    resetCountdown()

    pollRef.current = setInterval(() => {
      fetchResults()
      resetCountdown()
    }, POLL_INTERVAL * 1000)

    return () => {
      clearInterval(pollRef.current)
      clearInterval(countdownRef.current)
    }
  }, [fetchResults, resetCountdown])

  const handleManualRefresh = () => {
    fetchResults(true)
    resetCountdown()
  }

  const totalVotes = results.reduce((sum, r) => sum + (r.voteCount || 0), 0)
  const maxVotes = results[0]?.voteCount || 1

  const colors = [
    { bar: 'from-violet-500 to-purple-600', text: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/30' },
    { bar: 'from-blue-500 to-cyan-600', text: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
    { bar: 'from-emerald-500 to-teal-600', text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    { bar: 'from-orange-500 to-amber-600', text: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
    { bar: 'from-pink-500 to-rose-600', text: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/30' },
  ]

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-10 px-4 relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-medium mb-5">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live Vote Count
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Election <span className="gradient-text">Results</span>
          </h1>
          <p className="text-white/50">
            Real-time voting results updated as votes are cast.
          </p>

          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="glass px-6 py-3 text-center">
              <div className="text-2xl font-bold gradient-text">{totalVotes}</div>
              <div className="text-white/40 text-xs mt-1">Total Votes</div>
            </div>
            <div className="glass px-6 py-3 text-center">
              <div className="text-2xl font-bold text-white">{results.length}</div>
              <div className="text-white/40 text-xs mt-1">Parties</div>
            </div>
            <div className="glass px-6 py-3 text-center">
              <div className="text-2xl font-bold text-violet-400">{countdown}s</div>
              <div className="text-white/40 text-xs mt-1">Next update</div>
            </div>
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="glass px-6 py-3 text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-2 text-sm"
            >
              <FiRefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner text="Fetching live results..." />
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20 text-white/40">
            <FiBarChart2 size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-xl">No results available yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result, index) => {
              const color = colors[index % colors.length]
              const percentage = totalVotes > 0 ? Math.round((result.voteCount / totalVotes) * 100) : 0
              const isLeading = index === 0

              return (
                <motion.div
                  key={result.party || index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`glass p-6 ${isLeading ? `border-2 ${color.bg}` : ''}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {isLeading && (
                        <motion.div
                          initial={{ rotate: -10 }}
                          animate={{ rotate: 10 }}
                          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }}
                          className="text-yellow-400"
                        >
                          <FiAward size={22} />
                        </motion.div>
                      )}
                      <div>
                        <h3 className={`text-lg font-bold ${isLeading ? color.text : 'text-white'}`}>
                          {result.party}
                        </h3>
                        {result.name && (
                          <p className="text-white/50 text-sm">{result.name}</p>
                        )}
                        {isLeading && (
                          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/20">
                            Leading
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-white">
                        <CountUp target={result.voteCount || 0} />
                      </div>
                      <div className="text-white/40 text-sm">{percentage}%</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(result.voteCount / maxVotes) * 100}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut', delay: index * 0.1 }}
                      className={`h-full rounded-full bg-gradient-to-r ${color.bar}`}
                    />
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-white/30 text-xs">
                    <FiUsers size={12} />
                    {result.voteCount || 0} votes out of {totalVotes} total
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {lastUpdated && (
          <p className="text-center text-white/30 text-xs mt-8">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  )
}
