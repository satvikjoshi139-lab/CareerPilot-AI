import React from 'react';
import MaterialCard from '../components/MaterialCard';
import RippleButton from '../components/RippleButton';
import CareerDevelopmentDashboard from '../components/CareerDevelopmentDashboard';

const Dashboard = ({ profile, setActiveTab }) => {
  // Mock data for graphs
  const progressHistory = [
    { month: 'Jan', score: 35 },
    { month: 'Feb', score: 42 },
    { month: 'Mar', score: 48 },
    { month: 'Apr', score: 55 },
    { month: 'May', score: 62 },
    { month: 'Jun', score: 68 },
  ];

  // SVG dimensions for custom graph
  const width = 500;
  const height = 180;
  const padding = 30;

  // Generate SVG coordinates for line graph
  const points = progressHistory.map((d, index) => {
    const x = padding + (index * (width - 2 * padding)) / (progressHistory.length - 1);
    const y = height - padding - (d.score * (height - 2 * padding)) / 100;
    return { x, y, month: d.month, score: d.score };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="dashboard-container">
      {/* Welcome & Summary Header */}
      <header className="dashboard-header">
        <div>
          <h1>Welcome pilot, {profile.name || 'Explorer'}!</h1>
          <p className="text-muted">Targeting: <strong>{profile.targetRole}</strong> | Path status: <strong>In Progress</strong></p>
        </div>
        <RippleButton variant="tonal" icon="settings" onClick={() => setActiveTab('profile-setup')}>
          Profile Settings
        </RippleButton>
      </header>

      {/* Metrics Row */}
      <section className="metrics-grid">
        <MaterialCard variant="elevated" className="metric-card">
          <div className="metric-header">
            <span className="material-symbols-outlined metric-icon icon-blue">speed</span>
            <span className="badge badge-primary">Top 15%</span>
          </div>
          <div className="metric-value">{profile.readinessScore}%</div>
          <div className="metric-label">Career Readiness Score</div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${profile.readinessScore}%` }} />
          </div>
        </MaterialCard>

        <MaterialCard variant="elevated" className="metric-card">
          <div className="metric-header">
            <span className="material-symbols-outlined metric-icon icon-teal">check_circle</span>
            <span className="badge badge-success">3 Pending</span>
          </div>
          <div className="metric-value">5 / 8</div>
          <div className="metric-label">Core Skills Mastered</div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill bg-success" style={{ width: '62%' }} />
          </div>
        </MaterialCard>

        <MaterialCard variant="elevated" className="metric-card">
          <div className="metric-header">
            <span className="material-symbols-outlined metric-icon icon-rose">assignment</span>
            <span className="badge badge-tertiary">2 Completed</span>
          </div>
          <div className="metric-value">1 / 3</div>
          <div className="metric-label">Target Projects Built</div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill bg-tertiary" style={{ width: '33%' }} />
          </div>
        </MaterialCard>
      </section>

      {/* Main Content Layout */}
      <div className="dashboard-layout">
        {/* Progress History Custom SVG Chart */}
        <MaterialCard variant="outlined" className="chart-card">
          <div className="chart-header">
            <div>
              <h3>Readiness Progress</h3>
              <p className="text-muted">How your score improved over the last 6 months</p>
            </div>
            <span className="badge badge-primary">AI Target: 85%</span>
          </div>

          <div className="chart-wrapper">
            <svg viewBox={`0 0 ${width} ${height}`} className="custom-svg-chart">
              {/* Grid Lines */}
              {[0, 25, 50, 75, 100].map((val) => {
                const y = height - padding - (val * (height - 2 * padding)) / 100;
                return (
                  <g key={val}>
                    <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="var(--md-sys-color-outline-variant)" strokeDasharray="3,3" strokeWidth="0.5" />
                    <text x={padding - 10} y={y + 4} fontSize="9" textAnchor="end" fill="var(--md-sys-color-on-surface-variant)">{val}%</text>
                  </g>
                );
              })}

              {/* Area Gradient */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--md-sys-color-primary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--md-sys-color-primary)" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Area path */}
              <path d={areaPath} fill="url(#chartGradient)" />

              {/* Line path */}
              <path d={linePath} fill="none" stroke="var(--md-sys-color-primary)" strokeWidth="3" strokeLinecap="round" />

              {/* Points & Labels */}
              {points.map((p, index) => (
                <g key={index} className="chart-dot-group">
                  <circle cx={p.x} cy={p.y} r="5" fill="var(--md-sys-color-surface)" stroke="var(--md-sys-color-primary)" strokeWidth="2.5" />
                  {/* Tooltip on hover */}
                  <text x={p.x} y={p.y - 10} fontSize="10" fontWeight="bold" textAnchor="middle" fill="var(--md-sys-color-on-surface)" className="chart-tooltip">
                    {p.score}%
                  </text>
                  {/* X axis labels */}
                  <text x={p.x} y={height - 10} fontSize="10" textAnchor="middle" fill="var(--md-sys-color-on-surface-variant)">
                    {p.month}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </MaterialCard>

        {/* AI Recommendations */}
        <MaterialCard variant="filled" className="recommendations-card">
          <h3>AI Action Plan</h3>
          <p className="text-muted">Custom priority items to boost your match score.</p>
          
          <div className="rec-list">
            <div className="rec-item" onClick={() => setActiveTab('skills')}>
              <span className="material-symbols-outlined rec-icon icon-blue">analytics</span>
              <div className="rec-content">
                <h4>Close your React and Node.js skill gaps</h4>
                <p>Run the Skill Analysis simulator and map your learning goals.</p>
              </div>
              <span className="material-symbols-outlined arrow-icon">chevron_right</span>
            </div>

            <div className="rec-item" onClick={() => setActiveTab('projects')}>
              <span className="material-symbols-outlined rec-icon icon-teal">terminal</span>
              <div className="rec-content">
                <h4>Build API Server Portfolio Project</h4>
                <p>Construct a Node/Express backend that maps to 2 core skill gaps.</p>
              </div>
              <span className="material-symbols-outlined arrow-icon">chevron_right</span>
            </div>

            <div className="rec-item" onClick={() => setActiveTab('interview')}>
              <span className="material-symbols-outlined rec-icon icon-rose">forum</span>
              <div className="rec-content">
                <h4>Complete 1 Mock Interview session</h4>
                <p>Practice common behavioral and technical queries in our simulator.</p>
              </div>
              <span className="material-symbols-outlined arrow-icon">chevron_right</span>
            </div>
          </div>
        </MaterialCard>
      </div>
      <div style={{ marginTop: '2rem' }}>
  <CareerDevelopmentDashboard />
</div>
    </div>
  );
};

export default Dashboard;
