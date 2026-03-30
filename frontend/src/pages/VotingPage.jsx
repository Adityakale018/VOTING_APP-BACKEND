import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheckCircle, FiAlertTriangle, FiAward } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { candidateService } from '../services/candidateService'
import { authService } from '../services/authService'
import { getInitials, getErrorMessage } from '../utils/helpers'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function VotingPage() {
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const [candidatesData, profile] = await Promise.all([
          candidateService.getCandidates(),
          authService.getProfile(),
        ])
        if (profile?.isvoted) {
          toast.info('You have already cast your vote!')
          navigate('/results')
          return
        }
        setCandidates(Array.isArray(candidatesData) ? candidatesData : candidatesData.candidates || [])
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [navigate])

  const handleVote = async () => {
    if (!selected) return
    setSubmitting(true)
    try {
      await candidateService.voteForCandidate(selected._id)
      toast.success('🎉 Your vote has been cast successfully!')
      setShowModal(false)
      navigate('/results')
    } catch (error) {
      toast.error(getErrorMessage(error))
      setShowModal(false)
    } finally {
      setSubmitting(false)
    }
  }

  const partyColors = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-amber-600',
    'from-pink-500 to-rose-600',
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center pt-16">
        <LoadingSpinner size="lg" text="Loading candidates..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-10 px-4 relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-white mb-3">
            Cast Your <span className="gradient-text">Vote</span>
          </h1>
          <p className="text-white/50 max-w-xl mx-auto">
            Select your preferred candidate carefully. Your vote is final and cannot be changed.
          </p>
          {selected && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-violet-400 font-medium"
            >
              Selected: {selected.name} ({selected.party})
            </motion.p>
          )}
        </motion.div>

        {/* Candidates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {candidates.map((candidate, index) => {
            const isSelected = selected?._id === candidate._id
            return (
              <motion.div
                key={candidate._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelected(candidate)}
                className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 ${
                  isSelected
                    ? 'border-violet-500 bg-violet-500/10 shadow-xl shadow-violet-500/20'
                    : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                }`}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 text-violet-400"
                  >
                    <FiCheckCircle size={22} />
                  </motion.div>
                )}

                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${partyColors[index % partyColors.length]} flex items-center justify-center text-white font-bold text-xl flex-shrink-0`}
                  >
                    {getInitials(candidate.name)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{candidate.name}</h3>
                    <div className="flex items-center gap-2 text-white/60 text-sm mt-1">
                      <FiAward size={14} />
                      {candidate.party}
                    </div>
                  </div>
                </div>

                {/* Radio indicator */}
                <div className="mt-4 flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected ? 'border-violet-500 bg-violet-500' : 'border-white/30'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className="text-white/50 text-sm">
                    {isSelected ? 'Selected' : 'Click to select'}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Cast Vote Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <button
            onClick={() => selected && setShowModal(true)}
            disabled={!selected}
            className="btn-primary px-12 py-4 text-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Cast My Vote
          </button>
          {!selected && (
            <p className="text-white/40 text-sm mt-3">Please select a candidate to continue</p>
          )}
        </motion.div>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass w-full max-w-md p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-5">
                <FiAlertTriangle className="text-amber-400" size={28} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Confirm Your Vote</h2>
              <p className="text-white/60 mb-2">You are about to vote for:</p>
              <div className="glass-dark p-4 rounded-xl mb-6">
                <p className="text-xl font-bold text-white">{selected?.name}</p>
                <p className="text-violet-400">{selected?.party}</p>
              </div>
              <p className="text-white/40 text-sm mb-6">
                This action is irreversible. Your vote cannot be changed after submission.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVote}
                  disabled={submitting}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle size={18} />
                      Confirm Vote
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
