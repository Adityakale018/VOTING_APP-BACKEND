import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidateAPI } from '../services/api';
import './Results.css';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await candidateAPI.getVoteCount();
      setResults(response.data);
    } catch (error) {
      setError('Failed to load results. Please try again.');
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="results-container">
        <div className="loading">Loading results...</div>
      </div>
    );
  }

  const totalVotes = results.reduce((sum, result) => sum + result.count, 0);

  return (
    <div className="results-container">
      <div className="results-card">
        <h1>Election Results</h1>
        <p className="subtitle">Live voting results and standings</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="total-votes">
          <h2>Total Votes Cast: {totalVotes}</h2>
        </div>
        
        {results.length === 0 ? (
          <p className="no-results">No votes have been cast yet.</p>
        ) : (
          <div className="results-list">
            {results.map((result, index) => {
              const percentage = totalVotes > 0 ? ((result.count / totalVotes) * 100).toFixed(1) : 0;
              return (
                <div key={index} className="result-item">
                  <div className="result-header">
                    <div className="rank-badge">{index + 1}</div>
                    <div className="party-info">
                      <h3>{result.party}</h3>
                      <p className="vote-count">{result.count} votes ({percentage}%)</p>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="results-actions">
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Back to Home
          </button>
          <button onClick={fetchResults} className="btn btn-secondary">
            Refresh Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
