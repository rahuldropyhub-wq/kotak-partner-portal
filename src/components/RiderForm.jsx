import { useState } from 'react';
import CompanySelect from './CompanySelect';
import FileUpload from './FileUpload';
import SuccessPopup from './SuccessPopup';
import { companyData } from '../data/companyData';

const initialState = {
  // Step 1
  fullName: '',
  mobile: '',
  email: '',
  dob: '',
  age: '',
  gender: '',
  // Step 2
  workCategory: '',
  company: '',
  employmentType: '',
  riderId: '',
  weeklyEarnings: '',
  workingHours: '',
  vehicleOwnership: '',
  vehicleType: '',
  aadharFile: null,
  panFile: null,
};

export default function RiderForm() {
  const [form, setForm] = useState(initialState);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDobChange = (e) => {
    const dob = e.target.value;
    let age = '';
    if (dob) {
      const today = new Date();
      const birthDate = new Date(dob);
      let a = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) a--;
      age = String(a);
    }
    setForm((prev) => ({ ...prev, dob, age }));
  };

  const handleCategoryChange = (e) => {
    setForm((prev) => ({ ...prev, workCategory: e.target.value, company: '' }));
  };

  const handleCompanyChange = (companyName) => {
    setForm((prev) => ({ ...prev, company: companyName }));
  };

  const handleFileChange = (fieldName) => (file) => {
    setForm((prev) => ({ ...prev, [fieldName]: file }));
  };

  const filteredCompanies = form.workCategory
    ? companyData.filter((g) => g.category === form.workCategory)
    : companyData;

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company) {
      alert('Please select a Currently Working Company');
      return;
    }
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      // Append all text fields
      Object.keys(form).forEach(key => {
        if (key !== 'aadharFile' && key !== 'panFile' && form[key]) {
          formData.append(key, form[key]);
        }
      });
      // Append files
      if (form.aadharFile) formData.append('aadharFile', form.aadharFile);
      if (form.panFile) formData.append('panFile', form.panFile);

      const response = await fetch('/api/riders', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to submit');
      
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setForm(initialState);
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container">
      {showSuccess && <SuccessPopup onClose={handleCloseSuccess} />}
      <div className="form-card">

        {/* Header */}
        <div className="form-header">

          <h1>Rider Earnings Survey - Hyderabad </h1>
          <p>Please fill out your details and weekly earnings information for the Hyderabad region.</p>

          <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '12px', padding: '16px', marginTop: '1.5rem', textAlign: 'left' }}>
            <h3 style={{ color: '#0369A1', fontSize: '1rem', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              Exclusive Partner Benefits
            </h3>
            <p style={{ color: '#0C4A6E', fontSize: '0.9rem', margin: '0 0 8px 0', lineHeight: '1.5' }}>
              <strong>Grab this first-of-its-kind opportunity!</strong> For the first time ever, we are exclusively providing our delivery partners with:
            </p>
            <ul style={{ color: '#0C4A6E', fontSize: '0.9rem', margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li><strong>Special Cashbacks</strong></li>
              <li><strong>Instant Personal Loans</strong></li>
              <li><strong>Zero-fee Credit Cards</strong></li>
            </ul>
            <p style={{ color: '#0C4A6E', fontSize: '0.9rem', margin: '8px 0 0 0', lineHeight: '1.5', fontWeight: '500' }}>
              Complete this registration today to unlock these financial benefits.
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          <div className={`step-item ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-circle">
              {step > 1 ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : '1'}
            </div>
            <span className="step-label">Personal Info</span>
          </div>

          <div className={`step-line ${step > 1 ? 'completed' : ''}`} />

          <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <span className="step-label">Work Details</span>
          </div>
        </div>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <form onSubmit={handleNext}>
            <div className="step-section-title">Personal Information</div>

            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="e.g. Rakesh Kumar"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="mobile">Mobile Number *</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  placeholder="10-digit mobile"
                  pattern="[0-9]{10}"
                  value={form.mobile}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="e.g. rakesh@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dob">Date of Birth *</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={form.dob}
                  onChange={handleDobChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="age">Age *</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  placeholder="e.g. 24"
                  min="18"
                  max="65"
                  value={form.age}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender *</label>
              <select id="gender" name="gender" value={form.gender} onChange={handleChange} required>
                <option value="" disabled>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="step-actions">
              <button type="submit" className="submit-btn">
                Next: Work Details →
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <div className="step-section-title">Work & Vehicle Details</div>

            {/* Work Category */}
            <div className="form-group">
              <label htmlFor="workCategory">Work Category *</label>
              <select
                id="workCategory"
                name="workCategory"
                value={form.workCategory}
                onChange={handleCategoryChange}
                required
              >
                <option value="" disabled>Select Work Category</option>
                {companyData.map((group) => (
                  <option key={group.category} value={group.category}>
                    {group.category}
                  </option>
                ))}
              </select>
            </div>

            {/* Company */}
            <div className="form-group">
              <label>Currently Working Company *</label>
              <CompanySelect
                value={form.company}
                onChange={handleCompanyChange}
                filteredData={filteredCompanies}
              />
            </div>

            {/* Employment Type */}
            <div className="form-group">
              <label htmlFor="employmentType">Employment Type</label>
              <select
                id="employmentType"
                name="employmentType"
                value={form.employmentType}
                onChange={handleChange}
                style={!form.company ? { color: '#94A3B8' } : {}}
              >
                <option value="" disabled style={{ color: '#94A3B8' }}>
                  {form.company ? 'Select employment type' : 'Select platform(s) above'}
                </option>
                <option value="fulltime">Full-time</option>
                <option value="parttime">Part-time</option>
              </select>
              <div className="employment-hint">
                <p><strong>Full-time:</strong> <span>the rider works exclusively for one platform.</span></p>
                <p><strong>Part-time:</strong> <span>the rider works for multiple platforms (e.g., Swiggy + Zomato, Blinkit + others).</span></p>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="riderId">Rider ID (Optional)</label>
                <input
                  type="text"
                  id="riderId"
                  name="riderId"
                  placeholder="e.g. RDR-1234"
                  value={form.riderId}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="weeklyEarnings">Avg. Weekly Earnings (₹) *</label>
                <input
                  type="number"
                  id="weeklyEarnings"
                  name="weeklyEarnings"
                  placeholder="e.g. 5000"
                  min="0"
                  value={form.weeklyEarnings}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="workingHours">Working Hours / Week *</label>
                <input
                  type="number"
                  id="workingHours"
                  name="workingHours"
                  placeholder="e.g. 40"
                  min="1"
                  max="168"
                  value={form.workingHours}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Two-wheeler Notice */}
            <div className="notice-banner">
              <span className="notice-icon">🛵</span>
              <div>
                <strong>Two-wheeler only</strong>
                <p>This study is restricted to two-wheeler delivery riders. Passenger / bike-taxi riders are not eligible.</p>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="vehicleOwnership">Vehicle Ownership *</label>
                <select id="vehicleOwnership" name="vehicleOwnership" value={form.vehicleOwnership} onChange={handleChange} required>
                  <option value="" disabled>Select Ownership</option>
                  <option value="own">Own</option>
                  <option value="rental">Rental</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="vehicleType">Vehicle Type *</label>
                <select id="vehicleType" name="vehicleType" value={form.vehicleType} onChange={handleChange} required>
                  <option value="" disabled>Select Vehicle Type</option>
                  <option value="bike">Bike</option>
                  <option value="scooter">Scooter</option>
                  <option value="electric_vehicle">Electric Vehicle</option>
                  <option value="bicycle">Bicycle</option>
                </select>
              </div>
            </div>

            {/* Documents */}
            <div className="form-row">
              <FileUpload
                id="aadharFile"
                label="Aadhar Card"
                required
                accept=".jpg,.jpeg,.png,.pdf"
                fileName={form.aadharFile?.name ?? ''}
                onChange={handleFileChange('aadharFile')}
              />
              <FileUpload
                id="panFile"
                label="PAN Card"
                required
                accept=".jpg,.jpeg,.png,.pdf"
                fileName={form.panFile?.name ?? ''}
                onChange={handleFileChange('panFile')}
              />
            </div>

            {/* Navigation */}
            <div className="step-actions two-btn">
              <button type="button" className="back-btn" onClick={handleBack}>
                ← Back
              </button>
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Survey'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
