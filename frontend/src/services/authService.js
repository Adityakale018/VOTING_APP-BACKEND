import api from './api'

export const authService = {
  async login(aadharNumber, password) {
    const response = await api.post('/user/login', { aadharNumber, password })
    return response.data
  },

  async signup(userData) {
    const response = await api.post('/user/signup', userData)
    return response.data
  },

  async getProfile() {
    const response = await api.get('/user/profile')
    return response.data
  },

  async updatePassword(currentpassword, newpassword) {
    const response = await api.put('/user/profile/password', { currentpassword, newpassword })
    return response.data
  },
}
