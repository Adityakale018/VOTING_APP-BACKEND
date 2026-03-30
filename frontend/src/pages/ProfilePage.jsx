import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiLogOut,
  FiCheckCircle, FiEye, FiEyeOff, FiChevronDown, FiChevronUp, FiShield,
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/authService'
import { getInitials, maskAadhar, getErrorMessage } from '../utils/helpers'
import LoadingSpinner from '../components/common/LoadingSpinner'

export default function ProfilePage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({ currentpassword: '', newpassword: '' })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    authService.getProfile()
      .then(setProfile)
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (!passwordData.currentpassword || !passwordData.newpassword) {
      toast.error('Please fill in both password fields')
      return
    }
    if (passwordData.newpassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }
    setPasswordLoading(true)
    try {
      await authService.updatePassword(passwordData.currentpassword, passwordData.newpassword)
      toast.success('Password updated successfully!')
      setPasswordData({ currentpassword: '', newpassword: '' })
      setShowPasswordForm(false)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center pt-16">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    )
  }

  const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-4 py-4 border-b border-white/10 last:border-0">
      <div className="text-violet-400 mt-0.5">{icon}</div>
      <div>
        <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
        <p className="text-white font-medium">{value || 'N/A'}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-10 px-4 relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Avatar & Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-600 to-blue-600 text-white font-black text-3xl shadow-2xl shadow-violet-500/30 mb-5">
            {getInitials(profile?.name)}
          </div>
          <h1 className="text-3xl font-bold text-white">{profile?.name}</h1>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${
              profile?.role === 'admin'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-violet-500/10 text-violet-400 border-violet-500/20'
            }`}>
              <FiShield size={14} />
              {profile?.role === 'admin' ? 'Administrator' : 'Voter'}
            </span>
            {profile?.isvoted && (
              <span className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                <FiCheckCircle size={14} />
                Voted
              </span>
            )}
          </div>
        </motion.div>

        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 mb-4"
        >
          <h2 className="text-lg font-bold text-white mb-4">Personal Information</h2>
          <InfoRow icon={<FiUser size={18} />} label="Full Name" value={profile?.name} />
          <InfoRow icon={<FiMail size={18} />} label="Email" value={profile?.email} />
          <InfoRow icon={<FiPhone size={18} />} label="Mobile" value={profile?.mobile} />
          <InfoRow icon={<FiMapPin size={18} />} label="Address" value={profile?.address} />
          <InfoRow icon={<FiShield size={18} />} label="Aadhar Number" value={maskAadhar(profile?.aadharNumber)} />
        </motion.div>

        {/* Change Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass mb-4"
        >
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors rounded-2xl"
          >
            <div className="flex items-center gap-3 text-white font-semibold">
              <FiLock className="text-violet-400" size={18} />
              Change Password
            </div>
            {showPasswordForm ? <FiChevronUp className="text-white/50" /> : <FiChevronDown className="text-white/50" />}
          </button>

          <AnimatePresence>
            {showPasswordForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <form onSubmit={handlePasswordChange} className="px-6 pb-6 space-y-4">
                  <div className="border-t border-white/10 pt-4" />
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrent ? 'text' : 'password'}
                        value={passwordData.currentpassword}
                        onChange={(e) => setPasswordData((p) => ({ ...p, currentpassword: e.target.value }))}
                        placeholder="Enter current password"
                        className="input-field pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
                      >
                        {showCurrent ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showNew ? 'text' : 'password'}
                        value={passwordData.newpassword}
                        onChange={(e) => setPasswordData((p) => ({ ...p, newpassword: e.target.value }))}
                        placeholder="Enter new password"
                        className="input-field pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
                      >
                        {showNew ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {passwordLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <FiLock size={16} />
                        Update Password
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 font-semibold transition-all duration-300"
        >
          <FiLogOut size={18} />
          Sign Out
        </motion.button>
      </div>
    </div>
  )
}
