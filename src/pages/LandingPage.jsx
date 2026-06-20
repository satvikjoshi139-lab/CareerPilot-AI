import React, { useState } from 'react';
import RippleButton from '../components/RippleButton';
import MaterialCard from '../components/MaterialCard';

const LandingPage = ({ onGetStarted }) => {
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [simState, setSimState] = useState('idle'); // idle, analyzing, success
  const [matchedSkills, setMatchedSkills] = useState([]);

  const runDemo = (role) => {
    setSelectedRole(role);
    setSimState('analyzing');
    
    setTimeout(() => {
      let skills = [];
      if (role === 'Software Engineer') {
        skills = ['React', 'System Design', 'Node.js', 'Algorithms'];
      } else if (role === 'Product Manager') {
        skills = ['Product Strategy', 'UX Design', 'SQL', 'A/B Testing'];
      } else {
        skills = ['Python', 'TensorFlow', 'Data Wrangling', 'Statistics'];
      }
      setMatchedSkills(skills);
      setSimState('success');
    }, 1200);
  };

  return (
    <div className="landing-container">
      {/* 1. Hero Section */}
      <header className="hero-section">
        <div className="hero-badge animate-float">
          <span className="material-symbols-outlined hero-badge-icon">auto_awesome</span>
          <span>Powered by Gemini 3.5 AI</span>
        </div>
        
        <h1 className="hero-title">
          <span className="text-gradient">CareerPilot AI</span>
        </h1>
        
        <h2 className="hero-tagline">
          Your AI-Powered Career Command Center
        </h2>
        
        <p className="hero-subtitle">
          Assess skill gaps, build high-impact portfolio projects, train in interactive AI mock interviews, and pilot your path to your dream role with MD3 precision.
        </p>

        <div className="hero-actions">
          <RippleButton variant="filled" icon="rocket_launch" onClick={onGetStarted} style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem' }}>
            Enter Command Center
          </RippleButton>
          <RippleButton variant="outlined" icon="query_stats" onClick={() => document.getElementById('demo-section').scrollIntoView({ behavior: 'smooth' })}>
            Try Interactive Scan
          </RippleButton>
        </div>
      </header>

      {/* Interactive Demo Scan (Visual Hook) */}
      <section id="demo-section" className="demo-section">
        <MaterialCard variant="outlined" className="demo-container">
          <div className="demo-sidebar">
            <h3>Try a Quick Scan</h3>
            <p className="text-muted">Select a target career to query core skills dynamically.</p>
            
            <div className="demo-roles-list">
              {['Software Engineer', 'Product Manager', 'Data Scientist'].map((role) => (
                <button
                  key={role}
                  className={`demo-role-btn ${selectedRole === role ? 'active' : ''}`}
                  onClick={() => runDemo(role)}
                >
                  {role}
                </button>
              ))}
            </div>
            
            <RippleButton variant="tonal" onClick={() => runDemo(selectedRole)} disabled={simState === 'analyzing'}>
              {simState === 'analyzing' ? 'Analyzing Market...' : 'Run Diagnostics'}
            </RippleButton>
          </div>

          <div className="demo-display">
            {simState === 'idle' && (
              <div className="demo-placeholder">
                <span className="material-symbols-outlined placeholder-icon animate-float">query_stats</span>
                <p>Click "Run Diagnostics" to scan skill matches for {selectedRole}.</p>
              </div>
            )}

            {simState === 'analyzing' && (
              <div className="demo-placeholder">
                <span className="material-symbols-outlined placeholder-icon spin-slow">sync</span>
                <p>Scanning job descriptions, indexing requirements, and parsing career maps...</p>
              </div>
            )}

            {simState === 'success' && (
              <div className="demo-results">
                <div className="result-header">
                  <span className="material-symbols-outlined success-icon">check_circle</span>
                  <div>
                    <h4>Diagnosis Complete</h4>
                    <p className="text-muted">Targeting: {selectedRole}</p>
                  </div>
                </div>
                
                <div className="skills-pill-container">
                  <p className="skills-title">Core Required Skills Found:</p>
                  <div className="skills-pills">
                    {matchedSkills.map((skill, index) => (
                      <span key={index} className="badge badge-primary animate-pill" style={{ animationDelay: `${index * 0.1}s` }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="next-action-teaser">
                  <span className="material-symbols-outlined">info</span>
                  <p>Ready to bridge these gaps? Your personalized command center will generate step-by-step projects for these skills.</p>
                </div>

                <RippleButton variant="filled" onClick={onGetStarted} style={{ marginTop: '1rem' }}>
                  Explore My Dashboard
                </RippleButton>
              </div>
            )}
          </div>
        </MaterialCard>
      </section>

      {/* 2. Features Grid */}
      <section className="features-section">
        <span className="section-badge">Platform Pillars</span>
        <h2 className="section-title">Comprehensive Career Steering Suite</h2>
        <p className="section-subtitle">A collection of custom modules that guide your career transition from diagnosis to onboarding.</p>

        <div className="features-grid">
          <MaterialCard variant="elevated" className="feature-item">
            <div className="feature-icon-wrapper icon-primary">
              <span className="material-symbols-outlined">psychology</span>
            </div>
            <h3>1. Skill Analysis</h3>
            <p>Assess your current strengths against actual real-time market requirements. Identify clear skill gaps instantly with our interactive radar chart visualization.</p>
          </MaterialCard>

          <MaterialCard variant="elevated" className="feature-item">
            <div className="feature-icon-wrapper icon-secondary">
              <span className="material-symbols-outlined">terminal</span>
            </div>
            <h3>2. Tailored Projects</h3>
            <p>Generate detailed portfolio projects that target your specific skill gaps. Follow structured checklists with live progress tracking indicators.</p>
          </MaterialCard>

          <MaterialCard variant="elevated" className="feature-item">
            <div className="feature-icon-wrapper icon-tertiary">
              <span className="material-symbols-outlined">forum</span>
            </div>
            <h3>3. Interview Simulator</h3>
            <p>Answer domain-specific questions in our mock simulator. Receive instant performance grades and model answers to build interview confidence.</p>
          </MaterialCard>

          <MaterialCard variant="elevated" className="feature-item">
            <div className="feature-icon-wrapper icon-success">
              <span className="material-symbols-outlined">alt_route</span>
            </div>
            <h3>4. Dynamic Roadmaps</h3>
            <p>Orchestrate your transition timeline with vertical roadmaps. Cross off achievements, link built projects, and trace your career readiness score.</p>
          </MaterialCard>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="how-it-works-section">
        <span className="section-badge">The Methodology</span>
        <h2 className="section-title">Four Steps to Career Transition</h2>
        <p className="section-subtitle">How CareerPilot AI transforms your raw background into recruiter-ready portfolio evidence.</p>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">01</div>
            <h4>Identify Skill Gaps</h4>
            <p>Query your target role and outline the delta between market standards and your current abilities using visual diagnostics.</p>
          </div>
          
          <div className="step-connector">
            <span className="material-symbols-outlined">arrow_forward</span>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <h4>Build Proof Projects</h4>
            <p>Develop step-by-step projects focused on your weakest skill categories to demonstrate practical domain competence.</p>
          </div>

          <div className="step-connector">
            <span className="material-symbols-outlined">arrow_forward</span>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <h4>Simulate Interviews</h4>
            <p>Hone your explanations of these projects using our interactive mock interview system with detailed AI grading feedback.</p>
          </div>

          <div className="step-connector">
            <span className="material-symbols-outlined">arrow_forward</span>
          </div>

          <div className="step-card">
            <div className="step-number">04</div>
            <h4>Navigate Milestone Milestones</h4>
            <p>Tick off learning, networking, and application steps on your interactive path until you land the final career offer.</p>
          </div>
        </div>
      </section>

      {/* 4. Testimonials Section */}
      <section className="testimonials-section">
        <span className="section-badge">User Stories</span>
        <h2 className="section-title">Success Stories from the Cockpit</h2>
        <p className="section-subtitle">See how professionals and career transitioners reached their target destinations.</p>

        <div className="testimonials-grid">
          <MaterialCard variant="outlined" className="testimonial-card">
            <div className="stars-row">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="material-symbols-outlined star-icon">star</span>
              ))}
            </div>
            <p className="testimonial-text">
              "The skill analysis pinpointed exactly what backend database principles I was missing. Building the Redis cache project gave me the confidence I needed to ace my technical rounds!"
            </p>
            <div className="testimonial-user">
              <div className="avatar-placeholder">SL</div>
              <div>
                <h4>Sophia Lin</h4>
                <p className="user-role">Transitioned to Full Stack Developer</p>
              </div>
            </div>
          </MaterialCard>

          <MaterialCard variant="outlined" className="testimonial-card">
            <div className="stars-row">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="material-symbols-outlined star-icon">star</span>
              ))}
            </div>
            <p className="testimonial-text">
              "The mock interview grading felt like having a lead PM coach. The STAR method drills helped me structure my answers concisely during high-pressure panels."
            </p>
            <div className="testimonial-user">
              <div className="avatar-placeholder">MS</div>
              <div>
                <h4>Marcus Sterling</h4>
                <p className="user-role">Transitioned to Product Manager</p>
              </div>
            </div>
          </MaterialCard>

          <MaterialCard variant="outlined" className="testimonial-card">
            <div className="stars-row">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="material-symbols-outlined star-icon">star</span>
              ))}
            </div>
            <p className="testimonial-text">
              "Following the vertical roadmap timeline kept me structured for 3 months. I loved watching my readiness score climb as I completed project milestones!"
            </p>
            <div className="testimonial-user">
              <div className="avatar-placeholder">ER</div>
              <div>
                <h4>Elena Rostova</h4>
                <p className="user-role">Transitioned to Data Scientist</p>
              </div>
            </div>
          </MaterialCard>
        </div>
      </section>

      {/* 5. Call To Action Section */}
      <section className="cta-premium-section">
        <div className="cta-glow" />
        <h2 className="cta-title">Ready to Take the Pilot Seat?</h2>
        <p className="cta-desc">
          Begin auditing your skills and building targeted projects today. Launch your CareerPilot command center for free.
        </p>
        
        <div className="cta-actions">
          <RippleButton variant="elevated" icon="rocket_launch" onClick={onGetStarted} style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem' }}>
            Get Started Free
          </RippleButton>
          <RippleButton variant="outlined" onClick={onGetStarted} style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#ffffff' }}>
            Learn More
          </RippleButton>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
