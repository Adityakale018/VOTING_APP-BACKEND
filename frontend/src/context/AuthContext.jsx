import { createContext, useState, useEffect, useCallback } from 'react'

export const AuthContext = createContext(null)

function parseToken(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('votex_token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      const parsed = parseToken(token)
      if (parsed && parsed.exp * 1000 > Date.now()) {
        setUser(parsed)
      } else {
        localStorage.removeItem('votex_token')
        setToken(null)
        setUser(null)
      }
    } else {
      setUser(null)
    }
    setLoading(false)
  }, [token])

  const login = useCallback((newToken) => {
    localStorage.setItem('votex_token', newToken)
    setToken(newToken)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('votex_token')
    setToken(null)
    setUser(null)
  }, [])

  const isAuthenticated = Boolean(token && user)

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
