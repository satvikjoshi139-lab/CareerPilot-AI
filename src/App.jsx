import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SkillAnalysis from './pages/SkillAnalysis';
import Projects from './pages/Projects';
import InterviewPrep from './pages/InterviewPrep';
import Roadmap from './pages/Roadmap';
import ProfileSetup from './pages/ProfileSetup';
import CareerPilotDashboard from './components/CareerPilotDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('careerPilotProfile');
      return saved ? JSON.parse(saved) : {
        name: 'Rahul Sharma',
        degree: 'B.Tech CSE',
        currentSkills: ['Java', 'MySQL'],
        targetRole: 'SDE-1',
        experience: 'Fresher',
        readinessScore: 40,
        profileCompleted: false,
      };
    } catch {
      return {
        name: '',
        degree: '',
        currentSkills: [],
        targetRole: 'SDE-1',
        experience: '',
        readinessScore: 40,
        profileCompleted: false,
      };
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const updateProfile = (updates) => {
    setProfile((prev) => {
      const merged = { ...prev, ...updates };
      try { localStorage.setItem('careerPilotProfile', JSON.stringify(merged)); } catch {}
      return merged;
    });
  };

  // MUI theme
  const muiTheme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: { main: '#4f46e5' },
      secondary: { main: '#7c3aed' },
      background: {
        default: isDarkMode ? '#0f172a' : '#f8fafc',
        paper: isDarkMode ? '#1e293b' : '#ffffff',
      },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: '"Inter","Roboto","Helvetica","Arial",sans-serif',
    },
    components: {
      MuiCard: {
        defaultProps: { elevation: 2 },
        styleOverrides: {
          root: { borderRadius: 16 },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600 },
        },
      },
    },
  });

  // Pages that use the full CareerPilotDashboard shell
  const dashboardTabs = ['career-dashboard'];

  // Legacy page routing (keeps existing pages working)
  const renderPage = () => {
    switch (activeTab) {
      case 'career-dashboard':
        return <CareerPilotDashboard isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
      case 'dashboard':
        return <Dashboard profile={profile} setActiveTab={setActiveTab} />;
      case 'skills':
        return <SkillAnalysis profile={profile} updateProfile={updateProfile} />;
      case 'projects':
        return <Projects profile={profile} />;
      case 'interview':
        return <InterviewPrep profile={profile} />;
      case 'roadmap':
        return <Roadmap profile={profile} updateProfile={updateProfile} />;
      case 'profile-setup':
        return (
          <ProfileSetup
            profile={profile}
            updateProfile={updateProfile}
            onSubmit={() => setActiveTab('career-dashboard')}
          />
        );
      case 'landing':
      default:
        return (
          <LandingPage
            onGetStarted={() => {
              if (profile.profileCompleted) {
                setActiveTab('career-dashboard');
              } else {
                setActiveTab('profile-setup');
              }
            }}
          />
        );
    }
  };

  const isFullDashboard = activeTab === 'career-dashboard';

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className="app-container">
        {!isFullDashboard && (
          <Navigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
          />
        )}
        <main className={isFullDashboard ? '' : 'main-content'}>
          {renderPage()}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
