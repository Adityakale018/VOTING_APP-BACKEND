import api from './api'

export const candidateService = {
  async getCandidates() {
    const response = await api.get('/candidate/candidates')
    return response.data
  },

  async voteForCandidate(candidateID) {
    const response = await api.post(`/candidate/vote/${candidateID}`)
    return response.data
  },

  async getVoteCount() {
    const response = await api.get('/candidate/vote/count')
    return response.data
  },

  async addCandidate(candidateData) {
    const response = await api.post('/candidate', candidateData)
    return response.data
  },

  async updateCandidate(candidateID, candidateData) {
    const response = await api.put(`/candidate/${candidateID}`, candidateData)
    return response.data
  },

  async deleteCandidate(candidateID) {
    const response = await api.delete(`/candidate/${candidateID}`)
    return response.data
  },
}
