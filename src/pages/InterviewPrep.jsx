import React, { useState } from 'react';
import MaterialCard from '../components/MaterialCard';
import RippleButton from '../components/RippleButton';

const interviewData = {
  'Software Engineer': [
    {
      id: 'q-swe-1',
      category: 'Technical',
      question: 'Explain the difference between useEffect with an empty dependency array and useEffect with no dependency array in React.',
      modelAnswer: 'An empty array [] means the effect runs once after the initial render (like componentDidMount). No array means the effect runs after EVERY single render, which can cause severe performance issues or infinite loops if state is updated inside.',
    },
    {
      id: 'q-swe-2',
      category: 'System Design',
      question: 'How would you design a rate limiter for a public-facing API with millions of users?',
      modelAnswer: 'Use the Token Bucket or Leaky Bucket algorithm. Redis is ideal for storage due to speed, using key structures like IP addresses with TTL counters. We can use sliding window logs for high precision.',
    }
  ],
  'Product Manager': [
    {
      id: 'q-pm-1',
      category: 'Behavioral',
      question: 'Tell me about a time when you had to make a critical product decision without complete data. How did you proceed?',
      modelAnswer: 'Use the STAR method. Focus on identifying the core customer pain, establishing risk containment parameters (e.g. MVP release to 5% traffic), metrics monitoring, and subsequent iteration based on early telemetry.',
    },
    {
      id: 'q-pm-2',
      category: 'Product Strategy',
      question: 'How would you measure the success of integrating Google Maps into a ride-hailing application?',
      modelAnswer: 'Primary metrics: ETA accuracy reduction in driver search cancellations, and session booking completion rate. Guardrail metrics: Map API costs and application crash frequencies.',
    }
  ],
  'Data Scientist': [
    {
      id: 'q-ds-1',
      category: 'Technical',
      question: 'What is overfitting in machine learning, and what regularizations would you apply to prevent it?',
      modelAnswer: 'Overfitting occurs when a model learns noise in training data instead of general patterns. Address it via L1 (Lasso) / L2 (Ridge) penalties, dropout layers in deep networks, or tree pruning limits in random forests.',
    }
  ]
};

const flashcards = [
  { q: 'What is the STAR interview method?', a: 'Situation, Task, Action, Result. The standard framework for answering behavioral interview questions.' },
  { q: 'What is a "System Bottleneck"?', a: 'A resource limit (CPU, Memory, Network, DB connection) that restricts the overall throughput of a software system.' },
  { q: 'Define "A/B Testing significance".', a: 'The probability that the observed difference between Control and Variant is not due to random chance. Typically p < 0.05.' },
];

