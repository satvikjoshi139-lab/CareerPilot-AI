import React, { useState } from 'react';
import MaterialCard from '../components/MaterialCard';
import RippleButton from '../components/RippleButton';

const ProfileSetup = ({ profile, updateProfile, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: profile.name || '',
    degree: profile.degree || '',
    currentSkills: profile.currentSkills ? profile.currentSkills.join(', ') : '',
    targetRole: profile.targetRole || 'Software Engineer',
    experience: profile.experience !== undefined ? profile.experience : '',
  });

  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) {
      tempErrors.name = 'Full Name is required';
    }
    if (!formData.degree.trim()) {
      tempErrors.degree = 'Degree or background program is required';
    }
    if (!formData.currentSkills.trim()) {
      tempErrors.currentSkills = 'Please list at least one current skill';
    }
    
    const expNum = Number(formData.experience);
    if (formData.experience === '' || isNaN(expNum) || expNum < 0) {
      tempErrors.experience = 'Experience must be a valid number of years (0 or greater)';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for that field on typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Process skills input (comma-separated list)
    const skillsArray = formData.currentSkills
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    const updatedProfile = {
      name: formData.name.trim(),
      degree: formData.degree.trim(),
      currentSkills: skillsArray,
      targetRole: formData.targetRole,
      experience: Number(formData.experience),
      // Automatically generate a baseline readiness score if updating first time
      readinessScore: profile.readinessScore || 50,
      profileCompleted: true,
    };

    // Save to LocalStorage
    localStorage.setItem('careerPilotProfile', JSON.stringify(updatedProfile));

    // Update global state
    updateProfile(updatedProfile);

    // Show success alert
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      if (onSubmit) onSubmit();
    }, 1000);
  };

  return (
    <div className="profile-setup-container">
      <header className="profile-header animate-float">
        <span className="material-symbols-outlined profile-icon">account_circle</span>
        <h1>Career Command Profile Setup</h1>
        <p className="text-muted">Configure your academic and industry details to customize AI recommendations.</p>
      </header>

      <MaterialCard variant="elevated" className="profile-card">
        <form onSubmit={handleFormSubmit} className="profile-form">
          
          {/* Success Banner */}
          {saveSuccess && (
            <div className="success-banner animate-pill" style={{ marginTop: '0', marginBottom: '1.5rem' }}>
              <span className="material-symbols-outlined">check_circle</span>
              <div>
                <strong>Profile Saved!</strong>
                <p>Telemetry updated. Redirecting to command center...</p>
              </div>
            </div>
          )}

          {/* Full Name */}
          <div className="input-group">
            <label className="input-label" htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className={`input-field ${errors.name ? 'input-error' : ''}`}
              placeholder="e.g. Alex Rivera"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error-text-msg">{errors.name}</span>}
          </div>

          {/* Target Role Dropdown */}
          <div className="input-group">
            <label className="input-label" htmlFor="targetRole">Target Career Role</label>
            <select
              id="targetRole"
              name="targetRole"
              className="input-field"
              value={formData.targetRole}
              onChange={handleChange}
            >
              <option value="Software Engineer">Software Engineer</option>
              <option value="Product Manager">Product Manager</option>
              <option value="Data Scientist">Data Scientist</option>
            </select>
          </div>

          {/* Degree */}
          <div className="input-group">
            <label className="input-label" htmlFor="degree">Highest Degree / Course</label>
            <input
              type="text"
              id="degree"
              name="degree"
              className={`input-field ${errors.degree ? 'input-error' : ''}`}
              placeholder="e.g. B.S. in Computer Science, Boot Camp Certificate"
              value={formData.degree}
              onChange={handleChange}
            />
            {errors.degree && <span className="error-text-msg">{errors.degree}</span>}
          </div>

          {/* Current Skills */}
          <div className="input-group">
            <label className="input-label" htmlFor="currentSkills">Current Skills (comma-separated)</label>
            <textarea
              id="currentSkills"
              name="currentSkills"
              className={`input-field textarea-skills ${errors.currentSkills ? 'input-error' : ''}`}
              placeholder="e.g. HTML, CSS, JavaScript, Basic Python"
              value={formData.currentSkills}
              onChange={handleChange}
              rows="3"
            />
            <span className="input-hint">List your existing skillset to compute matching gaps.</span>
            {errors.currentSkills && <span className="error-text-msg">{errors.currentSkills}</span>}
          </div>

          {/* Experience Years */}
          <div className="input-group">
            <label className="input-label" htmlFor="experience">Professional Experience (Years)</label>
            <input
              type="number"
              id="experience"
              name="experience"
              min="0"
              max="50"
              className={`input-field ${errors.experience ? 'input-error' : ''}`}
              placeholder="e.g. 2"
              value={formData.experience}
              onChange={handleChange}
            />
            {errors.experience && <span className="error-text-msg">{errors.experience}</span>}
          </div>

          {/* Action Row */}
          <div className="profile-actions-row">
            <RippleButton type="submit" variant="filled" icon="save">
              Save & Pilot Path
            </RippleButton>
          </div>
        </form>
      </MaterialCard>
    </div>
  );
};

export default ProfileSetup;
