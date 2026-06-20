import React, { useState } from 'react';
import MaterialCard from '../components/MaterialCard';
import RippleButton from '../components/RippleButton';

const roadmapData = {
  'Software Engineer': [
    {
      id: 'step-1',
      title: 'Core Foundations Mastery',
      subtitle: 'Build basics in computing structures',
      description: 'Master fundamentals like Time/Space complexity, basic array manipulations, hash maps, and recursive algorithms.',
      icon: 'school',
      done: true,
    },
    {
      id: 'step-2',
      title: 'Backend API Development',
      subtitle: 'Construct core application logic',
      description: 'Learn to design database schemas, write Express routers, configure CORS, and build secure authentication flows.',
      icon: 'database',
      done: true,
    },
    {
      id: 'step-3',
      title: 'React Client Integration',
      subtitle: 'Construct client-side interfaces',
      description: 'Build rich user components, manage app state with React hooks, and integrate with backend APIs securely.',
      icon: 'web',
      done: false,
    },
    {
      id: 'step-4',
      title: 'Portfolio Hosting & Review',
      subtitle: 'Publish code for reviews',
      description: 'Deploy codebases to cloud services, construct readme summaries, and request feedback from community peers.',
      icon: 'cloud_upload',
      done: false,
    },
    {
      id: 'step-5',
      title: 'Behavioral & Technical Rounds',
      subtitle: 'Land the final offer',
      description: 'Run through mock simulator sessions, review STAR behavioral answers, and study system design patterns.',
      icon: 'military_tech',
      done: false,
    }
  ],
  'Product Manager': [
    {
      id: 'step-1',
      title: 'PRD Specifications Mastery',
      subtitle: 'Write clear scope requirements',
      description: 'Define clear user stories, establish MoSCoW parameters, and create checkout mockups.',
      icon: 'edit_note',
      done: true,
    },
    {
      id: 'step-2',
      title: 'Analytics & Experimentations',
      subtitle: 'Master data thresholds',
      description: 'Run SQL log diagnostics, structure A/B testing thresholds, and determine Z-score bounds.',
      icon: 'query_stats',
      done: false,
    },
    {
      id: 'step-3',
      title: 'Agile Delivery Orchestration',
      subtitle: 'Coordinate engineers and designers',
      description: 'Practice sprint sizing, run estimations, structure retro summaries, and write ticket tasks.',
      icon: 'groups',
      done: false,
    },
    {
      id: 'step-4',
      title: 'Final Case Presentation Prep',
      subtitle: 'Pitch product visions',
      description: 'Organize high-level case study slides presenting business objectives and success indicators.',
      icon: 'presentation_chart',
      done: false,
    }
  ],
  'Data Scientist': [
    {
      id: 'step-1',
      title: 'Python & SQL Mastery',
      subtitle: 'Establish querying and parsing structures',
      description: 'Master advanced SQL joins, subqueries, Python data parsing libraries, and pandas aggregates.',
      icon: 'code',
      done: true,
    },
    {
      id: 'step-2',
      title: 'Statistical Hypothesis Testing',
      subtitle: 'Validate data observations',
      description: 'Master p-values, central limit theorems, normal distributions, and parametric calculations.',
      icon: 'calculate',
      done: true,
    },
    {
      id: 'step-3',
      title: 'Machine Learning Pipelines',
      subtitle: 'Build predictive estimates',
      description: 'Fit Random Forest classifiers, optimize hyper-parameters, and interpret validation bounds.',
      icon: 'auto_videoconference',
      done: false,
    },
    {
      id: 'step-4',
      title: 'ETL Cloud Implementations',
      subtitle: 'Host pipeline scripts',
      description: 'Construct automated CRON handlers parsing web events and feeding database structures in real-time.',
      icon: 'cloud_sync',
      done: false,
    }
  ]
};

const Roadmap = ({ profile, updateProfile }) => {
  const currentRole = profile.targetRole || 'Software Engineer';
  const [steps, setSteps] = useState(roadmapData[currentRole]);

  React.useEffect(() => {
    setSteps(roadmapData[currentRole] || []);
  }, [currentRole]);

  const handleToggleStep = (stepId) => {
    const updated = steps.map((s) => {
      if (s.id === stepId) {
        return { ...s, done: !s.done };
      }
      return s;
    });
    setSteps(updated);

    // Update readiness score based on roadmap completions
    const doneCount = updated.filter(s => s.done).length;
    const percent = Math.min(Math.round((doneCount / updated.length) * 100), 100);
    updateProfile({ readinessScore: percent });
  };

  return (
    <div className="roadmap-container">
      <header className="roadmap-header">
        <div>
          <h1>Career Roadmap</h1>
          <p className="text-muted">Vertical path milestones to transition to: <strong>{currentRole}</strong></p>
        </div>
      </header>

      <div className="roadmap-timeline-wrapper">
        {/* Dynamic connecting line background */}
        <div className="timeline-line" />

        <div className="roadmap-steps">
          {steps.map((step, index) => {
            const isDone = step.done;
            return (
              <div key={step.id} className={`roadmap-step-item ${isDone ? 'completed' : ''}`}>
                
                {/* Node Dot Icon */}
                <div 
                  className={`roadmap-node ${isDone ? 'node-done' : ''}`}
                  onClick={() => handleToggleStep(step.id)}
                  title="Click to toggle completion status"
                >
                  <span className="material-symbols-outlined node-icon">
                    {isDone ? 'check' : step.icon}
                  </span>
                </div>

                {/* Milestone Detail Card */}
                <MaterialCard 
                  variant={isDone ? 'filled' : 'outlined'} 
                  className={`roadmap-card-detail ${isDone ? 'completed-card' : ''}`}
                >
                  <div className="card-header-row">
                    <div>
                      <span className="step-tag">Milestone {index + 1}</span>
                      <h3>{step.title}</h3>
                      <p className="step-subtitle">{step.subtitle}</p>
                    </div>
                    
                    <RippleButton 
                      variant={isDone ? 'filled' : 'outlined'} 
                      icon={isDone ? 'task_alt' : 'circle'}
                      onClick={() => handleToggleStep(step.id)}
                      style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                    >
                      {isDone ? 'Completed' : 'Mark Done'}
                    </RippleButton>
                  </div>
                  
                  <p className="step-description">{step.description}</p>
                </MaterialCard>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