const InterviewPrep = ({ profile }) => {
  const currentRole = profile.targetRole || 'Software Engineer';
  const questions = interviewData[currentRole] || interviewData['Software Engineer'];
  
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [simState, setSimState] = useState('idle'); // idle, grading, graded
  const [feedback, setFeedback] = useState(null);

  // Flashcards state
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const activeQuestion = questions[activeQuestionIndex] || questions[0];

  const handleGradeAnswer = () => {
    if (!userAnswer.trim()) return;
    setSimState('grading');

    setTimeout(() => {
      // Generate dynamic simulated grading based on answer length/keywords
      const length = userAnswer.length;
      let score = 'Needs Improvement';
      let bulletPoints = [];

      if (length > 150) {
        score = 'Outstanding';
        bulletPoints = [
          'Excellent structural organization showing deep conceptual knowledge.',
          'Great inclusion of practical terminology relevant to the field.',
          'Strong communication style matching professional interview expectations.'
        ];
      } else if (length > 50) {
        score = 'Good';
        bulletPoints = [
          'Correct core premise with a solid explanation.',
          'Consider expanding on edge cases or production trade-offs in real interviews.',
          'Communications are clear, but could benefit from a structured layout.'
        ];
      } else {
        score = 'Needs Work';
        bulletPoints = [
          'Answer is too brief. Try to flesh out your reasoning using the STAR or specific code examples.',
          'Key parameters and background context were omitted.',
          'Practice explaining details out loud to structure longer answers.'
        ];
      }

      setFeedback({ score, bullets: bulletPoints });
      setSimState('graded');
    }, 1500);
  };

  const handleNextQuestion = () => {
    setUserAnswer('');
    setSimState('idle');
    setFeedback(null);
    setActiveQuestionIndex((prev) => (prev + 1) % questions.length);
  };

  return (
    <div className="interview-container">
      <header className="interview-header">
        <div>
          <h1>AI Interview Practice</h1>
          <p className="text-muted">Interactive simulator providing grading and model comparison feedback for: <strong>{currentRole}</strong></p>
        </div>
      </header>

      <div className="interview-layout">
        {/* Mock Interview Simulator */}
        <div className="simulator-section">
          {activeQuestion ? (
            <MaterialCard variant="outlined" className="sim-card">
              <div className="sim-q-header">
                <span className="badge badge-tertiary">{activeQuestion.category}</span>
                <span className="text-muted">Question {activeQuestionIndex + 1} of {questions.length}</span>
              </div>
              
              <h2 className="sim-q-text">{activeQuestion.question}</h2>

              {simState === 'idle' && (
                <div className="answer-input-wrapper">
                  <textarea
                    className="input-field answer-textarea"
                    placeholder="Type your detailed interview answer here... (minimum 50 characters recommended for AI review)"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />
                  <div className="answer-actions">
                    <RippleButton
                      variant="filled"
                      icon="analytics"
                      disabled={!userAnswer.trim()}
                      onClick={handleGradeAnswer}
                    >
                      Submit for AI Grading
                    </RippleButton>
                  </div>
                </div>
              )}

              {simState === 'grading' && (
                <div className="grading-placeholder">
                  <span className="material-symbols-outlined placeholder-icon spin-slow">reviews</span>
                  <p>Gemini evaluating response, syntax matching, and generating structured metrics...</p>
                </div>
              )}

              {simState === 'graded' && feedback && (
                <div className="graded-results">
                  <div className="graded-header">
                    <div>
                      <h4>AI Grade: <span className={`badge ${feedback.score === 'Outstanding' ? 'badge-success' : feedback.score === 'Good' ? 'badge-primary' : 'badge-error'}`} style={{ fontSize: '1rem', padding: '0.4rem 0.8rem' }}>{feedback.score}</span></h4>
                    </div>
                    <RippleButton variant="tonal" icon="arrow_forward" onClick={handleNextQuestion}>
                      Next Question
                    </RippleButton>
                  </div>

                  <div className="feedback-section">
                    <h5>Key Observations:</h5>
                    <ul>
                      {feedback.bullets.map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="model-answer-section">
                    <h5>Model Answer:</h5>
                    <p className="model-text">{activeQuestion.modelAnswer}</p>
                  </div>

                  <RippleButton variant="outlined" onClick={() => setSimState('idle')} style={{ alignSelf: 'flex-start' }}>
                    Try Question Again
                  </RippleButton>
                </div>
              )}
            </MaterialCard>
          ) : (
            <div className="empty-sim-state">
              <span className="material-symbols-outlined">forum</span>
              <p>No questions loaded for this path.</p>
            </div>
          )}
        </div>

        {/* Quick Flashcards Drill */}
        <div className="flashcards-section">
          <h3>Concept Drills</h3>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Flip cards to test core interview terms</p>

          <div className="flashcard-container" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
              {/* Front Side */}
              <div className="flashcard-front">
                <span className="material-symbols-outlined card-decor-icon">help_center</span>
                <h4>{flashcards[currentFlashcardIndex].q}</h4>
                <p className="click-to-flip">Click card to reveal answer</p>
              </div>

              {/* Back Side */}
              <div className="flashcard-back">
                <span className="material-symbols-outlined card-decor-icon">check_circle</span>
                <p className="answer-text">{flashcards[currentFlashcardIndex].a}</p>
                <p className="click-to-flip">Click card to hide</p>
              </div>
            </div>
          </div>

          <div className="flashcard-actions">
            <button
              className="btn btn-outlined btn-icon-only"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
                setCurrentFlashcardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
              }}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              {currentFlashcardIndex + 1} of {flashcards.length}
            </span>
            <button
              className="btn btn-outlined btn-icon-only"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
                setCurrentFlashcardIndex((prev) => (prev + 1) % flashcards.length);
              }}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;
