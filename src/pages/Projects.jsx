import React, { useState } from 'react';
import MaterialCard from '../components/MaterialCard';
import RippleButton from '../components/RippleButton';

const projectsData = {
  'Software Engineer': [
    {
      id: 'swe-1',
      title: 'Full Stack Task Manager',
      difficulty: 'Medium',
      time: '12-15 hrs',
      skills: ['Frontend (React)', 'Backend (Node.js)'],
      description: 'Build a secure, multi-tenant task manager with dynamic React boards and a Node/Express REST API utilizing JSON Web Tokens.',
      steps: [
        { id: 1, text: 'Design the relational or document-based DB schema.', checked: false },
        { id: 2, text: 'Initialize Express.js backend and set up router modules.', checked: false },
        { id: 3, text: 'Implement JWT authentication and secure middleware.', checked: false },
        { id: 4, text: 'Build responsive React interface using clean flex grids.', checked: false },
        { id: 5, text: 'Integrate React state with backend API using fetch/axios.', checked: false },
      ]
    },
    {
      id: 'swe-2',
      title: 'High-Throughput Redis-like Cache',
      difficulty: 'Hard',
      time: '18-20 hrs',
      skills: ['Backend (Node.js)', 'System Design'],
      description: 'Implement an in-memory key-value cache engine supporting LRU eviction, time-to-live policies, and basic TCP connection endpoints.',
      steps: [
        { id: 1, text: 'Create in-memory map store with constant-time access.', checked: false },
        { id: 2, text: 'Implement doubly-linked list for Least Recently Used eviction.', checked: false },
        { id: 3, text: 'Add TTL expiration scheduler using min-heaps or timeouts.', checked: false },
        { id: 4, text: 'Write a TCP listener to process custom text protocol requests.', checked: false },
        { id: 5, text: 'Load test the engine to verify concurrency safety.', checked: false },
      ]
    }
  ],
  'Product Manager': [
    {
      id: 'pm-1',
      title: 'E-commerce Mobile MVP Specification',
      difficulty: 'Medium',
      time: '8-10 hrs',
      skills: ['Product Strategy', 'UX Design'],
      description: 'Create a comprehensive Product Requirement Document (PRD) detailing user personas, wireframes, and release milestones for a checkout overhaul.',
      steps: [
        { id: 1, text: 'Perform user interviews and outline core friction points.', checked: false },
        { id: 2, text: 'Define MVP scope using MoSCoW prioritization methods.', checked: false },
        { id: 3, text: 'Draw interactive medium-fidelity checkout wireframes.', checked: false },
        { id: 4, text: 'Author structured user stories with detailed acceptance criteria.', checked: false },
      ]
    },
    {
      id: 'pm-2',
      title: 'Landing Page Growth A/B Test Case',
      difficulty: 'Medium',
      time: '6-8 hrs',
      skills: ['SQL & Analytics', 'A/B Testing'],
      description: 'Design and analyze an online experimentation hypothesis testing checkout button placements and copy revisions, parsing results with SQL queries.',
      steps: [
        { id: 1, text: 'Draft test hypothesis, sample size, and run duration limits.', checked: false },
        { id: 2, text: 'Write SQL query models to parse control vs variant conversion rates.', checked: false },
        { id: 3, text: 'Calculate statistical significance using Z-score test methods.', checked: false },
        { id: 4, text: 'Author a recommendation deck summarizing business outcomes.', checked: false },
      ]
    }
  ],
  'Data Scientist': [
    {
      id: 'ds-1',
      title: 'Predictive Real Estate Valuation Engine',
      difficulty: 'Hard',
      time: '15-18 hrs',
      skills: ['Python Coding', 'Machine Learning', 'Statistics'],
      description: 'Develop a regression model in Python predicting housing costs based on features, evaluating performance metrics and feature importance ratios.',
      steps: [
        { id: 1, text: 'Perform exploratory data analysis (EDA) using matplotlib/seaborn.', checked: false },
        { id: 2, text: 'Clean missing records and encode categorical variables.', checked: false },
        { id: 3, text: 'Fit Random Forest and XGBoost regression estimators.', checked: false },
        { id: 4, text: 'Evaluate models using R-squared, RMSE, and cross-validation.', checked: false },
        { id: 5, text: 'Interpret feature importance scores using SHAP values.', checked: false },
      ]
    },
    {
      id: 'ds-2',
      title: 'Real-time Server Log ETL Pipeline',
      difficulty: 'Hard',
      time: '12-14 hrs',
      skills: ['Python Coding', 'Cloud Pipelines'],
      description: 'Construct a data pipeline extracting raw JSON server log directories, mapping structures, and cleaning records before loading into databases.',
      steps: [
        { id: 1, text: 'Write a Python daemon monitoring target log folder streams.', checked: false },
        { id: 2, text: 'Parse logs and sanitize corrupted or empty fields.', checked: false },
        { id: 3, text: 'Write transformed rows in batched blocks to a SQLite database.', checked: false },
        { id: 4, text: 'Add exception logging notifications for pipeline halts.', checked: false },
      ]
    }
  ]
};

