import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, AlertCircle, Sparkles } from 'lucide-react';
import { signin } from '../services/user'; 
import { getMyDetails } from '../services/user'; 

interface ErrorState {
  email?: string;
  password?: string;
  general?: string;
}

const Login = () => {

  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [errors, setErrors] = useState<ErrorState>({});
  const [isLoading, setIsLoading] = useState(false);

  const getDashboardRedirect = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'DOCTOR':
        return '/doctor-dashboard';
      case 'PATIENT':
      default:
        return '/patient-dashboard';
    }
  };

  // If user is already logged in, redirect to their dashboard
  useEffect(() => {
    if (user) {
      navigate(getDashboardRedirect(user.role), { replace: true });
    }
  }, [user, navigate]);

  const validateForm = (): boolean => {
    const tempErrors: ErrorState = {};
    let isValid = true;

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

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setIsLoading(true);

    try {

      const response: any = await signin({ email, password });
      
   
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      const details = await getMyDetails();
      setUser(details.data);

      navigate(getDashboardRedirect(details.data.role), { replace: true });

    } catch (err: any) {
      console.error('Login action encountered error:', err);
      
      if (!err.response) {
        setErrors({
          general: 'Backend connection failed. Is your Spring Boot app running at http://localhost:8080?',
        });
      } else {
        const backendMessage = err.response?.data?.message || 'Invalid email or password.';
        setErrors({ general: backendMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      id="login-container" 
      className="min-h-screen relative flex items-center justify-center bg-gradient-to-tr from-[#abc9d8] via-[#e8f1f5] to-white overflow-hidden px-4 font-sans text-[#082e3e]"
    >
      {/* Brand Watermark / Ambient Aesthetics */}
      <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-[#8eb5ca]/20 to-transparent pointer-events-none" />
      <div className="absolute top-12 left-12 hidden md:block select-none pointer-events-none">
        <span className="text-2xl font-black tracking-tight text-[#082e3e]">Clini<span className="text-[#8eb5ca]">Q</span></span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10"
      >
        <div 
          id="login-card" 
          className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-[0_20px_50px_rgba(8,46,62,0.08)] p-8 md:p-10"
        >
          
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3.5 bg-[#e3edf2] relative rounded-3xl mb-4 border border-white">
              <Sparkles className="w-7 h-7 text-[#082e3e]" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#082e3e] tracking-tight">Let's find you</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">Access CliniQ professional healthcare portal</p>
          </div>

          {/* General/Backend Errors */}
          {errors.general && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 text-xs border border-red-100 flex items-start space-x-2 text-red-800 shadow-xs">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email-input" className="block text-[11px] font-bold text-[#082e3e]/80 uppercase tracking-widest mb-1.5 ml-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email-input"
                  type="email"
                  className={`w-full bg-white/70 border ${
                    errors.email ? 'border-red-300' : 'border-slate-200/80'
                  } focus:outline-none focus:ring-4 focus:ring-[#8eb5ca]/15 focus:border-[#8eb5ca] transition-all rounded-[1.25rem] py-3 pl-11 pr-4 text-[#082e3e] placeholder-slate-400/90 text-sm`}
                  placeholder="name@provider.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.email}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password-input" className="block text-[11px] font-bold text-[#082e3e]/80 uppercase tracking-widest ml-1">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password-input"
                  type="password"
                  className={`w-full bg-white/70 border ${
                    errors.password ? 'border-red-300' : 'border-slate-200/80'
                  } focus:outline-none focus:ring-4 focus:ring-[#8eb5ca]/15 focus:border-[#8eb5ca] transition-all rounded-[1.25rem] py-3 pl-11 pr-4 text-[#082e3e] placeholder-slate-400/90 text-sm`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.password}</p>}
            </div>

            <button
              id="login-btn"
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#082e3e] hover:bg-[#0d3b4f] active:scale-[0.98] transition-all duration-200 shadow-md shadow-[#082e3e]/10 font-bold rounded-[1.25rem] py-3.5 px-4 text-white flex items-center justify-center space-x-2 mt-6 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle View */}
          <div className="mt-8 text-center text-xs text-slate-500 border-t border-slate-100 pt-5 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#082e3e] font-extrabold hover:underline">
              Create one now
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;