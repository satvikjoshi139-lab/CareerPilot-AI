import React from 'react';

const navItems = [
  { id: 'landing', label: 'Home', icon: 'home' },
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'skills', label: 'Skill Analysis', icon: 'analytics' },
  { id: 'projects', label: 'Projects', icon: 'terminal' },
  { id: 'interview', label: 'Interview Prep', icon: 'forum' },
  { id: 'roadmap', label: 'Roadmap', icon: 'alt_route' },
];

const Navigation = ({ activeTab, setActiveTab, isDarkMode, toggleTheme }) => {
  return (
    <>
      {/* Side Navigation Drawer (for Desktop/Tablets) */}
      <nav className="nav-drawer">
        <div className="nav-header">
          <span className="material-symbols-outlined nav-logo-icon">navigation</span>
          <span className="nav-logo-text">CareerPilot AI</span>
        </div>

        <div className="nav-list">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                {/* Active indicator pill (MD3 Style) */}
                <div className="active-indicator" />
                <span className="material-symbols-outlined nav-item-icon">{item.icon}</span>
                <span className="nav-item-label">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="nav-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <button
            className={`theme-toggle-btn ${activeTab === 'profile-setup' ? 'nav-item-active' : ''}`}
            onClick={() => setActiveTab('profile-setup')}
            title="Profile Settings"
            style={{ borderRadius: 'var(--md-shape-corner-full)' }}
          >
            <span className="material-symbols-outlined">account_circle</span>
            <span className="theme-toggle-label">Profile Setup</span>
          </button>
          
          <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
            <span className="material-symbols-outlined">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
            <span className="theme-toggle-label">
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        </div>
      </nav>

      {/* Bottom Navigation (for Mobile) */}
      <nav className="bottom-nav">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`bottom-nav-item ${isActive ? 'bottom-nav-item-active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="bottom-active-indicator" />
              <span className="material-symbols-outlined bottom-nav-icon">{item.icon}</span>
              <span className="bottom-nav-label">{item.label}</span>
            </button>
          );
        })}
        <button
          className={`bottom-nav-item ${activeTab === 'profile-setup' ? 'bottom-nav-item-active' : ''}`}
          onClick={() => setActiveTab('profile-setup')}
        >
          <div className="bottom-active-indicator" />
          <span className="material-symbols-outlined bottom-nav-icon">account_circle</span>
          <span className="bottom-nav-label">Profile</span>
        </button>
        
        <button className="bottom-nav-item" onClick={toggleTheme}>
          <span className="material-symbols-outlined bottom-nav-icon">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
          <span className="bottom-nav-label">Theme</span>
        </button>
      </nav>
    </>
  );
};

export default Navigation;
