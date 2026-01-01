import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import './Home.css';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to Voting App</h1>
        <p className="subtitle">Your voice matters in shaping democracy</p>
        
        {user ? (
          <div className="user-section">
            <h2>Hello, {user.name}!</h2>
            <p className="user-info">Role: {user.role}</p>
            <p className="user-info">Status: {user.isvoted ? '✓ Already Voted' : 'Not Voted Yet'}</p>
            
            <div className="action-buttons">
              {!user.isvoted && user.role !== 'admin' && (
                <Link to="/vote" className="btn btn-primary">
                  Cast Your Vote
                </Link>
              )}
              <Link to="/results" className="btn btn-secondary">
                View Results
              </Link>
              <button onClick={logout} className="btn btn-logout">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="guest-section">
            <p className="description">
              Exercise your right to vote and be part of the democratic process.
              Sign in or create an account to get started.
            </p>
            <div className="action-buttons">
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/signup" className="btn btn-secondary">
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
