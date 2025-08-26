import React, { useState, useEffect } from 'react';
import { Heart, User, Mail, Lock, Phone, MapPin, Calendar, UserPlus, LogIn, Eye, EyeOff, XCircle, CheckCircle } from 'lucide-react';

// Main authentication component for the donor system.
// This component has been updated to communicate with a custom Node.js backend
// for handling user authentication and profile storage.
const DonorAuthSystem = ({ onAuthSuccess }) => {
  // IMPORTANT: Replace this with the URL of your deployed Node.js backend.
  // For local development, it will likely be something like 'http://localhost:3000'.
  const API_URL = 'http://localhost:3000/api/users';

  // --- STATE MANAGEMENT ---
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Login fields
    email: '',
    password: '',
    // Signup fields
    fullName: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    bloodGroup: '',
    location: '',
    userType: 'donor', // donor, recipient, hospital
    organsDonate: [],
    medicalHistory: '',
    emergencyContact: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // State for the custom modal messages
  const [message, setMessage] = useState(null);

  // --- FORM DATA & UI VARIABLES ---
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const availableOrgans = ['Heart', 'Liver', 'Kidney', 'Lungs', 'Cornea', 'Bone Marrow', 'Skin', 'Pancreas'];

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox input for organs
    if (name === 'organsDonate') {
      setFormData(prev => ({
        ...prev,
        organsDonate: checked 
          ? [...prev.organsDonate, value]
          : prev.organsDonate.filter(organ => organ !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (!isLogin) {
      if (!formData.fullName) newErrors.fullName = 'Full name is required';
      else if (formData.fullName.length < 2) newErrors.fullName = 'Name must be at least 2 characters';
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) newErrors.phone = 'Please enter a valid phone number';
      
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      else {
        const birthDate = new Date(formData.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 16) newErrors.dateOfBirth = 'You must be at least 16 years old';
      }
      
      if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
      if (!formData.location) newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage(null);

    const endpoint = isLogin ? `${API_URL}/login` : `${API_URL}/signup`;
    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        bloodGroup: formData.bloodGroup,
        location: formData.location,
        userType: formData.userType,
        organsDonate: formData.organsDonate,
        medicalHistory: formData.medicalHistory,
        emergencyContact: formData.emergencyContact,
      };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle server-side errors
        throw new Error(data.message || 'An unexpected error occurred.');
      }

      console.log(`${isLogin ? 'Login' : 'Signup'} successful!`, data);
      
      // Pass user data to the parent component.
      // The backend should return the user's details upon successful login/signup.
      onAuthSuccess({ ...data.user, uid: data.user.id });
      setMessage({ type: 'success', text: `${isLogin ? 'Login' : 'Account created'} successful! Redirecting...` });

    } catch (error) {
      console.error('Auth error:', error);
      setMessage({ type: 'error', text: error.message || 'An unexpected error occurred.' });
      setErrors({ api: error.message }); // Set a general API error
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      fullName: '',
      confirmPassword: '',
      phone: '',
      dateOfBirth: '',
      bloodGroup: '',
      location: '',
      userType: 'donor',
      organsDonate: [],
      medicalHistory: '',
      emergencyContact: ''
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };
  
  // Custom message modal to replace alert()
  const MessageModal = ({ type, text, onClose }) => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-sm text-center">
        <div className="flex justify-center mb-4">
          {type === 'success' ? (
            <CheckCircle className="w-12 h-12 text-green-500" />
          ) : (
            <XCircle className="w-12 h-12 text-red-500" />
          )}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{type === 'success' ? 'Success!' : 'Error'}</h3>
        <p className="text-gray-600 mb-4">{text}</p>
        <button
          onClick={onClose}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4 font-sans">
      {/* Custom Message Modal */}
      {message && <MessageModal type={message.type} text={message.text} onClose={() => setMessage(null)} />}

      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-white mr-2 animate-pulse" />
            <h1 className="text-2xl font-bold text-white">LifeConnect</h1>
          </div>
          <p className="text-red-100">Connecting donors with those in need</p>
        </div>

        {/* Form */}
        <div className="px-6 py-8 max-h-[80vh] overflow-y-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {isLogin ? 'Welcome Back' : 'Join Our Mission'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isLogin ? 'Sign in to your account' : 'Create your donor profile'}
            </p>
          </div>

          <div className="space-y-4">
            {!isLogin && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                {/* User Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type *
                  </label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="donor">🫀 Donor - I want to donate</option>
                    <option value="recipient">🙏 Recipient - I need donation</option>
                    <option value="hospital">🏥 Hospital/Medical Professional</option>
                  </select>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {!isLogin && (
              <>
                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                      errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group *
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                      errors.bloodGroup ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select your blood group</option>
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>🩸 {group}</option>
                    ))}
                  </select>
                  {errors.bloodGroup && <p className="text-red-500 text-sm mt-1">{errors.bloodGroup}</p>}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="City, State, Country"
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                {/* Organs to Donate (for donors only) */}
                {formData.userType === 'donor' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organs/Tissues Willing to Donate
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                      {availableOrgans.map(organ => (
                        <label key={organ} className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            name="organsDonate"
                            value={organ}
                            checked={formData.organsDonate.includes(organ)}
                            onChange={handleInputChange}
                            className="mr-2 text-red-500 focus:ring-red-500 rounded"
                          />
                          <span className="text-gray-700">{organ}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Select all that apply</p>
                  </div>
                )}

                {/* Emergency Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact (Optional)
                  </label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    placeholder="Emergency contact number"
                  />
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-4 rounded-lg hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {isLogin ? <LogIn className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
                  {isLogin ? 'Sign In to LifeConnect' : 'Join LifeConnect'}
                </div>
              )}
            </button>
          </div>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={switchMode}
                className="ml-2 text-red-500 hover:text-red-600 font-medium underline hover:no-underline transition-all"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default DonorAuthSystem;
