import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiEye, FiEyeOff, FiUserPlus } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { authService } from '../services/authService'
import { getErrorMessage } from '../utils/helpers'

const initialForm = {
  name: '',
  age: '',
  email: '',
  mobile: '',
  address: '',
  aadharNumber: '',
  password: '',
  role: 'voter',
}

function Field({ name, label, type = 'text', placeholder, formData, errors, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/70 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-field ${errors[name] ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
      />
      {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
    </div>
  )
}

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialForm)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!formData.name.trim()) errs.name = 'Name is required'
    if (!formData.age || isNaN(formData.age) || formData.age < 18) errs.age = 'Must be 18 or older'
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Valid email required'
    if (!formData.mobile.match(/^\d{10}$/)) errs.mobile = '10-digit mobile number required'
    if (!formData.address.trim()) errs.address = 'Address is required'
    if (!formData.aadharNumber.match(/^\d{12}$/)) errs.aadharNumber = '12-digit Aadhar number required'
    if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await authService.signup({ ...formData, age: Number(formData.age) })
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-24 relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 mb-4 shadow-lg shadow-violet-500/25">
            <span className="text-white font-black text-2xl">V</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-white/50 mt-2">Join VoteX and make your voice heard</p>
        </div>

        <div className="glass p-8 shadow-2xl shadow-black/40">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field name="name" label="Full Name" placeholder="John Doe" formData={formData} errors={errors} onChange={handleChange} />
              <Field name="age" label="Age" type="number" placeholder="18" formData={formData} errors={errors} onChange={handleChange} />
              <Field name="email" label="Email Address" type="email" placeholder="john@example.com" formData={formData} errors={errors} onChange={handleChange} />
              <Field name="mobile" label="Mobile Number" placeholder="10-digit number" formData={formData} errors={errors} onChange={handleChange} />
            </div>

            <Field name="address" label="Address" placeholder="Your full address" formData={formData} errors={errors} onChange={handleChange} />
            <Field name="aadharNumber" label="Aadhar Number" placeholder="12-digit Aadhar number" formData={formData} errors={errors} onChange={handleChange} />

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={`input-field pr-12 ${errors.password ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field cursor-pointer"
              >
                <option value="voter" className="bg-slate-800">Voter</option>
                <option value="admin" className="bg-slate-800">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-3 mt-6"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <FiUserPlus size={18} />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/50 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