const Projects = ({ profile }) => {
  const currentRole = profile.targetRole || 'Software Engineer';
  const [activeProjects, setActiveProjects] = useState(projectsData[currentRole]);
  const [selectedProjectId, setSelectedProjectId] = useState(activeProjects[0]?.id || '');

  // Update projects list when role changes
  React.useEffect(() => {
    const fresh = projectsData[currentRole] || [];
    setActiveProjects(fresh);
    setSelectedProjectId(fresh[0]?.id || '');
  }, [currentRole]);

  const handleStepToggle = (projectId, stepId) => {
    const updated = activeProjects.map((proj) => {
      if (proj.id === projectId) {
        return {
          ...proj,
          steps: proj.steps.map((step) => {
            if (step.id === stepId) {
              return { ...step, checked: !step.checked };
            }
            return step;
          })
        };
      }
      return proj;
    });
    setActiveProjects(updated);
  };

  const selectedProject = activeProjects.find((p) => p.id === selectedProjectId);

  return (
    <div className="projects-container">
      <header className="projects-header">
        <div>
          <h1>Tailored Portfolio Projects</h1>
          <p className="text-muted">Targeted projects to build evidence for your target skills in: <strong>{currentRole}</strong></p>
        </div>
      </header>

      <div className="projects-layout">
        {/* Left Side: Projects Listing Menu */}
        <div className="projects-sidebar">
          <h3>Available Recommendations</h3>
          <p className="text-muted" style={{ marginBottom: '1rem' }}>Matched to your current skill gaps</p>
          
          <div className="project-menu-list">
            {activeProjects.map((proj) => {
              const checkedCount = proj.steps.filter((s) => s.checked).length;
              const percent = Math.round((checkedCount / proj.steps.length) * 100);
              const isActive = proj.id === selectedProjectId;

              return (
                <div
                  key={proj.id}
                  className={`project-menu-item ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedProjectId(proj.id)}
                >
                  <div className="project-menu-header">
                    <h4>{proj.title}</h4>
                    <span className={`badge ${proj.difficulty === 'Hard' ? 'badge-error' : 'badge-primary'}`}>
                      {proj.difficulty}
                    </span>
                  </div>
                  
                  <div className="project-menu-info">
                    <span>{proj.time}</span>
                    <span>{percent}% done</span>
                  </div>
                  
                  <div className="project-menu-bar">
                    <div className="project-menu-bar-fill" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Project Details & Checklist */}
        <div className="project-detail">
          {selectedProject ? (
            <MaterialCard variant="elevated" className="detail-card">
              <div className="detail-title-row">
                <h2>{selectedProject.title}</h2>
                <div className="detail-meta">
                  <span className="badge badge-secondary">{selectedProject.time}</span>
                  <span className="badge badge-tertiary">{selectedProject.difficulty}</span>
                </div>
              </div>

              <p className="detail-description">{selectedProject.description}</p>

              <div className="detail-skills">
                <h4>Skills Addressed:</h4>
                <div className="detail-skills-list">
                  {selectedProject.skills.map((skill) => (
                    <span key={skill} className="badge badge-primary">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="detail-checklist-section">
                <h3>Build Checklist</h3>
                <p className="text-muted">Complete these sequential specifications to finish the portfolio item.</p>

                <div className="checklist-items">
                  {selectedProject.steps.map((step) => (
                    <label key={step.id} className={`checklist-item ${step.checked ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={step.checked}
                        onChange={() => handleStepToggle(selectedProject.id, step.id)}
                        className="checklist-checkbox"
                      />
                      <span className="checklist-text">{step.text}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="detail-status-bar">
                {selectedProject.steps.every(s => s.checked) ? (
                  <div className="success-banner animate-float">
                    <span className="material-symbols-outlined">verified</span>
                    <div>
                      <strong>Project Complete!</strong>
                      <p>Add this to your resume and GitHub. Ready for the roadmap update?</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted">
                    {selectedProject.steps.filter((s) => s.checked).length} of {selectedProject.steps.length} tasks completed
                  </p>
                )}
              </div>
            </MaterialCard>
          ) : (
            <div className="project-empty-state">
              <span className="material-symbols-outlined">construction</span>
              <p>No project selected. Choose one from the recommendations list.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
