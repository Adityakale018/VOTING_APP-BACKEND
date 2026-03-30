import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiUsers, FiAward,
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import { candidateService } from '../services/candidateService'
import { getInitials, getErrorMessage } from '../utils/helpers'
import LoadingSpinner from '../components/common/LoadingSpinner'

const emptyForm = { name: '', age: '', party: '' }

export default function AdminPage() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const fetchCandidates = async () => {
    try {
      const data = await candidateService.getCandidates()
      setCandidates(Array.isArray(data) ? data : data.candidates || [])
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCandidates()
  }, [])

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (candidate) => {
    setEditingId(candidate._id)
    setForm({ name: candidate.name, age: candidate.age, party: candidate.party })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.party.trim() || !form.age) {
      toast.error('Please fill in all fields')
      return
    }
    const age = Number(form.age)
    if (isNaN(age) || age < 18) {
      toast.error('Candidate must be at least 18 years old')
      return
    }
    setSaving(true)
    try {
      if (editingId) {
        await candidateService.updateCandidate(editingId, { name: form.name.trim(), age, party: form.party.trim() })
        toast.success('Candidate updated successfully!')
      } else {
        await candidateService.addCandidate({ name: form.name.trim(), age, party: form.party.trim() })
        toast.success('Candidate added successfully!')
      }
      closeForm()
      fetchCandidates()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (candidateId) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) return
    setDeletingId(candidateId)
    try {
      await candidateService.deleteCandidate(candidateId)
      toast.success('Candidate deleted successfully!')
      setCandidates((prev) => prev.filter((c) => c._id !== candidateId))
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeletingId(null)
    }
  }

  const partyColors = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-amber-600',
    'from-pink-500 to-rose-600',
  ]

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-10 px-4 relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Admin <span className="gradient-text">Panel</span>
            </h1>
            <p className="text-white/50 mt-2">Manage candidates for the election.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="glass px-5 py-3 text-center">
              <div className="text-2xl font-bold gradient-text">{candidates.length}</div>
              <div className="text-white/50 text-xs">Candidates</div>
            </div>
            <button
              onClick={openAdd}
              className="btn-primary flex items-center gap-2"
            >
              <FiPlus size={18} />
              Add Candidate
            </button>
          </div>
        </motion.div>

        {/* Add/Edit Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={(e) => { if (e.target === e.currentTarget) closeForm() }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="glass w-full max-w-md p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">
                    {editingId ? 'Edit Candidate' : 'Add Candidate'}
                  </h2>
                  <button
                    onClick={closeForm}
                    className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Enter candidate name"
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Age</label>
                    <input
                      type="number"
                      value={form.age}
                      onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                      placeholder="Enter age (min 18)"
                      min="18"
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Party</label>
                    <input
                      type="text"
                      value={form.party}
                      onChange={(e) => setForm((f) => ({ ...f, party: e.target.value }))}
                      placeholder="Enter party name"
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeForm}
                      className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 btn-primary flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiCheck size={16} />
                          {editingId ? 'Update' : 'Add Candidate'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Candidate List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner text="Loading candidates..." />
          </div>
        ) : candidates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-white/40"
          >
            <FiUsers size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-xl mb-2">No candidates yet</p>
            <p className="text-sm">Click "Add Candidate" to get started.</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
              hidden: {},
            }}
          >
            {candidates.map((candidate, index) => (
              <motion.div
                key={candidate._id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="glass p-6 flex flex-col gap-4"
              >
                {/* Avatar */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${partyColors[index % partyColors.length]} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                  {getInitials(candidate.name)}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{candidate.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <FiAward className="text-violet-400" size={14} />
                    <span className="text-white/60 text-sm">{candidate.party}</span>
                  </div>
                  <p className="text-white/40 text-xs mt-1">Age: {candidate.age}</p>
                  <p className="text-white/40 text-xs">Votes: {candidate.voteCount || 0}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(candidate)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm font-medium bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 hover:text-violet-300 border border-violet-500/20 transition-all"
                  >
                    <FiEdit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(candidate._id)}
                    disabled={deletingId === candidate._id}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === candidate._id ? (
                      <div className="w-3 h-3 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                    ) : (
                      <FiTrash2 size={14} />
                    )}
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
