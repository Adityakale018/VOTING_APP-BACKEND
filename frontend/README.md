# Voting App Frontend

A React-based single-page application (SPA) for the Voting App backend. This frontend provides an intuitive interface for users to register, login, cast votes, and view election results.

## Features

- **User Authentication**: Secure login and signup with JWT tokens
- **Home Page**: Welcome page with navigation to key features
- **Voting Interface**: Interactive candidate selection and voting
- **Results Dashboard**: Real-time visualization of voting results with percentages
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Protected Routes**: Authentication-based route protection

## Tech Stack

- **React 19.2**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **React Router v7**: Client-side routing
- **Axios**: HTTP client for API calls
- **CSS Modules**: Component-scoped styling

## Prerequisites

Before running the frontend, make sure:

1. Node.js (v14 or higher) is installed
2. The backend server is running (default: `http://localhost:3000`)

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file (optional):
```bash
cp .env.example .env
```

Edit `.env` to configure the backend API URL if different from default:
```
VITE_API_URL=http://localhost:3000
```

## Running the Application

### Development Mode

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

### Production Build

Build the application for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── pages/           # Page components
│   │   ├── Home.jsx     # Welcome/landing page
│   │   ├── Login.jsx    # User login page
│   │   ├── Signup.jsx   # User registration page
│   │   ├── Vote.jsx     # Voting interface
│   │   └── Results.jsx  # Results dashboard
│   ├── services/        # API service layer
│   │   └── api.js       # API configuration and endpoints
│   ├── utils/           # Utility functions
│   │   └── AuthContext.jsx  # Authentication context
│   ├── App.jsx          # Main app component with routes
│   ├── App.css          # Global app styles
│   └── index.css        # Root styles
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

## API Integration

The frontend communicates with the backend through the following endpoints:

### User Endpoints
- `POST /user/signup` - Register new user
- `POST /user/login` - Login user
- `GET /user/profile` - Get user profile (protected)

### Candidate Endpoints
- `GET /candidate/candidates` - Get all candidates (protected)
- `POST /candidate/vote/:candidateID` - Cast vote (protected)
- `GET /candidate/vote/count` - Get vote results (public)

## Usage Guide

### For Voters:

1. **Sign Up**: Create an account with your details including Aadhar number
2. **Login**: Use your Aadhar number and password to login
3. **Vote**: Select a candidate from the voting page and cast your vote
4. **View Results**: Check real-time voting results

### For Admins:

Admins can login but cannot cast votes. Admin features for managing candidates are handled through the backend API directly.

## Key Features Explained

### Authentication
- JWT tokens stored in localStorage
- Automatic token injection in API requests
- Protected routes require authentication
- Automatic redirect to login for unauthenticated users

### Voting System
- One vote per user
- Visual candidate selection
- Confirmation before casting vote
- Prevents admin users from voting
- Prevents duplicate voting

### Results Display
- Real-time vote counts
- Percentage calculations
- Visual progress bars
- Ranking by vote count
- Refresh button for latest results

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000` |

## Troubleshooting

### Port Already in Use
If port 5173 is busy, Vite will automatically use the next available port.

### API Connection Issues
- Ensure the backend server is running
- Check the `VITE_API_URL` in your `.env` file
- Verify CORS is enabled on the backend

### Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development Notes

- The frontend is completely isolated from the backend codebase
- No backend files are modified by this frontend application
- All backend API calls are made through the centralized `services/api.js` file
- Authentication state is managed through React Context
- Responsive design works on mobile, tablet, and desktop

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

When making changes:
1. Ensure no backend files are modified
2. Test on multiple screen sizes
3. Verify API integration still works
4. Update this README if adding new features

## License

This frontend is part of the VOTING_APP-BACKEND project.

