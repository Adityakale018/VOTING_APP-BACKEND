export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const COLORS = {
  primary: '#6D28D9',
  primaryLight: '#7C3AED',
  primaryDark: '#5B21B6',
  accent: '#3B82F6',
  dark: '#0F172A',
}

export const ROLES = {
  VOTER: 'voter',
  ADMIN: 'admin',
}

export const TOKEN_KEY = 'votex_token'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  VOTE: '/vote',
  RESULTS: '/results',
  PROFILE: '/profile',
}
