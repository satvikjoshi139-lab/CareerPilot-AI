import React, { useState, useEffect } from 'react';
import MaterialCard from '../components/MaterialCard';
import RippleButton from '../components/RippleButton';

const defaultSkillsData = {
  'Software Engineer': [
    { name: 'Frontend (React)', user: 4, market: 8 },
    { name: 'Backend (Node.js)', user: 3, market: 7 },
    { name: 'System Design', user: 2, market: 6 },
    { name: 'Data Structures', user: 5, market: 8 },
    { name: 'DevOps / Cloud', user: 2, market: 5 },
  ],
  'Product Manager': [
    { name: 'Product Strategy', user: 5, market: 8 },
    { name: 'UX Design', user: 4, market: 6 },
    { name: 'SQL & Analytics', user: 3, market: 7 },
    { name: 'A/B Testing', user: 2, market: 6 },
    { name: 'Agile Delivery', user: 6, market: 8 },
  ],
  'Data Scientist': [
    { name: 'Python Coding', user: 6, market: 8 },
    { name: 'Machine Learning', user: 3, market: 8 },
    { name: 'Data Wrangling', user: 5, market: 7 },
    { name: 'Statistics', user: 4, market: 7 },
    { name: 'Cloud Pipelines', user: 2, market: 6 },
  ]
};

const SkillAnalysis = ({ profile, updateProfile }) => {
  const [targetRole, setTargetRole] = useState(profile.targetRole || 'Software Engineer');
  const [skills, setSkills] = useState(defaultSkillsData[targetRole]);

  // Sync state if role changes
  useEffect(() => {
    setSkills(defaultSkillsData[targetRole]);
    updateProfile({ targetRole });
  }, [targetRole]);

  const handleSkillChange = (index, value) => {
    const updated = [...skills];
    updated[index].user = parseInt(value, 10);
    setSkills(updated);

    // Calculate new overall readiness score
    const totalUser = updated.reduce((sum, s) => sum + s.user, 0);
    const totalMarket = updated.reduce((sum, s) => sum + s.market, 0);
    const newScore = Math.min(Math.round((totalUser / totalMarket) * 100), 100);
    updateProfile({ readinessScore: newScore });
  };

  // Radar Chart Drawing Logic
  const cx = 200;
  const cy = 200;
  const maxVal = 10;
  const r = 130; // Max radius
  const totalAxes = skills.length;

  // Calculate coordinates for a given index and value
  const getCoordinates = (index, value) => {
    const angle = (2 * Math.PI * index) / totalAxes - Math.PI / 2;
    const factor = value / maxVal;
    return {
      x: cx + r * factor * Math.cos(angle),
      y: cy + r * factor * Math.sin(angle),
    };
  };

  // Generate paths
  const userPoints = skills.map((s, i) => getCoordinates(i, s.user));
  const marketPoints = skills.map((s, i) => getCoordinates(i, s.market));

  const userPath = userPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  const marketPath = marketPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  // Concentric background grid lines
  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div className="skills-container">
      <header className="skills-header">
        <div>
          <h1>Skill Gap Analysis</h1>
          <p className="text-muted">Adjust sliders to see your standing against market requirements.</p>
        </div>

        <div className="role-selector-wrapper">
          <label className="input-label">Target Role</label>
          <select 
            className="input-field" 
            value={targetRole} 
            onChange={(e) => setTargetRole(e.target.value)}
          >
            <option value="Software Engineer">Software Engineer</option>
            <option value="Product Manager">Product Manager</option>
            <option value="Data Scientist">Data Scientist</option>
          </select>
        </div>
      </header>

      <div className="skills-layout">
        {/* Sliders Input */}
        <MaterialCard variant="outlined" className="sliders-card">
          <h3>Assess Your Skill Level</h3>
          <p className="text-muted">Rate your self-proficiency from 0 to 10</p>
          
          <div className="sliders-list">
            {skills.map((skill, index) => {
              const gap = skill.market - skill.user;
              return (
                <div key={skill.name} className="slider-group">
                  <div className="slider-header">
                    <span className="slider-name">{skill.name}</span>
                    <span className="slider-values">
                      {skill.user}/10 <span className="text-muted">(Market: {skill.market})</span>
                    </span>
                  </div>
                  <div className="slider-row">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={skill.user}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                      className="slider-input"
                    />
                    {gap > 0 ? (
                      <span className="badge badge-error gap-badge">-{gap} Gap</span>
                    ) : (
                      <span className="badge badge-success gap-badge">Matched</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </MaterialCard>

        {/* Radar Chart Visualizer */}
        <MaterialCard variant="elevated" className="radar-card">
          <div className="radar-header">
            <h3>Visual Skill Gap</h3>
            <div className="legend">
              <span className="legend-item"><span className="legend-color legend-user" /> You</span>
              <span className="legend-item"><span className="legend-color legend-market" /> Market Target</span>
            </div>
          </div>

          <div className="radar-wrapper">
            <svg viewBox="0 0 400 400" className="radar-svg">
              {/* Grid levels */}
              {gridLevels.map((lvl, index) => {
                const gridPoints = skills.map((_, i) => getCoordinates(i, lvl * maxVal));
                const gridPath = gridPoints.map((p, k) => `${k === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
                return (
                  <path
                    key={index}
                    d={gridPath}
                    fill="none"
                    stroke="var(--md-sys-color-outline-variant)"
                    strokeWidth="0.5"
                    strokeDasharray="2,2"
                  />
                );
              })}

              {/* Skill Axis lines & Text Labels */}
              {skills.map((skill, index) => {
                const outer = getCoordinates(index, maxVal);
                // Adjust label placements so they don't clip
                const textPos = getCoordinates(index, maxVal + 1.8);
                let textAnchor = 'middle';
                if (textPos.x < cx - 10) textAnchor = 'end';
                else if (textPos.x > cx + 10) textAnchor = 'start';

                return (
                  <g key={index}>
                    <line
                      x1={cx}
                      y1={cy}
                      x2={outer.x}
                      y2={outer.y}
                      stroke="var(--md-sys-color-outline-variant)"
                      strokeWidth="0.5"
                    />
                    <text
                      x={textPos.x}
                      y={textPos.y + 4}
                      fontSize="10.5"
                      fontWeight="600"
                      textAnchor={textAnchor}
                      fill="var(--md-sys-color-on-surface)"
                    >
                      {skill.name}
                    </text>
                  </g>
                );
              })}

              {/* Market Requirement Area */}
              <path
                d={marketPath}
                fill="rgba(88, 93, 113, 0.12)"
                stroke="var(--md-sys-color-secondary)"
                strokeWidth="2"
                strokeDasharray="3,3"
                className="radar-area-market"
              />

              {/* User Level Area */}
              <path
                d={userPath}
                fill="rgba(59, 92, 180, 0.25)"
                stroke="var(--md-sys-color-primary)"
                strokeWidth="3"
                className="radar-area-user"
              />

              {/* User Dots */}
              {userPoints.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4.5" fill="var(--md-sys-color-primary)" />
              ))}
            </svg>
          </div>
          
          <div className="radar-insight">
            <span className="material-symbols-outlined">auto_awesome</span>
            <p>
              Your closest gap is in <strong>{skills.reduce((max, s) => (s.market - s.user) > (max.market - max.user) ? s : max, skills[0]).name}</strong>. We recommend building a project targeting this gap.
            </p>
          </div>
        </MaterialCard>
      </div>
    </div>
  );
};

export default SkillAnalysis;
