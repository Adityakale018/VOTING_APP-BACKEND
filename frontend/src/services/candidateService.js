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
}
