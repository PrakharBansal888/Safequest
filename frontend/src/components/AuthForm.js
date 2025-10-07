import React from 'react';

const AuthForm = ({
  type,
  username,
  setUsername,
  email,
  setEmail,
  emailOrUsername,
  setEmailOrUsername,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  handleAuth,
  error,
  setStage,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-orange-500/15 to-yellow-500/15 rounded-full blur-2xl animate-float-slow"></div>
      </div>

      {/* Main auth card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 animate-fade-in">
          
          {/* Logo/Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
              {/* Code-rendered padlock icon */}
              <svg width="32" height="32" viewBox="0 0 32 32" className="text-white">
                <defs>
                  <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#e0e7ff" />
                  </linearGradient>
                </defs>
                <rect x="8" y="16" width="16" height="12" rx="2" fill="none" stroke="url(#iconGradient)" strokeWidth="2"/>
                <circle cx="16" cy="20" r="2" fill="url(#iconGradient)"/>
                <rect x="15" y="20" width="2" height="4" fill="url(#iconGradient)"/>
                <path d="M 12 16 Q 12 10, 16 10 Q 20 10, 20 16" fill="none" stroke="url(#iconGradient)" strokeWidth="2"/>
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 tracking-tight">
              {type === 'login' ? 'Welcome Back' : 'Join SafeQuest'}
            </h2>
            <p className="text-gray-600 mt-2 font-medium">
              {type === 'login' ? 'Sign in to continue your adventure' : 'Create your account to get started'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleAuth(type); }} className="space-y-6">
            
            {/* Username Input (for signup) */}
            {type === 'signup' && (
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 text-gray-800 font-medium placeholder-gray-500 text-lg"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Input (for signup) or Email/Username Input (for login) */}
            <div className="space-y-2">
              <div className="relative">
                {type === 'signup' ? (
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 text-gray-800 font-medium placeholder-gray-500 text-lg"
                    required
                  />
                ) : (
                  <input
                    type="text"
                    placeholder="Username or email"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 text-gray-800 font-medium placeholder-gray-500 text-lg"
                    required
                  />
                )}
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 text-gray-800 font-medium placeholder-gray-500 text-lg"
                  required
                />
              </div>
            </div>

            {/* Confirm Password for Signup */}
            {type === 'signup' && (
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 text-gray-800 font-medium placeholder-gray-500 text-lg"
                    required
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
                <p className="text-red-700 font-medium text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-5 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 text-lg tracking-wide"
            >
              {type === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Switch Form Type */}
          <div className="text-center mt-8">
            <button 
              onClick={() => setStage(type === 'login' ? 'signup' : 'login')} 
              className="text-gray-600 hover:text-blue-600 font-semibold transition-colors duration-200 text-lg"
            >
              {type === 'login' 
                ? "Don't have an account? Sign Up" 
                : "Already have an account? Sign In"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;