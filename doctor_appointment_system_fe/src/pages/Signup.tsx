import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { motion } from 'motion/react';
import { User, Mail, Lock, Phone, HeartPulse, Activity, AlertCircle, UserPlus } from 'lucide-react';
import { register } from '../services/user';

interface ErrorState {
  fullName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  general?: string;
}

const Register = () => {
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();

  // Inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');

  // Experience state
  const [errors, setErrors] = useState<ErrorState>({});
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect to appropriate dashboard
  React.useEffect(() => {
    if (isAuthenticated && userRole) {
      navigate(userRole === 'ADMIN' ? '/admin/dashboard' : userRole === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard', { replace: true });
    }
  }, [isAuthenticated, userRole, navigate]);

  const validateForm = (): boolean => {
    const tempErrors: ErrorState = {};
    let isValid = true;

    if (!fullName.trim()) {
      tempErrors.fullName = 'Full Name is required';
      isValid = false;
    }

    if (!email) {
      tempErrors.email = 'Email address is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!password) {
      tempErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!phoneNumber.trim()) {
      tempErrors.phoneNumber = 'Phone Number is required';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setIsLoading(true);

    try {
   
      const response = await register({
        fullName,
        email,
        password,
        phoneNumber,
        bloodGroup: bloodGroup || undefined,
        medicalHistory: medicalHistory || undefined,
      });

      if (response.success) {
        navigate('/patient/dashboard', { replace: true });
      } else {
        setErrors({ general: response.message || 'Registration failed.' });
      }
    } catch (err: any) {
      console.error('Registration experienced an exception:', err);
      if (!err.response) {
        setErrors({
          general: 'Backend connection failed. Is your Spring Boot app running at http://localhost:8080?',
        });
      } else {
        const backendMessage = err.response?.data?.message || 'Email may already be registered.';
        setErrors({ general: backendMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div 
      id="register-container" 
      className="min-h-screen relative flex items-center justify-center bg-gradient-to-tr from-[#abc9d8] via-[#e8f1f5] to-white overflow-hidden py-12 px-4 font-sans text-[#082e3e]"
    >
      {/* Brand Watermark / Ambient Aesthetics */}
      <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-[#8eb5ca]/20 to-transparent pointer-events-none" />
      <div className="absolute top-12 left-12 hidden md:block select-none pointer-events-none">
        <span className="text-2xl font-black tracking-tight text-[#082e3e]">Clini<span className="text-[#8eb5ca]">Q</span></span>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl z-10"
      >
        <div 
          id="register-card" 
          className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-[0_20px_50px_rgba(8,46,62,0.08)] p-8 md:p-10"
        >
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3.5 bg-[#e3edf2] relative rounded-3xl mb-4 border border-white">
              <UserPlus className="w-7 h-7 text-[#082e3e]" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#082e3e] tracking-tight text-center">Create Account</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">Join the CliniQ health & treatment network today</p>
          </div>

          {/* General exception reporting */}
          {errors.general && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 text-xs border border-red-100 flex items-start space-x-2 text-red-800 shadow-xs">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold text-[#082e3e]/80 uppercase tracking-widest mb-1.5 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    className={`w-full bg-white/70 border ${
                      errors.fullName ? 'border-red-300' : 'border-slate-200/80'
                    } focus:outline-none focus:ring-4 focus:ring-[#8eb5ca]/15 focus:border-[#8eb5ca] transition-all rounded-[1.25rem] py-2.5 pl-11 pr-4 text-[#082e3e] placeholder-slate-400/90 text-sm`}
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                {errors.fullName && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-[#082e3e]/80 uppercase tracking-widest mb-1.5 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    className={`w-full bg-white/70 border ${
                      errors.email ? 'border-red-300' : 'border-slate-200/80'
                    } focus:outline-none focus:ring-4 focus:ring-[#8eb5ca]/15 focus:border-[#8eb5ca] transition-all rounded-[1.25rem] py-2.5 pl-11 pr-4 text-[#082e3e] placeholder-slate-400/90 text-sm`}
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold text-[#082e3e]/80 uppercase tracking-widest mb-1.5 ml-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    className={`w-full bg-white/70 border ${
                      errors.password ? 'border-red-300' : 'border-slate-200/80'
                    } focus:outline-none focus:ring-4 focus:ring-[#8eb5ca]/15 focus:border-[#8eb5ca] transition-all rounded-[1.25rem] py-2.5 pl-11 pr-4 text-[#082e3e] placeholder-slate-400/90 text-sm`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.password}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-[11px] font-bold text-[#082e3e]/80 uppercase tracking-widest mb-1.5 ml-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    className={`w-full bg-white/70 border ${
                      errors.phoneNumber ? 'border-red-300' : 'border-slate-200/80'
                    } focus:outline-none focus:ring-4 focus:ring-[#8eb5ca]/15 focus:border-[#8eb5ca] transition-all rounded-[1.25rem] py-2.5 pl-11 pr-4 text-[#082e3e] placeholder-slate-400/90 text-sm`}
                    placeholder="+1 (555) 019-2834"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                {errors.phoneNumber && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.phoneNumber}</p>}
              </div>

              {/* Blood Group (Optional) */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-[#082e3e]/80 uppercase tracking-widest mb-1.5 ml-1">
                  Blood Group (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <HeartPulse className="h-5 w-5 text-slate-400" />
                  </div>
                  <select
                    className="w-full bg-white/70 border border-slate-200/80 focus:outline-none focus:ring-4 focus:ring-[#8eb5ca]/15 focus:border-[#8eb5ca] transition-all rounded-[1.25rem] py-2.5 pl-11 pr-4 text-[#082e3e] text-sm appearance-none cursor-pointer"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Medical History (Optional) */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-[#082e3e]/80 uppercase tracking-widest mb-1.5 ml-1">
                  Medical History & Notes (Optional)
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3.5 pointer-events-none">
                    <Activity className="h-5 w-5 text-slate-400" />
                  </div>
                  <textarea
                    rows={3}
                    className="w-full bg-white/70 border border-slate-200/80 focus:outline-none focus:ring-4 focus:ring-[#8eb5ca]/15 focus:border-[#8eb5ca] transition-all rounded-[1.25rem] py-2.5 pl-11 pr-4 text-[#082e3e] placeholder-slate-400/90 text-sm resize-none"
                    placeholder="Describe pre-existing conditions, critical allergies, treatment histories..."
                    value={medicalHistory}
                    onChange={(e) => setMedicalHistory(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              id="register-btn"
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#082e3e] hover:bg-[#0d3b4f] active:scale-[0.98] transition-all duration-200 shadow-md shadow-[#082e3e]/10 font-bold rounded-[1.25rem] py-3.5 px-4 text-white flex items-center justify-center space-x-2 mt-6 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Register Account</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle View */}
          <div className="mt-8 text-center text-xs text-slate-500 border-t border-slate-100 pt-5 font-medium">
            Already have a healthcare account?{' '}
            <Link to="/login" className="text-[#082e3e] font-extrabold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;