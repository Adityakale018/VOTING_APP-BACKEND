import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidateAPI } from '../services/api';
import { useAuth } from '../utils/AuthContext';
import './Vote.css';

const Vote = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voting, setVoting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.isvoted) {
      setError('You have already voted!');
      setLoading(false);
      return;
    }

    if (user.role === 'admin') {
      setError('Admins are not allowed to vote!');
      setLoading(false);
      return;
    }

    fetchCandidates();
  }, [user, navigate]);

  const fetchCandidates = async () => {
    try {
      const response = await candidateAPI.getAllCandidates();
      setCandidates(response.data);
    } catch (error) {
      setError('Failed to load candidates. Please try again.');
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate) {
      alert('Please select a candidate first!');
      return;
    }

    if (!window.confirm(`Are you sure you want to vote for ${selectedCandidate.name} from ${selectedCandidate.party}?`)) {
      return;
    }

    setVoting(true);
    try {
      await candidateAPI.vote(selectedCandidate._id);
      alert('Vote cast successfully!');
      navigate('/results');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to cast vote. Please try again.');
      console.error('Error voting:', error);
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="vote-container">
        <div className="loading">Loading candidates...</div>
      </div>
    );
  }

  if (error && (user?.isvoted || user?.role === 'admin')) {
    return (
      <div className="vote-container">
        <div className="vote-card">
          <div className="error-message">{error}</div>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vote-container">
      <div className="vote-card">
        <h1>Cast Your Vote</h1>
        <p className="subtitle">Select a candidate below to cast your vote</p>
        
        {error && <div className="error-message">{error}</div>}
        
        {candidates.length === 0 ? (
          <p className="no-candidates">No candidates available at the moment.</p>
        ) : (
          <>
            <div className="candidates-list">
              {candidates.map((candidate) => (
                <div
                  key={candidate._id}
                  className={`candidate-card ${selectedCandidate?._id === candidate._id ? 'selected' : ''}`}
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <div className="candidate-info">
                    <h3>{candidate.name}</h3>
                    <p className="party">{candidate.party}</p>
                    <p className="age">Age: {candidate.age}</p>
                  </div>
                  <div className="select-indicator">
                    {selectedCandidate?._id === candidate._id && '✓'}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="vote-actions">
              <button
                onClick={handleVote}
                disabled={!selectedCandidate || voting}
                className="btn btn-vote"
              >
                {voting ? 'Casting Vote...' : 'Cast Vote'}
              </button>
              <button
                onClick={() => navigate('/')}
                className="btn btn-cancel"
                disabled={voting}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Vote;
